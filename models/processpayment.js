"use strict";

module.exports = (req, res, next) => {
    var db = req.db;
    var user = db.get('usuarios');

    user.findAndModify({
        query: {
            '_id': req.user._id
        },
        update: {
            $push: {
                'misPagos': {
                    'fecha': dataFecha(new Date()),
                    'metodo': 'MercadoPago',
                    'type': req.body.type
                }
            }
        },
        new: true
    }).success(function(data){
    	res.json({title: 'Se añadio el nuevo pago'});
    });


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
            return dia[dayStatus] + " " + day + " de " +  meses[mes] +"del " + year;
        }

    }

}
