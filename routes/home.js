var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){


	res.render('inicioweb', {
		title: 'Zimba Administración de propiedades - Inmobiliarias'
	});

});

module.exports = router;