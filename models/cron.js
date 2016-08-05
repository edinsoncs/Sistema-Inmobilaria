var request = require("request");

module.exports = {
	active: function(time, req) {
		
		time.schedule('*/1 * * * *', function(){
		  console.log('running a task every two minutes');

		 request('http://localhost:3000/cron', function (error, response, body) {
			  if (!error && response.statusCode == 200) {
			    console.log(body) // Show the HTML for the Google homepage. 
			  }
			  console.log('enviado');
			});

		});
	}
}