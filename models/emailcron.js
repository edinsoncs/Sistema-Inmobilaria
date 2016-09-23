"use strict";

var request = require("request");

module.exports = {
    active: (time, req, res, next) => {

        time.schedule('10 * * * * *', () => {

            /*request('http://localhost/monthproperti', function(error, response, body) {
            	if(error){
            		return error;
            	} else {
            		console.log('Se envio un cron a monthproperti');
            	}

            });*/

        });


    }
}
