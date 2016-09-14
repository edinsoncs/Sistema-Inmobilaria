var express = require('express');
var router = express.Router();

var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var url = require('url');
var async = require('async');

var flash = require('connect-flash');

var esid = require('randomid');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


var moment = require('moment');
var dateFormat = require('dateformat');
var now = new Date();

var adminticket = require('../models/admin');
var adminshowticket = require('../models/admintickets');

var resticket = require('../models/resticket');
var resticketuser = require('../models/resticketuser');

var bodyParser = require('body-parser');


router.get('/', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    var verifyUser = req.user.status;

    if(JSON.parse(verifyUser) !== false) {

    	

        if (req.user.propiedades) {

            res.render('panelservicios', {
                title: 'Panel de administración',
                user: req.user,
                cuenta: req.user.cuenta,
                nombre: req.user.nombre,
                empresa: req.user.empresa,
                menu: 'Inicio',
                serv: req.user.propiedades,
                foto: req.user.foto,
                disponibles: req.user.propiedadesDisponibles,
                agenda: req.user.agenda
            });
          
            console.log(req.user);

        } 

    } else {
        res.render('disable');
    }



    //Looking in  propiedades
    /*var date = new Date();
    var dia = date.getDate();

    user.findOne({ '_id': req.user._id }, function(err, doc) {
        if (err) {
            return err;
        } else {
            var propiedadesCant = doc.propiedades;
            var arrStatusPropiedades = [];

            for (var i = 0; i < propiedadesCant.length; i++) {

                var esProp = propiedadesCant[i].contratoInicia;
                var limiptFormat = itemReplace(esProp)
                var initializeArr = limiptFormat.split(' , ');


                var propiedadID = propiedadesCant[i].id;
                var propiedadFechaInicia = initializeArr[0][0] + initializeArr[0][1];

                var menosDias = Number(propiedadFechaInicia) - 7;  


                if(propiedadFechaInicia > 7) { //Correcto la propiedad es mayo

                    if(menosDias == dia) { // 23 == 23

                        //Aqui te quedastes
                        var idProperty = propiedadesCant[i].id;

                        user.findAndModify({
                            query: {
                                '_id': req.user._id,
                                propiedades: {
                                    $elemMatch: {
                                        'id': idProperty
                                    }
                                }
                            },                                                                                                      
                            update: {
                                $set: {
                                    'propiedades.$.estadoPago': false
                                }
                            },
                            new: true
                        }).success(function(data){
                            console.log('propiedad falta pagar');
                        });
                        
                    } else {
                        //console.log('no hay ningun dia que coincida');
                    }
                } else {
                    //console.log(propiedadFechaInicia);
                }

                    

                //console.log('Propiedad ID: ' + propiedadID);
                //console.log('Vence cada ' + propiedadFechaInicia);
            }
            //var n = doc.propiedades[0].contratoInicia;
        }
    });

    function itemReplace(text) {
        var go = text.replace('-', ',');
        var goReplace = go.replace('-', ',');
        return goReplace
    }*/



});

router.get('/disponibles', function(req, res, next) {

    res.render('disponibles', {
        title: 'Panel de administración',
        user: req.user,
        cuenta: req.user.cuenta,
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        menu: 'Disponibles',
        serv: req.user.propiedades,
        dispo: req.user.propiedadesDisponibles,
        foto: req.user.foto
    });

});

router.get('/agenda', function(req, res, next) {

    res.render('agenda', {
        title: 'Panel de administración',
        user: req.user,
        cuenta: req.user.cuenta,
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        menu: 'Agenda',
        serv: req.user.propiedades,
        dispo: req.user.propiedadesDisponibles,
        foto: req.user.foto,
        agenda: req.user.agenda
    });

});

router.get('/agenda/add', function(req, res, next) {

    res.render('newagenda', {
        title: 'Crear agenda',
        user: req.user,
        cuenta: req.user.cuenta,
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        menu: 'Agenda',
        serv: req.user.propiedades,
        disponibles: req.user.propiedadesDisponibles,
        user: req.user,
        foto: req.user.foto
    })

});

router.get('/edit', function(req, res, next) {

    function sendData(data) {
        if (data == 'empresa') {
            return req.user.empresa;
        } else if (data == 'email') {
            return req.user.email;
        } else if (data == 'apellidos') {
            return req.user.apellidos;
        } else if (data == 'dni') {
            return req.user.dni;
        } else if (data == 'foto') {
            return req.user.foto;
        }
    }

    res.render('edit', {
        title: 'Panel de administración',
        nombre: req.user.nombre,
        apellidos: sendData('apellidos'),
        empresa: sendData('empresa'),
        email: sendData('email'),
        dni: sendData('dni'),
        user: req.user,
        foto: sendData('foto')
    });
    console.log('editando user');
    console.log(req.user.foto);
});


