var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var usuario = new Schema ({
	'nombre': String,
	'apellidos': String,
	'empresa': String,
	'email': String,
	'dni': Number,
	'password': String,
	'senotifiy': [Boolean],
	'propiedades': Array,
	'notificaciones': Array,
	'pagos': Array,
	'cuenta': {
		'type': String,
		'state': Boolean,
		'dia': Number,
		'fecha': String
	},
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