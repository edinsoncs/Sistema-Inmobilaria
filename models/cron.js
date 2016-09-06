'use strict';

var request = require("request");

module.exports = {
    active: function(time, req) {

        var db = req.db;
        var users = db.get('usuarios');



        users.find({}, (err, data) => {
            if (err) {
                return err;
            } else {

                data.map((element, indice, array) => {
                    var _sum = 15;
                    var _user_register_day = element.account.dia;
                    //var _result = _user_register_day + _sum;

                    switch (JSON.parse(element.account.type)) {
                        case 0:

                            if (_user_register_day <= 27) {
                                //Primary Date´s
                                var _sum_days_registers = _user_register_day;
                                var _month_expired = element.account.mes;
                                suspendUser(_sum_days_registers, element, _month_expired);

                            } else {
                                //Other date
                                /*console.log('se pasaron de la fecha');
                                console.log(_user_register_day);
                                console.log('fin de la fecha');*/

                            }

                            break;

                        case 3 | 6 | 12:
                            //console.log('cuentas registrados con meses');
                            break;

                        default:
                            //console.log('ninguna cuenta');
                            break;

                    }

                });

            }

        });


        function suspendUser(dayRegister, infoUser, monthRegister) {
            time.schedule('*/1 * * * *', function() {

                var isDate = new Date();


                request('http://localhost/', function(error, response, body) {
                    /*if (!error && response.statusCode == 200) {
                      console.log(body) // Show the HTML for the Google homepage. 
                    }*/
                    console.log('tick');
                    //console.log('enviado');
                });

                var _month = isDate.getMonth();


                if (monthRegister <= 11) {

                    expiredUser();

                } else {

                    expiredUserNewYear();
                }


                function expiredUser() {
                    var _expire = monthRegister + 1;

                    //Preguntamos si estamos en el mes
                    if (_month == _expire) {

                    	//Preguntamos si la fecha de registro del usuario y la fecha actual es igual
		                if(isDate.getDate() == dayRegister) {

		                     //Desabilitamos al usuario
		                        
		                        users.findAndModify({
		                            query: {
		                                _id: infoUser._id
		                            },
		                            update: {
		                                $set: {
		                                    'status': false
		                                }
		                            },
		                            new: true
		                        }).success(function(result) {
		                            console.log('las cuentas gratuitas se suspendieron');

		                        }).error(function(err) {
		                            console.log(err);
		                        });
		                } else {
		                	console.log('Estoy en el mes igual pero no el dia igual');
		                }

                    } else {
                    	console.log('No estoy en el mes');
                    }

                }


                /*if (isDate.getDate() == data) {
                    //To iqual show

                    users.findAndModify({
                        query: {
                            _id: info._id
                        },
                        update: {
                            $set: {
                                'status': false
                            }
                        },
                        new: true
                    }).success(function(result) {
                        console.log('las cuentas gratuitas se suspendieron');

                    }).error(function(err) {
                        console.log(err);
                    })

                    console.log('estoy en la fecha correspondiente: ' + data);

                } else {
                    //Not iqual error
                    console.log('No esta en la fecha correspondiente: ' + data);
                }*/




            });
        }


    }
}