router.post('/save', function(req, res, next) {


    function search(s) {
        if (s == 'dni') {
            return req.body.dni;
        } else if (s == 'nombre') {
            return req.body.name;
        } else if (s == 'apellidos') {
            return req.body.apellidos;
        } else if (s == 'email') {
            return req.body.email;
        } else if (s == 'dni') {
            return req.body.dni;
        }

    }

    var db = req.db;
    var users = db.get('usuarios');

    users.update({ '_id': req.user._id }, {
        $set: {
            'nombre': search('nombre'),
            'apellidos': search('apellidos'),
            'email': search('email'),
            'dni': search('dni')
        }
    }, function(err, doc) {
        try {
            req.flash('info', 'Se actualizo correctamente');
            res.redirect('/panel/edit')
        } catch (err) {
            return err;
        }
    });

});


router.post('/savefotopersonal', multipartMiddleware, function(req, res, next) {


    var db = req.db;
    var users = db.get('usuarios');

    fs.readFile(req.files.fotosubida.path, function(err, data) {
        try {
            var name = esid(4) + req.files.fotosubida.name;
            var newDirectory = path.join(__dirname, '..', 'public', 'fotoprofile/' + name);

            fs.writeFile(newDirectory, data, function(err) {
                if (err) {
                    return err;
                } else {
                    users.update({ '_id': req.user._id }, {
                        $set: {
                            'foto': name
                        }
                    }, function(err, doc) {
                        try {
                            req.flash('info', 'Se actualizo correctamente');
                            res.redirect('/panel/edit')
                        } catch (err) {
                            return err;
                        }
                    });

                }
            });

        } catch (err) {
            return err;
        }
    })

    /*users.update({ '_id': req.user._id }, {
        $set: {
            'foto': 
        }
    }, function(err, doc){
        try {
             req.flash('info', 'Se actualizo correctamente');
             res.redirect('/panel/edit')
        } catch(err) {
            return err;
        }
    });*/

});

router.get('/propiedades', function(req, res, next) {
    var reverseProp = req.user.propiedades;
    var reverse = reverseProp.reverse()
    res.render('propiedades', {
        title: 'Panel de administración',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        foto: req.user.foto,
        propiedades: reverse,
        user: req.user,
        menu: 'Propiedades'
    });
});


router.get('/propiedades/add', function(req, res, next) {

    res.render('add', {
        title: 'Nueva propiedad',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        user: req.user,
        foto: req.user.foto,
        menu: 'Propiedades'
    });

});


router.get('/disponibles/add', function(req, res, next) {

    res.render('add_disponibles', {
        title: 'Nueva propiedad',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        user: req.user,
        foto: req.user.foto,
        menu: 'Disponibles'
    });

});

router.get('/propiedades/show/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');



    user.findOne({ _id: req.user._id }, function(err, resultado) {
        var prop = resultado.propiedades;
        for (var i = 0; i < prop.length; i++) {
            if (prop[i].id == req.params.id) {

                if (prop[i].notificaciones) {
                    var notificacionesReverse = prop[i].notificaciones;
                    var reverseNotify = notificacionesReverse.reverse();
                }

                if (prop[i].pagos) {
                    var pagosReverse = prop[i].pagos;
                    var pagosShow = pagosReverse.reverse();
                }

                if (prop[i].pagosTotal) {
                    var cuentaTotalReverse = prop[i].pagosTotal;
                    var cuentaShow = cuentaTotalReverse.reverse();

                }

                res.render('show', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    notify: reverseNotify,
                    isPagos: pagosShow,
                    cuentaC: cuentaShow,
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });
            }
        }
    });


});

router.get('/disponibles/show/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');



    user.findOne({ _id: req.user._id }, function(err, resultado) {
        var prop = resultado.propiedadesDisponibles;

        for (var i = 0; i < prop.length; i++) {
            if (prop[i].id == req.params.id) {

                res.render('showdisponibles', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Disponibles'
                });
            }
        }

    });


});



router.get('/propiedades/notify/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ _id: req.user._id }, function(err, resultado) {
        var prop = resultado.propiedades;
        for (var i = 0; i < prop.length; i++) {
            if (prop[i].id == req.params.id) {

                if (prop[i].notificaciones) {
                    var notificacionesReverse = prop[i].notificaciones;
                    var reverseNotify = notificacionesReverse.reverse();
                }

                res.render('notify', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    notify: reverseNotify,
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });
            }
        }
    });

});

router.get('/propiedades/pagos/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');



    user.findOne({ _id: req.user._id }, function(err, resultado) {
        var prop = resultado.propiedades;
        for (var i = 0; i < prop.length; i++) {
            if (prop[i].id == req.params.id) {

                if (prop[i].pagos) {
                    var pagosReverse = prop[i].pagos;
                    var pagosShow = pagosReverse.reverse();
                }

                res.render('pagos', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    isPagos: pagosShow,
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });
            }
        }
    });


});

router.get('/propiedades/calendario/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ _id: req.user._id }, function(err, resultado) {
        if (err) {
            return err;
        } else {
            var prop = resultado.propiedades;
            for (var i = 0; i < prop.length; i++) {


                res.render('calendario', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    ca: prop[i].calendarioNotify,
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });

            }
        }
    });

});

