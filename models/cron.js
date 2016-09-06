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

                                if (_user_register_day <= 13) {
                                    //Primary Date´s
                                    var _sum_days_registers = _user_register_day + _sum;
                                    suspendUser(_sum_days_registers, element);

                                } else if (_user_register_day >= 14 || _user_register_day <= 30) {

                                    var _sum_days_registers = _user_register_day;
                                    suspendOtherUser(_sum_days_registers, element);
                                    
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


            function suspendUser(data, info) {
                time.schedule('*/1 * * * *', function() {

                    var isDate = new Date();


                    request('http://localhost/', function(error, response, body) {
                        /*if (!error && response.statusCode == 200) {
                          console.log(body) // Show the HTML for the Google homepage. 
                        }*/
                        console.log('tick');
                        //console.log('enviado');
                    });



                    if (isDate.getDate() == data) {
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
                    }


                });
            }

            function suspendOtherUser(data, info) {
                time.schedule('*/10 */1 * * * *', function() {

                        var isDate = new Date();


                        request('http://localhost/', function(error, response, body) {
                            /*if (!error && response.statusCode == 200) {
                              console.log(body) // Show the HTML for the Google homepage. 
                            }*/
                            console.log('tick');
                            //console.log('enviado');
                        });

                        var _sumMonth = isDate.getMonth();
                        var _sum = _sumMonth + 1

                        if (_sum > isDate.getMonth()) {

                            verifyUser(data);

                            console.log('estoy en el mes de septiembre');
                           
                        } else {

                        	console.log('ddesdeds');
                        }


                        function verifyUser(dia) {

                                if (dia == isDate.getMonth()) {

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
                                        console.log('las cuentas gratuitas se suspendieron mayores a 15 de la fecha');

                                    }).error(function(err) {
                                        console.log(err);
                                    });

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
                                }).success(function(result){
                                	console.log('las cuentas gratuitas se suspendieron');

                                }).error(function(err){
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
