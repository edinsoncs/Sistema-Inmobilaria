var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var usuario = new Schema ({
	'nombre': String,
	'apellidos': String,
	'empresa': String,
	'email': String,
	'dni': Number,
	'password': String,
	'propiedades': Array,
	'notificaciones': Array,
	'pagos': Array,
	'emailTemplate': {
		'nombreEmpresa': String,
		'imagenLogo': String,
		'direccionEmpresa': String,
		'TelefonoEmpresa': String,
		'emailEmpresa': String
	}
}, {
	collection: 'usuarios'
});

var usuarioModel = mongoose.model('model', usuario);