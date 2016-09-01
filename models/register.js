"use strict"

var fs = require('fs');
var path = require('path');
var esid = require('randomid');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

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
                            var _empresa = req.body.empresa;
                            var _email = req.body.email;
                            var _direccion = req.body.direccion;
                            var _telefono = req.body.tel;
                            var _password = req.body.password;
                            var _type = data;
                            var _userFoto = name;
                            var _status = true;

                            var obj = {
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


        }

        //User free

        function userFree(data) {
            users.insert({
                'empresa': data.empresa,
                'email': data.email,
                'direccion': data.direccion,
                'telefono': data.telefono,
                'password': data.password,
                'account': {
                	type: data.type,
                	fecha: dataFecha(new Date()),
                	dia: dataDia(new Date())
                },
                'userFoto': data.userFoto,
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


}
