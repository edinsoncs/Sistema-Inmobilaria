var express = require('express');
var router= express.Router();
var database = require('../models/mailistsend');

router.get('/', function(req, res, next){

	database(req, res, next);


});

module.exports = router;