router.get('/propiedades/calendariojson/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ _id: req.user._id }, function(err, resultado) {
        if (err) {
            return err;
        } else {
            var prop = resultado.propiedades;
            for (var i = 0; i < prop.length; i++) {
                res.json(prop[i].calendarioNotify);
            }
        }
    });
});

router.get('/propiedades/historial/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ _id: req.user._id }, function(err, resultado) {
        if (err) {
            return err;
        } else {
            var prop = resultado.propiedades;
            for (var i = 0; i < prop.length; i++) {


                res.render('historial', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    ca: prop[i].historialContrato,
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });

            }
        }
    });

});

router.get('/propiedades/servicios/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ _id: req.user._id }, function(err, resultado) {
        if (err) {
            return err;
        } else {
            var prop = resultado.propiedades;
            for (var i = 0; i < prop.length; i++) {


                res.render('servicios', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });

            }
        }
    });

});


router.get('/propiedades/verservicios/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ _id: req.user._id }, function(err, resultado) {
        if (err) {
            return err;
        } else {
            var prop = resultado.propiedades;
            for (var i = 0; i < prop.length; i++) {


                res.render('verservicios', {
                    title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    foto: req.user.foto,
                    user: req.user,
                    menu: 'Propiedades'
                });

            }
        }
    });

});





router.get('/propiedades/payments/:idpropiedad', function(req, res, next) {

    function showPropiedad() {
        return req.params.idpropiedad;
    }

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ '_id': req.user._id }, function(err, result) {
        if (err) {
            return err;
        } else {
            var propiedades = result.propiedades;
            for (var i = 0; i < propiedades.length; i++) {
                if (propiedades[i].id == showPropiedad()) {
                    var payments_Show = propiedades[i].pagos;
                    res.render('payments', {
                        title: propiedades[i].nombrePropiedad,
                        nombre: req.user.nombre,
                        empresa: req.user.empresa,
                        propiedadID: propiedades[i].id,
                        paymentsData: payments_Show.reverse(),
                        user: req.user,
                        menu: 'Propiedades'
                    });
                }
            }
        }
    });


});


router.get('/propiedades/notificaciones/:idpropiedad', function(req, res, next) {

    function showPropiedad() {
        return req.params.idpropiedad;
    }

    var db = req.db;
    var user = db.get('usuarios');

    user.findOne({ '_id': req.user._id }, function(err, result) {
        if (err) {
            return err;
        } else {
            var propiedades = result.propiedades;
            for (var i = 0; i < propiedades.length; i++) {
                if (propiedades[i].id == showPropiedad()) {
                    var notificaciones = propiedades[i].notificaciones;
                    res.render('notificaciones', {
                        title: propiedades[i].nombrePropiedad,
                        nombre: req.user.nombre,
                        empresa: req.user.empresa,
                        propiedadID: propiedades[i].id,
                        notify: notificaciones.reverse(),
                        user: req.user,
                        menu: 'Propiedades'
                    });
                }
            }
        }
    });


});




router.get('/config', function(req, res, next) {
    res.render('config', {
        title: 'Config Zimba',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        menu: 'Config',
        user: req.user,
        foto: req.user.foto
    });
});

router.get('/config/email', function(req, res, next) {
    res.render('email', {
        title: 'Config Email Zimba',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        emailTemplate: req.user.emailTemplate,
        menu: 'Config',
        user: req.user,
        foto: req.user.foto
    });
});

router.get('/ticket/support', function(req, res, next) {
    var reverseSupport;
    if (req.user.support) {
        var s = req.user.support;
        reverseSupport = s.reverse();
    }

    res.render('support', {
        title: 'Soporte Zimba',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        emailTemplate: req.user.emailTemplate,
        menu: 'Config',
        foto: req.user.foto,
        user: req.user,
        support: reverseSupport
    });
});

router.get('/ticket/view/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    var idticket = req.params.id;

    user.findOne({ '_id': req.user._id }, function(err, fulluser) {

        var findticket;

        if (fulluser.support) {

            findticket = fulluser.support;

            findticket.forEach(function(index, cant, arr) {

                if (index.id == idticket) {
                    res.render('viewticket', {
                        title: 'Soporte Zimba',
                        nombre: req.user.nombre,
                        empresa: req.user.empresa,
                        emailTemplate: req.user.emailTemplate,
                        menu: 'Config',
                        foto: req.user.foto,
                        user: req.user,
                        view: index
                    });
                }

            });


        } else {
            console.log('not id ticket');
        }




    });


});

router.get('/payment', function(req, res, next) {

    res.render('payment', {
        title: 'Payment Zimba',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        emailTemplate: req.user.emailTemplate,
        menu: 'Config',
        userComplet: req.user,
        user: req.user,
        foto: req.user.foto
    });

});

