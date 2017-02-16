'use strict';

var request = require("request");
 var GLOBAL_ELEMENT;

module.exports = {
    active: function(time, req, res, next) {

        var db = req.db;
        var users = db.get('usuarios');
        var cronpropiedades = db.get('usuarioscron');


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

                            if (_user_register_day <= 31) {
                                //Primary Date´s
                                var _sum_days_registers = _user_register_day;
                                var _month_expired = element.account.mes;
                                var _type = 0;
                                suspendUser(_sum_days_registers, element, _month_expired, 0);

                            }
                            break;

                        case 3:

                            if (_user_register_day <= 31) {

                                var _sum_days_registers = _user_register_day;
                                var _month_expired = element.account.mes;
                                var _type = 3;

                                suspendUser(_sum_days_registers, element, _month_expired, _type);
                            }

                            break;
                        case 6:
                            if (_user_register_day <= 31) {

                                var _sum_days_registers = _user_register_day;
                                var _month_expired = element.account.mes;
                                var _type = 6;

                                suspendUser(_sum_days_registers, element, _month_expired, _type);
                            }
                            break;
                        case 12:
                            if (_user_register_day <= 31) {

                                var _sum_days_registers = _user_register_day;
                                var _month_expired = element.account.mes;
                                var _type = 12;

                                suspendUser(_sum_days_registers, element, _month_expired, _type);
                            }

                            break;
                        default:
                            //console.log('ninguna cuenta');

                            break;
                    }

                });

            }

        });


        function suspendUser(dayRegister, infoUser, monthRegister, type) {
            time.schedule('* * 2 * * *', function() {

                var isDate = new Date();


                request('http://localhost/', function(error, response, body) {

                });

                var _month = isDate.getMonth() + 1;
                var _typeAccount = type;


                if (monthRegister <= 12) {

                    expiredUser(_typeAccount);

                }

                function expiredUser(is_type) {
                    var _expire = monthRegister + 1;

                    //console.log(is_type);

                    switch (is_type) {
                        case 0:
                            //Preguntamos si estamos en el mes

                            if (_month == _expire) {

                                //Preguntamos si la fecha de registro del usuario y la fecha actual es igual
                                if (isDate.getDate() == dayRegister) {

                                    //Desabilitamos al usuario
                                    bdDesabilty(infoUser._id);

                                } else {
                                    //console.log('Estoy en el mes igual pero no el dia igual');
                                }

                            } else {
                                //console.log('No estoy en el mes');
                            }

                            break;
                            //Continue creado el 07/09/16

                            /*case 3:

                            console.log('analizando usuarios.... de 3 meses pago');

                            //Preguntamos si estamos en el mes
                            var _isMonthActuality = isDate.getMonth() + 2;
                            var _expire_month = monthRegister + 2;

                            if (_isMonthActuality == _expire_month) {

                                //Preguntamos si la fecha de registro del usuario y la fecha actual es igual
                                if (isDate.getDate() == dayRegister) {

                                    //Desabilitamos al usuario
                                    bdDesabilty(infoUser._id);

                                } else {
                                    console.log('Estoy en el mes igual pero no el dia igual');
                                }


                            } else {
                                console.log('No estoy en el mes');
                            }
                            
                            
                            break;

                        case 6:

                            console.log('Analizando usuarios de..... 6 meses pago');

                            var _isMonthActuality = isDate.getMonth();
                            var _expire_month = monthRegister + 2;

                            if (_isMonthActuality == _expire_month) {

                                //Preguntamos si la fecha de registro del usuario y la fecha actual es igual
                                if (isDate.getDate() == dayRegister) {

                                    //Desabilitamos al usuario
                                    bdDesabilty(infoUser._id);

                                } else {
                                    console.log('Estoy en el mes igual pero no el dia igual');
                                }


                            } else {
                                console.log('No estoy en el mes');
                            }

                            break;
                           */

                        default:
                            console.log('nddasdas');
                    }



                }


                function bdDesabilty(id) {

                    users.findAndModify({
                        query: {
                            _id: id
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

                }





            });
        }



        /*cronpropiedades.find({}, (err, data) => {
            if (err) {
                return err;
            } else {
                var date = new Date();
                var yearActuality = date.getFullYear();
                var monthActuality = date.getMonth() + 1;
                data.map(function(thisArr, index, array) {
                    if (thisArr.yearexpired == yearActuality) {

                        propiedades(thisArr, index, array, monthActuality);

                    } else {
                        console.log('estoy en el año: ' + yearActuality);
                    }

                });
            }
        });*/

        var ISDATE = new Date();
        var yearActuality = ISDATE.getFullYear();
        var monthActuality = ISDATE.getMonth() + 1;

        cronpropiedades.find({ 'yearexpired': yearActuality.toString() }, function(err, doc) {
            if (err) {
                return err;
            } else {
                propiedades(doc, monthActuality);
            }
        });

        /*function propiedades(propiedad, index, array, month) {


            //Verify month 3-1-17

            if (month == (propiedad.monthexpired - 1)) {
                console.log('Esta propiedad vence el proximo mes');
                applyNotify(propiedad);

            } else {
                console.log('esta propiedad vencio el año pasado')
                    //console.log(propiedad);
            }


            time.schedule('* 1 * * * *', function() {
                request('http://localhost/', function(error, response, body) {

                });

            });

        }*/

        function propiedades(data, month) {
           
            data.forEach(function(element, index, arr) {
                if ((element.monthexpired - 1) == month) {
                    applyNotify(element);
                } else {
                    console.log('esta propiedad vencio el año pasado')
                        //console.log(propiedad);
                }
            });
            
        }

        function applyNotify(data) {
            users.find({ 'allNotify.idpropiedad': { $exists: true, $in: [data.idPropiedad] } }, function(err, result) {
                if (err) {
                    return err;
                } else {
                    console.log(result.length);

                }
            });


           /*users.findAndModify({
                 query: {
                     '_id': data.idUsuario
                 },
                 update: {
                     $add: {
                         'allNotify': {
                             'txt': data.nombrePropiedad,
                             'fecha': data.completExpired
                         }
                     }
                 },
                 new: true
             }).success(function(great){
                 console.log('se aplico');
             });*/

           

        } 





    }
}
