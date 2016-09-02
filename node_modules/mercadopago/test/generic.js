var MP = require("../lib/mercadopago"),
	MercadoPagoError = MP.MercadoPagoError,
	assert = require("assert"),
	Q = require("q"),
	credentials = require("./credentials");

process.setMaxListeners(0);

describe("Generic methods", function(){
	this.timeout(10000);

	var mp;
	
	before ("Instantitate MP", function () {
		mp = new MP(credentials.client_id, credentials.client_secret);
	});

	it("Should get a resource without authorization", function(done) {
		var request = {
			"uri": "/sites/MLA",
			"authenticate": false
		};

		mp.get(request).then(function success(data) {
			try {
				assert.equal(data.status, 200);
				assert.equal(data.response.id, "MLA");

				done();
			} catch (e) {
				done(e);
			}
		},
		done)
	});

	it("Should not allow unauthorized request", function(done) {
		var request = {
            "uri": "/checkout/preferences/dummy",
            "authenticate": false
		}

		mp.get(request).then(function success(data) {
			done(data); // Fail
		}, function error(error) {
			try {
				assert(error instanceof MercadoPagoError);

				done();
			} catch (e) {
				done(e);
			}			
		});
	});

	it("Should use idempotency and not create duplicated resource", function(done) {
        // Card token
        var data = {
            "card_number": "5031755734530604",
            "security_code": "123",
            "expiration_month": 4,
            "expiration_year": 2020,
            "cardholder": {
                "name": "APRO",
                "identification": {
                    "subtype": null,
                    "number": "12345678",
                    "type": "DNI"
                }
            }
        };

        var request = {
            "uri": "/v1/card_tokens",
            "params": {
                "public_key": credentials.public_key
            },
            "data": data,
            "authenticate": false
        };

		mp.post(request).then(function success(cardtoken) {
	        //Payment
	        var data = {
	            "token": cardtoken.response.id,
	            "description": "Payment test",
	            "transaction_amount": 154.9,
	            "payment_method_id": "master",
	            "payer": {
	                "email": "test@localsdk.com"
	            },
	            "installments": 9
	        };

	        var request = {
	            "uri": "/v1/payments",
	            "params": {
	                "access_token": credentials.access_token
	            },
	            "data": data,
	            "headers": {
	                "x-idempotency-key": "sdk-test-idempotency-dummy-key"
	            },
	            "authenticate": false
	        };

	       	mp.post(request).then(function (p1) {
	       		mp.post(request).then(function (p2) {
					try {
						assert.equal(p1.response.id, p2.response.id);

						done();
					} catch (e) {
						done(e);
					}	       			
	       		}, done)
	       	}, done)
		}, done);
	});

	it("Should create and delete a customer", function(done) {
        var request = {
            "uri": "/v1/customers",
            "params": {
                "access_token": credentials.access_token
            },
            "data": {
                "email": "test_"+new Date().getTime()+"@localsdk.com"
            },
            "authenticate": false
        };
		
		mp.post(request).then(function (customer) {
			try {
				assert.equal(customer.status, 201, "Create customer");

				var request = {
		            "uri": "/v1/customers/"+customer.response.id,
		            "params": {
		                "access_token": credentials.access_token
		            },
		            "authenticate": false
		        };

		        mp.delete(request).then(function(deletedCustomer) {
		        	try {
		        		assert.equal(deletedCustomer.status, 200);
		        	} catch (e) {
		        		done(e);
		        	}

		        	done();
		        }, done)
			} catch (e) {
				done(e);
			}
		}, done);
	});
});