var express = require('express');
var router = express.Router();
var newUser = require('../models/newuser');
var registerUser = require('../models/register');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.get('/', function(req, res, next){
	newUser(req, res, next);
});

router.post('/newaccount', multipartMiddleware, function(req, res, next){
	var file = req.files;
	registerUser(req, res, next, file);
});


module.exports = router;