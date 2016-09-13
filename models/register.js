"use strict"

var fs = require('fs');
var path = require('path');
var esid = require('randomid');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var MP = require('mercadopago');

var mp = new MP("8415390906318501", "5HHpyXdBIDTWZv3QpudlIMs0PEoNnL1c");
var url = require('url');



module.exports = (req, res, next, file) => {

        var db = req.db;
        var users = db.get('usuarios');

        var name = esid(5) + file.logo.name;
        var typeAccountUser = req.body.typeaccount;


        switch (typeAccountUser) {
            case "0":
                typeUser(typeAccountUser);
                break;
            case "3":
                typeUser(typeAccountUser);
                break;
            case "6":
                typeUser(typeAccountUser);
                break;
            case "12":
                typeUser(typeAccountUser);
                break;
            default:
                console.log('hola');
        }

        function typeUser(data) {

            if (data == 0) {
                fs.readFile(file.logo.path, (err, dataIMG) => {
                    try {

                        var directorio = path.join(__dirname, '..', 'public', 'registers/' + name);
                        fs.writeFile(directorio, dataIMG, (err) => {
                            if (err) {
                                return err;
                            } else {
                                var _nombre = req.body.nombre;
                                var _empresa = req.body.empresa;
                                var _email = req.body.email;
                                var _direccion = req.body.direccion;
                                var _telefono = req.body.tel;
                                var _password = req.body.password;
                                var _type = data;
                                var _userFoto = name;
                                var _status = true;

                                var obj = {
                                    'nombre': _nombre,
                                    'empresa': _empresa,
                                    'email': _email,
                                    'direccion': _direccion,
                                    'telefono': _telefono,
                                    'password': _password,
                                    'type': _type,
                                    'userFoto': _userFoto,
                                    'status': _status
                                }

                                userFree(obj)

                            }
                        });

                    } catch (err) {
                        return err;
                    }
                });

            } else {
                var _false = JSON.parse(req.body.typepayment);

                if (_false !== false) {
                    //Habilities payment mercadopago

                    fs.readFile(file.logo.path, (err, dataIMG) => {
                        try {

                            function paymentPrice(price) {
                                switch (price) {
                                    case "3":
                                        {
                                            return 2;
                                            break;
                                        }
                                    case "6":
                                        {
                                            return 789;
                                            break;
                                        }
                                    case "12":
                                        {
                                            return 1199;
                                            break;
                                        }
                                }
                            }

                            var directorio = path.join(__dirname, '..', 'public', 'registers/' + name);

                            fs.writeFile(directorio, dataIMG, (err) => {
                                if (err) {
                                    return err;
                                } else {

                                    var _nombre = req.body.nombre;
                                    var _empresa = req.body.empresa;
                                    var _email = req.body.email;
                                    var _direccion = req.body.direccion;
                                    var _telefono = req.body.tel;
                                    var _password = req.body.password;
                                    var _type = data;
                                    var _userFoto = name;
                                    var _status = false;


                                    var obj = {
                                        'nombre': _nombre,
                                        'empresa': _empresa,
                                        'email': _email,
                                        'direccion': _direccion,
                                        'telefono': _telefono,
                                        'password': _password,
                                        'type': _type,
                                        'userFoto': _userFoto,
                                        'status': _status,
                                        'price': paymentPrice(_type)
                                    }
                                    userPayment(obj);
                                }
                            });

                        } catch (err) {
                            return err;
                        }
                    });
                } else {
                    //Payment deposito

                    fs.readFile(file.logo.path, (err, imgBuffer) => {
                        try {

                            var directorio = path.join(__dirname, '..', 'public', 'registers/' + name);

                            fs.writeFile(directorio, imgBuffer, (err) => {
                                if (err) {
                                    return err;
                                } else {

                                    function paymentPrice(price) {
                                        switch (price) {
                                            case "3":
                                                {
                                                    return 390;
                                                    break;
                                                }
                                            case "6":
                                                {
                                                    return 789;
                                                    break;
                                                }
                                            case "12":
                                                {
                                                    return 1199;
                                                    break;
                                                }
                                        }
                                    }

                                    var _nombre = req.body.nombre;
                                    var _empresa = req.body.empresa;
                                    var _email = req.body.email;
                                    var _direccion = req.body.direccion;
                                    var _telefono = req.body.tel;
                                    var _password = req.body.password;
                                    var _type = data;
                                    var _userFoto = name;
                                    var _status = false;


                                    var obj = {
                                        'nombre': _nombre,
                                        'empresa': _empresa,
                                        'email': _email,
                                        'direccion': _direccion,
                                        'telefono': _telefono,
                                        'password': _password,
                                        'type': _type,
                                        'userFoto': _userFoto,
                                        'status': _status,
                                        'price': paymentPrice(_type)
                                    }
                                    depositoPayment(obj);



                                }
                            });
                        } catch (err) {
                            return err;
                        }

                    });

                }


            }

            //User free

            function userFree(data) {
                users.insert({
                    'nombre': data.nombre,
                    'empresa': data.empresa,
                    'email': data.email,
                    'direccion': data.direccion,
                    'telefono': data.telefono,
                    'password': data.password,
                    'account': {
                        type: data.type,
                        fecha: dataFecha(new Date()),
                        dia: dataDia(new Date()),
                        mes: dataMes(new Date())
                    },
                    'foto': data.userFoto,
                    'status': data.status
                }, (err, result) => {
                    if (err) {
                        return err;
                    } else {
                        res.render('success', {
                            title: 'Se creo su cuenta'
                        });
                    }
                });
            }


            //Function payment mercadopago

            function userPayment(data) {

                var preference = {
                    "items": [{
                        "title": 'Activar cuenta de ' + data.type + ' Meses Zimba Administracion de inmobiliarias',
                        "quantity": 1,
                        "currency_id": "ARS",
                        "unit_price": data.price
                    }]
                };


                mp.createPreference(preference, function(err, mlData) {
                        if (err) {
                            res.send(err);
                        } else {



                            users.insert({
                                    'nombre': data.nombre,
                                    'empresa': data.empresa,
                                    'email': data.email,
                                    'direccion': data.direccion,
                                    'telefono': data.telefono,
                                    'password': data.password,
                                    'account': {
                                        type: data.type,
                                        fecha: dataFecha(new Date()),
                                        dia: dataDia(new Date()),
                                        mes: dataMes(new Date())
                                    },
                                    'foto': data.userFoto,
                                    'status': data.status,
                                    'payment': {
                                        'id': mlData.response.id,
                                        'url': mlData.response.init_point,
                                        'client_id': mlData.response.client_id,
                                        'createPayment': mlData.response.date_created
                                    }
                                }, (err, result) => {
                                    if (err) {
                                        return err;
                                    } else {

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


                                        var mailOptions = {
                                            from: 'support@zimba.me',
                                            to: data.email, // list of receivers
                                            subject: 'Zimba.me para completa el registro complete el pago', // Subject line
                                            text: 'Complete el pago de su cuenta', // plaintext body
                                            html: '<h1>ZIMBA</h1>' +
                                                '<h3>Usted a creado correctamente su cuenta: "' +
                                                data.empresa + '"</h3>' +
                                                '<p>Si realizo el pago correspondiente por <strong>' +
                                                'MERCADOPAGO' +
                                                '</strong>' +
                                                'en breves momentos nos pondremos en contacto con usted' +
                                                ' y habilitar su cuenta, de lo contrario necesitamos que ' +
                                                'complete el pago</p> <p>Realizar pago en mercadopago: "' + mlData.response.init_point +
                                                '"</p>' // html body
                                        };


                                        transporter.sendMail(mailOptions, function(error, info) {
                                            if (error) {
                                                console.log(error)
                                            } else {

                                              res.redirect(mlData.response.init_point);

                                            }
                                        });

                                        }
                                    });

                            }
                        });

                }

                //Function deposito payment
                function depositoPayment(data) {

                    //Step1 send email register payment deposito

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


                    var mailOptions = {
                        from: 'support@zimba.me',
                        to: data.email, // list of receivers
                        subject: 'Zimba.me para completa el registro complete el pago', // Subject line
                        text: 'Complete el pago de su cuenta', // plaintext body
                        html: '<h1>ZIMBA</h1><h3>Usted a creado correctamente su cuenta: "' + data.empresa + '"<br/> Para completa el registro, devera abonar el saldo de: $"' + data.price + '" Pesos</h3><br/><p>Detalles de la cuenta: </p><p>Recuerde enviarnos un correo del pago realizado, att. zimba soluciones de inmobiliarias</p>' // html body
                    };

                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error)
                        } else {

                            users.insert({
                                'nombre': data.nombre,
                                'empresa': data.empresa,
                                'email': data.email,
                                'direccion': data.direccion,
                                'telefono': data.telefono,
                                'password': data.password,
                                'account': {
                                    type: data.type,
                                    fecha: dataFecha(new Date()),
                                    dia: dataDia(new Date()),
                                    mes: dataMes(new Date())
                                },
                                'foto': data.userFoto,
                                'status': data.status
                            }, (err, result) => {
                                if (err) {
                                    return err;
                                } else {

                                    res.render('paymentdeposito', {
                                        title: 'Complete el registro del pago'
                                    });

                                }
                            });

                        }
                    });


                }


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

            function dataDia(data) {
                return data.getDate();
            }

            function dataMes(data) {
            	var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            	for(var i = 0; i < arr.length; i++) {
            		var mes = arr[data.getMonth()];
            		return mes;
            	}
            	 
            }


        }
