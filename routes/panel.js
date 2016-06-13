var express = require('express');
var router = express.Router();

var fs = require('fs');

var multipart  = require('connect-multiparty');

var multipartMiddleware  = multipart ();



var bodyParser = require('body-parser');

router.get('/', function(req, res, next){
	res.render('panel', {
		title: 'Panel de administración',
		nombre: req.user.nombre,
		empresa: req.user.empresa
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
		else if(s == 'apellidos') {
			return req.body.apellidos;
		}
		else if(s == 'email') {
			return req.body.email;
		}
		else if(s == 'dni') {
			return req.body.dni;
		}
	}

	var db = req.db;
	var users = db.get('usuarios');

	users.update({'_id': req.user._id}, {
		$set:  {
			'nombre': search('nombre'),
			'apellidos': search('apellidos'),
			'email': search('email'),
			'dni': search('dni')
		}
	}).success(function(result){
		res.redirect('/panel/edit')
	});

});

router.get('/propiedades', function(req, res, next) {
	res.render('propiedades', {
		title: 'Panel de administración',
		nombre: req.user.nombre,
		empresa: req.user.empresa
	});
});


router.get('/propiedades/add', function(req, res, next) {

	res.render('add', {
		title: 'Nueva propiedad',
		nombre: req.user.nombre,
		empresa: req.user.empresa
	});

});


router.post('/addcreate', multipartMiddleware , function(req, res, next) {

	var nameFile = req.files.img.path;

	fs.readFile(nameFile, function(err, data) {
		console.log(data);
	});


});

module.exports = router;