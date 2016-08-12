var express = require('express');
var router = express.Router();

var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var bodyParser = require('body-parser');

var path = require('path');
var url = require('url');
var async = require('async');

var flash = require('connect-flash');

var esid = require('randomid');

router.post('/', multipartMiddleware, function(req, res, next){

  //Other form in array
  /*var _isArr = [];
  _isArr.push(req.files.file); */


  var db = req.db;
  var user = db.get('usuarios');

  req.files.file.forEach(function(elemento, index, arr){
      
      fs.readFile(elemento.path, function(err, data){
          try {
            var nameFiles = esid(10) + elemento.name;
            var saveFiles = path.join(__dirname, '..', 'public', 'services/' + nameFiles);
            
            fs.writeFile(saveFiles, data, function(err){
              if(err) return err;

             user.findAndModify({
              query: {
                '_id': req.user._id,
                propiedades: {
                  $elemMatch: {
                    'id': req.body.idpropiedad
                  }
                }
              },
              update: {
                   $push: {
                      'propiedades.$.serviciosMultimedia': {
                        'id': esid(6),
                        'name': nameFiles,
                        'fecha': dataFecha(new Date())
                      }
                  }
              },
              new: true
             }).success(function(doc){
                res.send();
                res.end();
             });

            });
          }
          catch(err) {
            return err;
          }
      });


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

  

});

module.exports = router;