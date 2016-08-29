"use strict";

var esid = require('randomid');

module.exports = (req, res, next) => {

    var db = req.db;
    var usuarios = db.get('usuarios');

    var type = req.body.is_type;

    var name = req.body.iduser;
    var id = req.body.idticket;
    var mensaje = req.body.mensaje;


    var idunique = esid(10);


    usuarios.findAndModify({
        query: {
            '_id': name,
            'support': {
                $elemMatch: {
                    'id': id
                }
            }
        },
        update: {
            $push: {
                'support.$.respuesta': {
                    'id': idunique,
                    'type': type,
                    'idresponse': name,
                    'mensaje': mensaje,
                    'foto': req.user.foto,
                    'fecha': dataFecha(new Date())
                }
            }
        },
        new: true
    }).success((data) => {
        res.redirect('/panel/ticket/view/' + id);
    }).error((err) => {
        console.log(err);
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
            return dia[dayStatus] + " " + day + " del " + year;
        }

    }


}
