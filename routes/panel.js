var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	res.render('panel', {
		title: 'Panel de administración',
		nombre: req.user.nombre
	});
	console.log(req.user)

});


module.exports = router;