var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var usuario = new Schema ({
	'nombre': String,
	'empresa': String,
	'email': String,
	'password': String
}, {
	collection: 'usuarios'
});

var usuarioModel = mongoose.model('model', usuario);