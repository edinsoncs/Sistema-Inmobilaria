module.exports = function(req, res, next, id) {

    var db = req.db;
    var ticket = db.get('usuarios');

    ticket.find({}, function(err, users) {
        users.forEach(function(element, index, array) {
            if (element.support) {
                verify(element);

            }
        });
    });

    function verify(data) {
        for (var i = 0; i < data.support.length; i++) {
            var _id = data.support[i].id;
            if (_id == id) {
                console.log('hello');
                console.log(data.support[i]);

                res.render('resticket', {
                    title: 'Responder Ticket Zimba',
                    mensaje: data.support[i],
                    nombre: req.user.nombre,
                    empresa: req.user.empresa,
                    foto: req.user.foto
                });
            }

        }
    }

}
