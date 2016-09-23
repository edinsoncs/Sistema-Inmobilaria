"use strict";

//var _ = require('underscore-node');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


module.exports = (req, res, next) => {

    var db = req.db;
    var emailing = db.get('email');
    var allUsers = db.get('usuarios');

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

    emailing.find({}, (err, doc) => {
        if (err) {
            return err;
        } else {

            result(doc);
        }
    });

    function result(data) {

        function templateEmail(user) {
            var _name = user.nombreInquilino;
            var _namePropiedad = user.nombrePropiedad;
            var _message = 'Hola ' + '<strong>' + _name + '</strong>' + ', ' +
                'Le notificamos el pago correspondiente de la propiedad: ' + '<strong>' + _namePropiedad + '</strong>' + '<br/>' +
                'Ubicado en el barrio: ' + user.barrio + '<br/>' +
                'Ante Cualquier duda o consulta comuníquese con nosotros' +
                '<br/> Tel: "' + user.telefonoempresa + '" - Email: "' + user.emailempresa + '" <br/> <br/>' +
                '<strong style="font-size:14px;">Zimba Inmobiliarias, esto es una notificación automática</strong>';

            var theme = "<table width='650px'>" +
                "<tr>" +
                "<td>" +
                "<h1 style='font-weight: 400;border-bottom: 1px solid black;padding: 0 0 0.5em 0;margin: 0;'>" + user.empresa + "</h1>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" +
                "<img src='" + user.logo + "' alt='' width='150px;'>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>" +
                "<p class='descriptionMessage'>" +
                _message +
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



        data.forEach(function(element, index, arr) {

            var mailOptions = {
                from: element.emailempresa,
                to: element.emailInquilino, // list of receivers
                subject: element.empresa + ' Propiedades', // Subject line
                text: element.empresa + ' Propiedades', // plaintext body
                html: templateEmail(element) // html body
            };


            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    return console.log(error)
                } else {
                    allUsers.findAndModify({
                        query: {
                            '_id': element.idUsuario
                        },
                        update: {
                            $push: {
                                'viewNotify': {
                                    'fecha': dataFecha(new Date()),
                                    'Estado': 'Enviado'
                                }
                            }
                        },
                        new: true
                    }).success(function(){
                    	console.log('agregado');
                    });
                }
            });


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
            return dia[dayStatus] + " " + day + " de " + meses[mes] + " del " + year;
        }

    }





}