router.post('/addcreate', multipartMiddleware, function(req, res, next) {
    var db = req.db;
    var usuarios = db.get('usuarios');

    //var imgPath = req.files.img.path;
    var garantePath = req.files.garanteFile.path;
    var contratoPath = req.files.contrato.path;

    var namesArr = [garantePath, contratoPath];
    var namesFiles = [req.files.garanteFile.name, req.files.contrato.name];

    var idNameGarante = esid(6) + req.files.garanteFile.name;
    var idNameContrato = esid(6) + req.files.contrato.name;

    var historialArr = [];


    function idUser() {
        return req.user._id;
    }


    fs.readFile(garantePath, function(err, data) {

        if (err) {
            return err;
        } else {
            //var nameFile = esid(2) + req.files.garanteFile.name;
            var saveFile = path.join(__dirname, '..', 'public', 'files/' + idNameGarante);


            fs.writeFile(saveFile, data, function(err) {
                if (err) {
                    return err;
                } else {

                }
            })
        }

    });

    setTimeout(function() {

        fs.readFile(contratoPath, function(err, data) {

            if (err) {
                return err;
            } else {
                //var nameFile = esid(2) + req.files.contrato.name;
                var saveFile = path.join(__dirname, '..', 'public', 'files/' + idNameContrato);


                fs.writeFile(saveFile, data, function(err) {
                    if (err) {
                        return err;
                    } else {

                    }
                })
            }

        });

    }, 1000);




    usuarios.findAndModify({
        query: {
            '_id': req.user._id
        },
        update: {
            $push: {
                'propiedades': {
                    'id': esid(26),
                    'nombrePropiedad': req.body.nombrepropiedad,
                    'desPropiedad': req.body.despropiedad,
                    'barrio': req.body.barriopropiedad,


                    'nombreInquilino': req.body.nameinquilino,
                    'telInquilino': req.body.telinquilino,
                    'dniInquilino': req.body.dniinquilino,
                    'emailInquilino': req.body.emailinquilino,

                    'garanteNombre': req.body.garanteNombre,
                    'garanteTel': req.body.garanteTel,
                    'garanteDni': req.body.garanteDni,
                    'garanteEmail': req.body.garanteEmail,
                    'garanteFile': idNameGarante,
                    'garanteDomicilio': req.body.garanteDomicilio,

                    'propietarioNombre': req.body.propietarioNombre,
                    'propietarioTel': req.body.propietarioTel,
                    'propietarioDni': req.body.propietarioDni,
                    'propietarioEmail': req.body.propitarioEmail,
                    'propietarioDomicilio': req.body.propietarioDomicilio,

                    'historialContrato': contrato(req.body),
                    'serviciosMultimedia': Array,


                    'contratoInicia': req.body.contratoInicio,
                    'contratoFinaliza': req.body.contratoFin,

                    'contrato': idNameContrato,

                    'periodosPrecios': Array,
                    
                    'notificaciones': Array,
                    
                    'pagos': Array,
                    
                    'estadoPago': false,
                    
                    'pagosTotal': Array,

                    'precios': req.body.price,
                    
                    'cuentaCorriente': req.body.precioMensual,
                    
                    'calendarioNotify': Array

                }
            }
        },

        new: true

    }).success(function(done) {
        res.redirect('/panel/propiedades');
    });


    function contrato(body) {
        var inicia = body.contratoInicio;
        var finaliza = body.contratoFin;
        var mensual = body.precioMensual;

        var obj = {
            'inicia': inicia,
            'finaliza': finaliza,
            'mensual': mensual
        };

        historialArr.push(obj);

        return historialArr;
    } 




});

router.post('/newpoperti', function(req, res, next) {

    var db = req.db;
    var usuario = db.get('usuarios');

    console.log('hola');

    console.log(req.body);

    usuario.findAndModify({
        query: {
            '_id': req.user.id
        },
        update: {
            $push: {
                'propiedadesDisponibles': {
                    'id': esid(6),
                    'nombre': req.body.nombrepropiedad,
                    'description': req.body.despropiedad,
                    'barrio': req.body.barriopropiedad,
                    'propietario': req.body.propietarioNombre,
                    'telpropietario': req.body.propietarioTel,
                    'dnipropietario': req.body.propietarioDni,
                    'emailpropietario': req.body.propitarioEmail,
                    'domiciliopropietario': req.body.propietarioDomicilio,
                    'fecha': dataFecha(new Date())
                }
            }
        },
        new: true
    }).success(function(data) {
        res.redirect('/panel/disponibles')
    });



    function dataFecha(data) {

        var dia = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
            "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        var day = data.getDate();
        var dayStatus = data.getDay();
        var mes = data.getMonth();
        var year = data.getFullYear();


        for (var i = 0; i < dia.length; i++) {
            return dia[dayStatus] + " " + day + " del " + year;
        }

    }
});

