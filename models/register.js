"use strict"

var fs = require('fs');
var path = require('path');
var esid = require('randomid');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var MP = require('mercadopago');

var mp = new MP("8415390906318501", "5HHpyXdBIDTWZv3QpudlIMs0PEoNnL1c");




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

	        if(_false !== false) {
	        	//Habilities payment mercadopago

	        	fs.readFile(file.logo.path, (err, dataIMG) => {
	                try {

	                	function paymentPrice(price) {
	                		switch(price) {
	                			case "3": {
	                				return 2;
	                				break;
	                			}
	                			case "6": {
	                				return 789;
	                				break;
	                			}
	                			case "12": {
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
	        	console.log('estoy aqui ' + _false);
	        	/*fs.readFile(file.logo.path, (err, dataIMG) => {
	                try {

	                	function paymentPrice(price) {
	                		switch(price) {
	                			case "3": {
	                				return 450;
	                				break;
	                			}
	                			case "6": {
	                				return 789;
	                				break;
	                			}
	                			case "12": {
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
	                            var _status = true;

	                            	
	                            var obj = {
	                            	'nombre': _nombre,
	                                'empresa': _empresa,
	                                'email': _email,
	                                'direccion': _direccion,
	                                'telefono': _telefono,
	                                'password': _password,
	                                'type': type,
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
	            });*/
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


        //Function payment mercadopago

        function userPayment(data) {
        	
        	var preference = {
	            "items": [
	                {
	                    "title": 'Activar cuenta de ' +  data.type +' Meses Zimba Administracion de inmobiliarias',
	                    "quantity": 1,
	                    "currency_id": "ARS",
	                    "unit_price": data.price
	                }
	            ]
	        };


	        mp.createPreference(preference, function (err, mlData){
		        if (err) {
		            res.send (err);
		        } else {
		            console.log('funciono');
		            console.log(mlData);


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
		                	dia: dataDia(new Date())
		                },
		                'userFoto': data.userFoto,
		                'status': data.status
		            }, (err, result) => {
		                if (err) {
		                    return err;
		                } else {
		                   
		                }
		            });

		        }
		    });

        	


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
            });*/

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
