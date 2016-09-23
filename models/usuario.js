var mongoose = require('mongoose');
var Schema  = mongoose.Schema;

var usuario = new Schema ({
	'nombre': String,
	'apellidos': String,
	'empresa': String,
	'email': String,
	'dni': Number,
	'foto': String,
	'password': String,
	'senotifiy': [Boolean],
	'propiedades': Array,
	'notificaciones': Array,
	'pagos': Array,
	'emailTemplate': {
		'nombreEmpresa': String,
		'imagenLogo': String,
		'direccionEmpresa': String,
		'TelefonoEmpresa': String,
		'emailEmpresa': String
	},					      
	'propiedadesDisponibles': Array,
	'agenda': Array,                                         
	'account': Object,
	'support': Array,
	'status': String,
	'payment': Array,
	'allNotify': Array,
	'misPagos': Array,
	'viewNotify': Array
}, {
	collection: 'usuarios'
});

var usuarioModel = mongoose.model('model', usuario);