router.post('/addagenda', function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');

    user.findAndModify({
        query: {
            '_id': req.user._id
        },
        update: {
            $push: {
                'agenda': {
                    'name': req.body.nombreagenda,
                    'propiedades': req.body.propiedades,
                    'namevisitante': req.body.namevisita,
                    'telvisita': req.body.telvisita,
                    'dnivisita': req.body.dnivisita,
                    'emailvisita': req.body.emailvisita,
                    'fechaagenda': req.body.fechaagenda,
                    'horario': req.body.horario
                }
            }
        },
        new: true
    }).success(function(data) {
        res.redirect('/panel/agenda');
    });
});


router.post('/savethisemail', multipartMiddleware, function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');

    var isLogo = req.files.logomail;
    var nombreEmpresa = req.body.nombreEmpresa
    var direccion = req.body.direccionEmpresa;
    var telefono = req.body.telEmpresa;
    var email = req.body.emailEmpresa;


    fs.readFile(isLogo.path, function(err, dataBuffer) {
        if (err) {
            return err;
        } else {
            var nameLogo = esid(6) + isLogo.name;
            var saveEmail = path.join(__dirname, '..', 'public', 'emails/' + nameLogo)
            fs.writeFile(saveEmail, dataBuffer, function(err, result) {
                user.findAndModify({
                    query: {
                        '_id': req.user._id
                    },
                    update: {
                        $set: {
                            'emailTemplate': {
                                'nombreEmpresa': nombreEmpresa,
                                'imagenLogo': nameLogo,
                                'direccionEmpresa': direccion,
                                'TelefonoEmpresa': telefono,
                                'emailEmpresa': email
                            }
                        }
                    },
                    new: true
                }).success(function(done) {
                    res.redirect('../panel/config/email');
                });
            });
        }
    });



});

router.post('/notificaciones', function(req, res, next) {

    var db = req.db;

    var email = req.body.isMail;
    var asunt = req.body.isAsunt;
    var message = req.body.isMessage;
    var idPropiedad = req.body.isID;

    var empresa = req.user.emailTemplate.nombreEmpresa;
    var emailUser = req.user.emailTemplate.emailEmpresa;

    var usuarios = db.get('usuarios');


    var transporter = nodemailer.createTransport(smtpTransport({
        host: "viaintimedia.com", // hostname
        secure: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: 'info@viaintimedia.com',
            pass: 'via123'
        },
        tls: {
            rejectUnauthorized: false
        }
    }));


    function templateEmail(mensajeEnviado) {
        var theme = "<table width='650px'>" +
            "<tr>" +
            "<td>" +
            "<h1 style='font-weight: 400;border-bottom: 1px solid black;padding: 0 0 0.5em 0;margin: 0;'>Zimba Propiedades</h1>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<img src='" + req.user.emailTemplate.imagenLogo + "' alt='' width='150px;'>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<p class='descriptionMessage'>" +
            mensajeEnviado +
            "</p>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "</td>" +
            "</tr>" +
            "</table>";
        return theme;
    }

    var mailOptions = {
        from: emailUser,
        to: email, // list of receivers
        subject: asunt, // Subject line
        text: message, // plaintext body
        html: templateEmail(message) // html body
    };


    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error)
        } else {
            activeSendNotify();
        }
    });

    function activeSendNotify() {
        var d = new Date();
        var dia = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        var hora = d.getHours();
        var minutes = d.getMinutes();

        var getHOUR = hora + ":" + minutes;

        var date = 1290297600000;

        usuarios.findAndModify({
            query: {
                '_id': req.user._id,
                propiedades: {
                    $elemMatch: {
                        'id': idPropiedad
                    }
                }
            },
            update: {
                $push: {
                    'propiedades.$.notificaciones': {
                        'fecha': dataFecha(new Date()),
                        'email': email,
                        'asunto': asunt,
                        'mensaje': message
                    }
                }
            },
            new: true
        }).success(function(fn) {
            res.redirect('propiedades/show/' + idPropiedad);
        });

        usuarios.findAndModify({
            query: {
                '_id': req.user._id,
                propiedades: {
                    $elemMatch: {
                        'id': idPropiedad
                    }
                }
            },
            update: {
                $push: {
                    'propiedades.$.calendarioNotify': {
                        'month': month,
                        'dia': dia,
                        'year': year,
                        'title': asunt,
                        'hora': hora,
                        'minutes': minutes,
                        'description': message,
                        'datetime': dateFormat(now, "isoDateTime")
                    }
                }
            },
            new: true
        });
    }

    function dataFecha(data) {

        var dia = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
            "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        var day = data.getDate();
        var dayStatus = data.getDay();
        var mes = data.getMonth();
        var year = data.getFullYear();


        for (var i = 0; i < dia.length; i++) {
            return dia[dayStatus] + " " + day + " del " + year;
        }

    }
});

