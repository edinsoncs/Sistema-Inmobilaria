var mongoose = require('mongoose');
var usuario = mongoose.model('model');

var local = require('passport-local').Strategy;

module.exports = function(passport) {

	// Serializa al usuario para almacenarlo en la sesión
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserializa el objeto usuario almacenado en la sesión para
    // poder utilizarlo
    passport.deserializeUser(function(obj, done){
    	done(null, obj);
    });

    //Configuracion de login usuario local

    passport.use(new local(function(email, password, done){

    	console.log(email);

    	process.nextTick(function(){
    		usuario.findOne({
    			'email': email
    		}, function(err, user){
    			if(err) {
    				return done(err);
    			}
    			if(!email){
    				return done(null, false);
    			}
    			if(user.password != password) {
    				return done(null, false);
    			}
    			console.log(user);
    			return done(null, user);

    		});
    	});



    }));


}

