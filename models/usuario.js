var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var usuario = new Schema ({
	'nombre': String,
	'apellidos': String,
	'empresa': String,
	'email': String,
	'dni': Number,
	'password': String,
	'propiedades': Array
}, {
	collection: 'usuarios'
});

var usuarioModel = mongoose.model('model', usuario);