router.post('/pagos', function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');

    var idPropiedad = req.body.isID;

    var d = new Date();
    var dia = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var hora = d.getHours();
    var minutes = d.getMinutes();

    user.findAndModify({
        query: {
            '_id': req.user._id,
            propiedades: {
                $elemMatch: {
                    'id': idPropiedad
                }
            }
        },
        update: {
            $push: {
                'propiedades.$.pagos': {
                    'fecha': new Date(),
                    'inquilino': req.body.isNameInquilino,
                    'importe': req.body.isPrecioPropiedad,
                    'mesSaldado': req.body.isMonthPayment,
                    'tipoDePago': req.body.typePayment,
                    'comentarios': req.body.comentarios,
                    'title': req.body.isNamePropiedad
                }
            }
        },
        new: true
    }).success(function(data) {

    });

    user.findAndModify({
        query: {
            '_id': req.user._id,
            propiedades: {
                $elemMatch: {
                    'id': idPropiedad
                }
            }
        },
        update: {
            $set: {
                'propiedades.$.estadoPago': true
            }
        }
    });

    //Notify Payments

    user.findAndModify({
        query: {
            '_id': req.user._id,
            propiedades: {
                $elemMatch: {
                    'id': idPropiedad
                }
            }
        },
        update: {
            $push: {
                'propiedades.$.calendarioNotify': {
                    'month': month,
                    'dia': dia,
                    'year': year,
                    'title': 'Pago: ' + req.body.typePayment,
                    'hora': hora,
                    'minutes': minutes,
                    'description': 'la propiedad de: ' + req.body.isNameInquilino,
                    'datetime': dateFormat(now, "isoDateTime")
                }
            }
        }
    });



    user.findAndModify({
        query: {
            '_id': req.user._id,
            propiedades: {
                $elemMatch: {
                    'id': idPropiedad
                }
            }
        },
        update: {
            $push: {
                'propiedades.$.pagosTotal': {
                    'fecha': new Date(),
                    'inquilino': req.body.isNameInquilino,
                    'importe': req.body.isPrecioPropiedad,
                    'mesSaldado': req.body.isMonthPayment,
                    'tipoDePago': req.body.typePayment,
                    'comentarios': req.body.comentarios
                }
            }
        },
        new: true
    }).success(function(data) {
        res.redirect('propiedades/show/' + idPropiedad);
    });


});



router.get('/propiedades/editpropiedad/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    var idPropiedad = req.params.id;

    user.findOne({ '_id': req.user._id }, function(err, doc) {
        if (err) {
            return err;
        } else {
            console.log(doc)

            for (var i = 0; i < doc.propiedades.length; i++) {

                if (doc.propiedades[i].id == idPropiedad) {

                    res.render('editpropiedad', {
                        title: doc.propiedades[i].nombrePropiedad,
                        nombre: req.user.nombre,
                        empresa: req.user.empresa,
                        propiedad: doc.propiedades[i],
                        user: req.user,
                        menu: 'Propiedades'

                    });

                }
            }
        }
    });


});


router.get('/disponibles/editpropiedad/:id', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    var idPropiedad = req.params.id;

    user.findOne({ '_id': req.user._id }, function(err, doc) {
        if (err) {
            return err;
        } else {
            for (var i = 0; i < doc.propiedadesDisponibles.length; i++) {
                if (doc.propiedadesDisponibles[i].id == idPropiedad) {
                    res.render('editpropiedad_disponibles', {
                        title: doc.propiedadesDisponibles[i].nombre,
                        nombre: req.user.nombre,
                        empresa: req.user.empresa,
                        propiedad: doc.propiedadesDisponibles[i],
                        user: req.user,
                        menu: 'Disponibles'

                    });
                }
            }
        }
    });


});

