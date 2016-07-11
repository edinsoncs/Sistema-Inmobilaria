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

    var db = req.db;
    var user = db.get('usuarios');

    res.render('panel', {
        title: 'Panel de administración',
        nombre: req.user.nombre,
        empresa: req.user.empresa
    });

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
                    notify: reverseNotify
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
                });
            }
        }
    });


});

router.get('/propiedades/calendario/:id', function(req, res, next) {

	var db = req.db;
	var user = db.get('usuarios');

	user.findOne({_id: req.user._id}, function(err, resultado) {
		if(err) {
			return err;
		}
		else {
			var prop = resultado.propiedades;
			for(var i = 0; i < prop.length; i++) {


				res.render('calendario', {
					title: prop[i].nombrePropiedad,
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    propiedad: prop[i],
                    ca: prop[i].calendarioNotify
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

router.get('/config/email', function(req, res, next) {
    res.render('email', {
        title: 'Config Email Zimba',
        nombre: req.user.nombre,
        empresa: req.user.empresa,
        emailTemplate: req.user.emailTemplate
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
                    'estadoPago': false,
                    'pagosTotal': Array,
                    'cuentaCorriente': req.body.precioMensual,
                    'calendarioNotify': Array

                }
            }
        },

        new: true

    }).success(function(done) {
        res.redirect('/panel/propiedades');
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

    console.log(message);

    var empresa = req.user.emailTemplate.nombreEmpresa;
    var emailUser = req.user.emailTemplate.emailEmpresa;

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
            console.log('enviado');
            activeSendNotify();
        }
    });

    function activeSendNotify() {
    	var d = new Date();
    	var dia = d.getDate();
    	var month = d.getMonth();
    	var year = d.getFullYear();

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
                        'dia': dia,
                        'month': month,
                        'year': year,
                        'title': asunt,
                        'description': message
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
            $set: {
                'propiedades.$.estadoPago': true
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
