var express = require('express');
var router = express.Router();


var bodyParser = require('body-parser');

router.get('/', function(req, res, next){
	res.render('panel', {
		title: 'Panel de administración',
		nombre: req.user.nombre
	});
	console.log(req.user)

});

router.get('/edit', function(req, res, next){
	
	function sendData(data) {
		if(data == 'empresa') {
			return req.user.empresa;
		}
		else if(data == 'email') {
			return req.user.email;
		}
		else if(data == 'apellidos') { 
			return req.user.apellidos;
		}
		else if(data= 'dni') {
			return req.user.dni;
		}
	}

	res.render('edit', {
		title: 'Panel de administración',
		nombre: req.user.nombre,
		apellidos: sendData('apellidos'),
		empresa: sendData('empresa'),
		email: sendData('email'),
		dni: sendData('dni')
	});
	console.log('editando user');
});


router.post('/save', function(req, res, next) {
	console.log(req.body);

	function search(s) {
		if(s == 'dni') {
			return req.body.dni;
		}
		else if(s == 'nombre') {
			return req.body.name;
		}
	}

	var db = req.db;
	var users = db.get('usuarios');

	users.update({'_id': req.user._id}, {
		$set:  {
			'nombre': search('nombre')
		}
	}).success(function(result){
		res.json({inserted: true});
	});

});


module.exports = router;