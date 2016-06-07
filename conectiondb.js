var monk = require('monk');
var db = monk('localhost:27017/administracion');

module.exports = function(req, res, next) {
	req.db = db;
	console.log('conecte a la base de datos');
	next();
}