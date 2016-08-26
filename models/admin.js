//Module admin show list peticions tickets support

var bodyParser = require('body-parser');

module.exports = function(req, res, next) {

    var db = req.db;
    var usuarios = db.get('usuarios');

    usuarios.find({}, function(err, doc) {
        if (err) {
            return err;
        } else {
            logic(doc);
        }

    });

    function logic(data) {
        data.forEach(function(element, index, array) {
            if (element.support) {
            
                verifyUser(req.user.nombre, element.support);
            }
        });
    }

    function verifyUser(user, element) {

        if (user == 'edinson' || user == 'Edinson' || user == 'EDINSON') {
            console.log(element);
            
            res.render('admin', {
                title: 'Soporte Admin',
                support: element,
                nombre: req.user.nombre,
                empresa: req.user.empresa,
                foto: req.user.foto                                                                                                                                                                                                                                                                                                        
            });
        } else {
            //res.redirect('./panel');
        }
    }

}
