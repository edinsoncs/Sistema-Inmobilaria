var express = require('express');
var router = express.Router();

var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var url = require('url');
var async = require('async');

var esid = require('randomid');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



var bodyParser = require('body-parser');

router.get('/', function(req, res, next) {
    res.render('panel', {
        title: 'Panel de administración',
        nombre: req.user.nombre,
        empresa: req.user.empresa
    });
    console.log(req.user)

});

router.get('/edit', function(req, res, next) {

    function sendData(data) {
        if (data == 'empresa') {
            return req.user.empresa;
        } else if (data == 'email') {
            return req.user.email;
        } else if (data == 'apellidos') {
            return req.user.apellidos;
        } else if (data = 'dni') {
            return req.user.dni;
        }
    }

    res.render('edit', {
        title: 'Panel de administración',
        nombre: req.user.nombre,
        apellidos: sendData('apellidos'),
        empresa: sendData('empresa'),
        email: sendData('email'),
        dni: sendData('dni')
    });
    console.log('editando user');
});


router.post('/save', function(req, res, next) {
    console.log(req.body);

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
    }).success(function(result) {
        res.redirect('/panel/edit')
    });

});

router.get('/propiedades', function(req, res, next) {
    var reverseProp = req.user.propiedades;
    var reverse = reverseProp.reverse()
    res.render('propiedades', {
        title: 'Panel de administración',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        propiedades: reverse
    });
});


router.get('/propiedades/add', function(req, res, next) {

    res.render('add', {
        title: 'Nueva propiedad',
        nombre: req.user.nombre,
        empresa: req.user.empresa
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
                    cuentaC: cuentaShow
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
                        paymentsData: payments_Show.reverse()
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
                        notify: notificaciones.reverse()
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
        empresa: req.user.empresa
    });
});

router.get('/config/email', function(req, res, next){
	res.render('email', {
        title: 'Config Email Zimba',
        nombre: req.user.nombre,
        empresa: req.user.empresa
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

                    'contratoInicia': req.body.contratoInicio,
                    'contratoFinaliza': req.body.contratoFin,
                    'precioMensual': req.body.precioMensual,
                    'contrato': idNameContrato,
                    'periodosPrecios': Array,
                    'notificaciones': Array,
                    'pagos': Array,
                    'pagosTotal': Array,
                    'cuentaCorriente': Array
                }
            }
        },

        new: true

    }).success(function(done) {
        res.redirect('/panel/propiedades');
    });


});

router.post('/notificaciones', function(req, res, next) {

    var db = req.db;

    var email = req.body.isMail;
    var asunt = req.body.isAsunt;
    var message = req.body.isMessage;
    var idPropiedad = req.body.isID;

    console.log(message);

    var empresa = req.user.empresa;
    var emailUser = req.user.email;

    var usuarios = db.get('usuarios');


    var transporter = nodemailer.createTransport(smtpTransport({
        host: "millenialab.com", // hostname
        secure: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: 'edinson@millenialab.com',
            pass: '25edinson25'
        },
        tls: {
            rejectUnauthorized: false
        }
    }));


    var mailOptions = {
        from: emailUser,
        to: email, // list of receivers
        subject: asunt, // Subject line
        text: message, // plaintext body
        html: '<b>' + message + '</b>' // html body
    };


    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error)
        } else {
            console.log('enviado');
            activeSendNotify();
        }
    });

    function activeSendNotify() {
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
                    'comentarios': req.body.comentarios
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

module.exports = router;
