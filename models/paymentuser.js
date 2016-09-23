"use strict";

var MP = require('mercadopago');

var mp = new MP("8415390906318501", "5HHpyXdBIDTWZv3QpudlIMs0PEoNnL1c");
var url = require('url');

module.exports = (req, res, next) => {

    switch (Number(req.user.account.type)) {
        case 0:
            {
                res.json({ 'res': 'Utilizas una cuenta de prueba' });
                break;
            }

        case 3:
            {
                payment(499, req.user.account);

                break;
            }

        case 6:
            {
                payment(749);
                break;
            }

        case 12:
            {
                payment(999);
                break;
            }

    }



    function payment(price, data) {

        var preference = {
            "back_urls": {
            	"pending": "http://zimba.me/panel/paymentsuccess/pending",
            	"success": "http://zimba.me/panel/paymentsuccess/success",
            	"failure": "http://zimba.me/panel/paymentsuccess/failure"
            },
            "items": [{
                "id": req.user._id,
                "title": 'Pagar ' + data.type + ' Meses Zimba Administracion de inmobiliarias',
                "quantity": 1,
                "currency_id": "ARS",
                "unit_price": price
            }],
            "payer": {
                "email": req.user.email,
                "name": req.user.empresa,
                "surname": req.user.nombre,
                "phone": {
                    "area_code": "54",
                    "number": req.user.telefono
                }
            }
        };


        mp.createPreference(preference, function(err, mlData) {
            if (err) {
                res.send(err);
            } else {

                res.json({ mlData });
                res.redirect(mlData.response.init_point);

                /*users.insert({
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
                });*/

            }
        });
    }






}
