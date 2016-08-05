var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

router.get('/', function(req, res, next) {


    var db = req.db;
    var user = db.get('usuarios');

    user.find({}, function(err, doc) {
        try {

            verify(doc);

        } catch (err) {
            return err;
        }
    });


    function verify(doc) {
        var date = new Date();
        var dia = date.getDay();

        if (dia >= 1 && dia <= 2) {
            //send
        } else if (dia >= 4 && dia <= 5) {
            for (var i = 0; i < doc.length; i++) {
                var id = doc[i]._id;
                var emails = doc[i].email;

                user.findAndModify({
                    query: { '_id': id },
                    update: {
                        $set: {
                            'senotifiy': true
                        }
                    },
                    new: true
                }).success(function(suc)	{
                	console.log('actualizado');
                });

            }

        }
    }

    								

});

module.exports = router;