router.post('/editpropiedad', multipartMiddleware, function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');

    var validation = req.files.garanteFile.name;
    var validationTwo = req.files.contrato.name;


    //Create objt in history contrats in properti

    //Create object
    var obj = new Object();
    if (req.body.newContrato !== undefined) {

        obj.inicia = req.body.contratoInicio;
        obj.finaliza = req.body.contratoFin;
        obj.mensual = req.body.precioMensual;



        //Create function insert in array contrats lasted
        //Function parametro active
        /*function activeHistoryNewContratos(active) {
            if (active == 'si') {
                user.findAndModify({
                    query: {
                        '_id': req.user._id,
                        propiedades: {
                            $elemMatch: {
                                'id': req.body.idpropiedad
                            }
                        }
                    },
                    update: {
                        $push: {
                            'propiedades.$.historialContrato': obj
                        }
                    }
                });
            } else {
                console.log('NO SE AGREGARAN HISTORIAL DE CONTRATOS');
            }
        }*/
    } else {
        //
    }


    if (validation.length > 1 && validationTwo.length > 1) {


        var newName = esid(6) + validation;
        var newNameOther = esid(6) + validationTwo;

        fs.readFile(req.files.garanteFile.path, function(err, data) {
            try {

                var directorio = path.join(__dirname, '..', 'public', 'files/' + newName);

                fs.writeFile(directorio, data, function(err) {
                    try {

                        user.findAndModify({
                            query: {
                                '_id': req.user._id,
                                propiedades: {
                                    $elemMatch: {
                                        'id': req.body.idpropiedad
                                    }
                                }
                            },
                            update: {
                                $set: {
                                    'propiedades.$.garanteFile': newName
                                }
                            },
                            new: false,
                            upsert: false
                        }).success(function() {

                        });

                    } catch (err) {
                        return err;
                    }
                })

            } catch (err) {
                return err;
            }
        });

        setTimeout(function() {

            fs.readFile(req.files.contrato.path, function(err, data) {
                try {

                    var directorio = path.join(__dirname, '..', 'public', 'files/' + newNameOther);

                    fs.writeFile(directorio, data, function(err) {
                        try {
                            user.findAndModify({
                                query: {
                                    '_id': req.user._id,
                                    propiedades: {
                                        $elemMatch: {
                                            'id': req.body.idpropiedad
                                        }
                                    }
                                },
                                update: {
                                    $set: {
                                        'propiedades.$.contrato': newNameOther
                                    }
                                },
                                new: false,
                                upsert: false
                            }).success(function(d) {
                                res.redirect('./propiedades/show/' + req.body.idpropiedad);
                            });

                        } catch (err) {
                            return err;
                        }
                    });


                } catch (err) {
                    return err;
                }

            });

        }, 1000);


    } else if (validation.length > 1) {

        var newName = esid(6) + validation;
        var newNameOther = esid(6) + validationTwo;

        fs.readFile(req.files.garanteFile.path, function(err, data) {
            try {

                var directorio = path.join(__dirname, '..', 'public', 'files/' + newName);

                fs.writeFile(directorio, data, function(err) {
                    try {

                        user.findAndModify({
                            query: {
                                '_id': req.user._id,
                                propiedades: {
                                    $elemMatch: {
                                        'id': req.body.idpropiedad
                                    }
                                }
                            },
                            update: {
                                $set: {
                                    'propiedades.$.garanteFile': newName
                                }
                            },
                            new: false,
                            upsert: false
                        }).success(function() {

                            if (validation.length > 1 && validationTwo.length > 1) {
                                res.redirect('./propiedades/show/' + req.body.idpropiedad);
                            } else {
                                res.redirect('./propiedades/show/' + req.body.idpropiedad);
                            }

                        });

                    } catch (err) {
                        return err;
                    }
                })

            } catch (err) {
                return err;
            }
        });
    } else if (validationTwo.length > 1) {

        var newNameOther = esid(6) + validationTwo;

        fs.readFile(req.files.contrato.path, function(err, data) {
            try {

                var directorio = path.join(__dirname, '..', 'public', 'files/' + newNameOther);

                fs.writeFile(directorio, data, function(err) {
                    try {

                        user.findAndModify({
                            query: {
                                '_id': req.user._id,
                                propiedades: {
                                    $elemMatch: {
                                        'id': req.body.idpropiedad
                                    }
                                }
                            },
                            update: {
                                $set: {
                                    'propiedades.$.contrato': newNameOther
                                }
                            },
                            new: false,
                            upsert: false
                        }).success(function(d) {

                            res.redirect('./propiedades/show/' + req.body.idpropiedad);
                        });

                    } catch (err) {
                        return err;
                    }
                });


            } catch (err) {
                return err;
            }

        });

    } else {

        user.findAndModify({
            query: {
                '_id': req.user._id,
                propiedades: {
                    $elemMatch: {
                        'id': req.body.idpropiedad
                    }
                }
            },
            update: {
                $push: {
                    'propiedades.$.historialContrato': obj
                }
            },
            new: true
        });


        user.findAndModify({
            query: {
                '_id': req.user._id,
                propiedades: {
                    $elemMatch: {
                        'id': req.body.idpropiedad
                    }
                }
            },
            update: {
                $set: {

                    'propiedades.$.id': req.body.idpropiedad,
                    'propiedades.$.nombrePropiedad': req.body.nombrepropiedad,
                    'propiedades.$.desPropiedad': req.body.despropiedad,
                    'propiedades.$.barrio': req.body.barriopropiedad,


                    'propiedades.$.nombreInquilino': req.body.nameinquilino,
                    'propiedades.$.telInquilino': req.body.telinquilino,
                    'propiedades.$.dniInquilino': req.body.dniinquilino,
                    'propiedades.$.emailInquilino': req.body.emailinquilino,

                    'propiedades.$.garanteNombre': req.body.garanteNombre,
                    'propiedades.$.garanteTel': req.body.garanteTel,
                    'propiedades.$.garanteDni': req.body.garanteDni,
                    'propiedades.$.garanteEmail': req.body.garanteEmail,
                    'propiedades.$.garanteFile': req.body.isgarantefile,
                    'propiedades.$.garanteDomicilio': req.body.garanteDomicilio,

                    'propiedades.$.propietarioNombre': req.body.propietarioNombre,
                    'propiedades.$.propietarioTel': req.body.propietarioTel,
                    'propiedades.$.propietarioDni': req.body.propietarioDni,
                    'propiedades.$.propietarioEmail': req.body.propitarioEmail,
                    'propiedades.$.propietarioDomicilio': req.body.propietarioDomicilio,

                    'propiedades.$.contratoInicia': req.body.contratoInicio,
                    'propiedades.$.contratoFinaliza': req.body.contratoFin,
                    'propiedades.$.precioMensual': req.body.precioMensual,
                    'propiedades.$.contrato': req.body.iscontrato,
                    'propiedades.$.cuentaCorriente': req.body.precioMensual
                }
            },
            new: false,
            upsert: false
        }).success(function(d) {

            res.redirect('./propiedades/show/' + req.body.idpropiedad);
        });

    }

});

