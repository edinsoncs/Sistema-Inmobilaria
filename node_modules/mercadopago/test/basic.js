var MP = require("../lib/mercadopago"),
	MercadoPagoError = MP.MercadoPagoError,
	assert = require("assert"),
	credentials = require("./credentials");

process.setMaxListeners(0);

describe("Basic", function () {
    describe("Instantiation exception", function() {
    	function instantiate() {
    		new MP("param 1", "param 2", "param 3");
    	}

    	it("Should throw an exception because wrong parameters", function() {
    		assert.throws(
	    		instantiate,
	    		MercadoPagoError,
	    		"Error thrown"
	    	);
    	});
    });

	describe("Long Live Access Token", function() {
		var mp = new MP(credentials.access_token);

		it("Should return the access_token", function () {
			assert.equal (mp.getAccessToken(), credentials.access_token);
		});
	});
});