router.post('/editdisponible', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    var _idpropiedad = req.body.idpropiedad;

    user.findAndModify({
        query: {
            '_id': req.user._id,
            propiedadesDisponibles: {
                $elemMatch: {
                    'id': req.body.idpropiedad
                }
            }
        },
        update: {
            $set: {
                'propiedadesDisponibles.$.nombre': req.body.nombrepropiedad,
                'propiedadesDisponibles.$.description': req.body.despropiedad,
                'propiedadesDisponibles.$.barrio': req.body.barriopropiedad,
                'propiedadesDisponibles.$.propietario': req.body.nameinquilino,
                'propiedadesDisponibles.$.telpropietario': req.body.telinquilino,
                'propiedadesDisponibles.$.dnipropietario': req.body.dniinquilino,
                'propiedadesDisponibles.$.emailpropietario': req.body.emailinquilino,
                'propiedadesDisponibles.$.domiciliopropietario': req.body.domicliopropietario
            }
        },
        new: false
    }).success(function(data) {

        res.redirect('disponibles/editpropiedad/' + _idpropiedad);
    });


});

router.post('/deleteprice', function(req, res, next) {
	var db = req.db;
	var user = db.get('usuarios');


	user.update({'propiedades.precios.id': req.body.id}, {
		$pull: {
			'propiedades.$.precios': {
				'id': req.body.id
			}
		}
	}, function(err, result){
		if(err) throw err;

		res.json({delete: true});
	});

});

router.post('/deletepropiedad', function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');

    var idDeletePropiedad = req.body.id;

    //$Pull - Mongodb

    user.update({ '_id': req.user._id }, {
        $pull: {
            'propiedades': {
                'id': idDeletePropiedad
            }
        }
    }).success(function() {
        res.json({ removed: true });
    });

});


router.post('/deletedisponible', function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');

    var idDeletePropiedad = req.body.id;

    //$Pull - Mongodb

    user.update({ '_id': req.user._id }, {
        $pull: {
            'propiedadesDisponibles': {
                'id': idDeletePropiedad
            }
        }
    }).success(function() {
        res.json({ removed: true });
    });

});


router.post('/deletemultimediaservice', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');

    var id = req.body.idremove;

    console.log(id);

    user.update({ 'propiedades.serviciosMultimedia.id': id }, {
        $pull: {
            'propiedades.$.serviciosMultimedia': {
                'id': id
            }
        }
    }, function(err, result) {
        try {
            res.json({ 'remove': true });
        } catch (err) {
            return err;
        }

    });

});

router.post('/ticket', function(req, res, next) {

    var db = req.db;
    var user = db.get('usuarios');


    user.findAndModify({
        query: {
            '_id': req.user._id
        },
        update: {
            $push: {
                'support': {
                    'id': esid(12),
                    'iduser': req.user._id,
                    'foto': req.user.foto,
                    'name': req.body.name,
                    'asunto': req.body.asunto,
                    'mensaje': req.body.mensaje,
                    'respuesta': Array,
                    'fecha': dataFecha(new Date())
                }
            }
        },
        new: true
    }).success(function(data) {
        res.redirect('/panel/ticket/support');
    });


    function dataFecha(data) {

        var dia = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto",
            "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        var day = data.getDate();
        var dayStatus = data.getDay();
        var mes = data.getMonth();
        var year = data.getFullYear();


        for (var i = 0; i < dia.length; i++) {
            return dia[dayStatus] + " " + day + " del " + year;
        }

    }

});

router.post('/deleteticket', function(req, res, next) {
    var db = req.db;
    var user = db.get('usuarios');


    console.log('is id remove: ' + req.body.idremove);

    user.update({ '_id': req.user._id }, {
        $pull: {
            'support': {
                'id': req.body.idremove
            }
        }
    }).success(function() {
        res.json({ removed: true });
    });

});


router.get('/admin', function(req, res, next){
    adminticket(req, res, next);
});

router.get('/admin/ticket/:showid', function(req, res, next){
    var idview = req.params.showid;
    adminshowticket(req, res, next, idview);
});

router.post('/sendticket', function(req, res, next) {

    resticket(req, res, next);

});

router.post('/userticket', function(req, res, next) {

    resticketuser(req, res, next);

});


module.exports = router;
