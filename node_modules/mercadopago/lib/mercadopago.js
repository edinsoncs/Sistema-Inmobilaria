"use strict";

var p = require("../package"),
	request = require ("request"),
	Q = require ("q");

var config = {
	API_BASE_URL: "https://api.mercadopago.com",
	MIME_JSON: "application/json",
	MIME_FORM: "application/x-www-form-urlencoded"
};

function MercadoPagoError(message, status) {
	this.name = "MercadoPagoError";
	this.message = message || "MercadoPago Unknown error";
	this.stack = (new Error()).stack;
	this.status = status || 500;
}

MercadoPagoError.prototype = Object.create(Error.prototype);
MercadoPagoError.prototype.constructor = MercadoPagoError;

var MP = function () {
	var __llAccessToken,
		__clientId,
		__clientSecret,
		__sandbox = false;

	if (arguments.length > 2 || arguments.length < 1) {
		throw new MercadoPagoError("Invalid arguments. Use CLIENT_ID and CLIENT SECRET, or ACCESS_TOKEN", 400);
	}

	if (arguments.length == 1) {
		__llAccessToken = arguments[0];
	}

	if (arguments.length == 2) {
		__clientId = arguments[0];
		__clientSecret = arguments[1];
	}

	// Instance creation
	var mp = {};

    /**
     * Switch or get Sandbox Mode for Basic Checkout
     */
	mp.sandboxMode = function (enable) {
		if (enable !== null && enable !== undefined) {
			__sandbox = enable === true;
		}

		return __sandbox;
	};

    /**
     * Get Access Token for API use
     */
	mp.getAccessToken = function () {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		var deferred = Q.defer();

		if (__llAccessToken) {
			next && next(null, __llAccessToken);
			deferred.resolve (__llAccessToken);
		} else {
			MPRestClient.post({
				"uri": "/oauth/token",
				"data": {
					"client_id": __clientId,
					"client_secret": __clientSecret,
					"grant_type": "client_credentials"
				},
				"headers": {
					"Content-type": config.MIME_FORM
				}
			}).then (
				function success (data) {
					next && next(null, data.response.access_token);
					deferred.resolve (data.response.access_token);
				},
				function error (err) {
					next && next(err);
					deferred.reject (err);
				}
			);
		}

		return deferred.promise;
	};

	/**
	Generic resource get
	@param req
	@param params (deprecated)
	@param authenticate = true (deprecated)
	*/
	mp.get = function (req) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		var deferred = Q.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"params": arguments[1],
				"authenticate": arguments[2]
			};
		}

		req.authenticate = req.authenticate !== false;

		var auth = Q.Promise(function(resolve, reject) {
			if (req.authenticate) {
				resolve(mp.getAccessToken());
			} else {
				resolve();
			}
		});

		auth.then(function success(at) {
			if (at) {
				req.params || (req.params = {});
				req.params.access_token = at;
			}

			MPRestClient.get(req).then (
				function success (data) {
					next && next(null, data);
					deferred.resolve (data);
				},
				function error (err) {
					next && next(err);
					deferred.reject (err);
				}
			);
		},
		deferred.reject);

		return deferred.promise;
	};

	/**
	Generic resource post
	@param req
	@param data (deprecated)
	@param params (deprecated)
	*/
	mp.post = function (req) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		var deferred = Q.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"data": arguments[1],
				"params": arguments[2]
			};
		}

		req.authenticate = req.authenticate !== false;

		var auth = Q.Promise(function(resolve, reject) {
			if (req.authenticate) {
				resolve(mp.getAccessToken());
			} else {
				resolve();
			}
		});

		auth.then(function success(at) {
			if (at) {
				req.params || (req.params = {});
				req.params.access_token = at;
			}

			MPRestClient.post(req).then (
				function success (data) {
					next && next(null, data);
					deferred.resolve (data);
				},
				function error (err) {
					next && next(err);
					deferred.reject (err);
				}
			);
		},
		deferred.reject);

		return deferred.promise;
	};

	/**
	Generic resource put
	@param req
	@param data (deprecated)
	@param params (deprecated)
	*/
	mp.put = function (req) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		var deferred = Q.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"data": arguments[1],
				"params": arguments[2]
			};
		}

		req.authenticate = req.authenticate !== false;

		var auth = Q.Promise(function(resolve, reject) {
			if (req.authenticate) {
				resolve(mp.getAccessToken());
			} else {
				resolve();
			}
		});

		auth.then(function success(at) {
			if (at) {
				req.params || (req.params = {});
				req.params.access_token = at;
			}

			MPRestClient.put(req).then (
				function success (data) {
					next && next(null, data);
					deferred.resolve (data);
				},
				function error (err) {
					next && next(err);
					deferred.reject (err);
				}
			);
		},
		deferred.reject);

		return deferred.promise;
	};

	/**
	Generic resource delete
	@param req
	@param params (deprecated)
	*/
	mp.delete = function (req) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;
		var deferred = Q.defer();

		if (typeof req == "string") {
			req = {
				"uri": req,
				"params": arguments[1]
			};
		}

		req.authenticate = req.authenticate !== false;

		var auth = Q.Promise(function(resolve, reject) {
			if (req.authenticate) {
				resolve(mp.getAccessToken());
			} else {
				resolve();
			}
		});

		auth.then(function success(at) {
			if (at) {
				req.params || (req.params = {});
				req.params.access_token = at;
			}

			MPRestClient.delete(req).then (
				function success (data) {
					next && next(null, data);
					deferred.resolve (data);
				},
				function error (err) {
					next && next(err);
					deferred.reject (err);
				}
			);
		},
		deferred.reject);

		return deferred.promise;
	};

	// Backward compatibility
	/**
	Create a checkout preference
	@param preference
	@return json
	*/
	mp.createPreference = function (preference){
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.post ({
			"uri": "/checkout/preferences",
			"data": preference
		}, next);
	};

	/**
	Update a checkout preference
	@param id
	@param preference
	@return json
	*/
	mp.updatePreference = function (id, preference) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/checkout/preferences/"+id,
			"data": preference
		}, next);
	};

	/**
	Get a checkout preference
	@param id
	@return json
	*/
	mp.getPreference = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.get ({
			"uri": "/checkout/preferences/"+id
		},next);
	};

	/**
	Create a preapproval payment
	@param preapprovalPayment
	@return json
	*/
	mp.createPreapprovalPayment = function (preapprovalPayment){
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.post ({
			"uri": "/preapproval",
			"data": preapprovalPayment
		}, next)
	};

	/**
	Update a preapproval payment
	@param preapprovalPayment
	@return json
	*/
	mp.updatePreapprovalPayment = function (id, preapprovalPayment){
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/preapproval/"+id,
			"data": preapprovalPayment
		}, next)
	};

	/**
	Get a preapproval payment
	@param id
	@return json
	*/
	mp.getPreapprovalPayment = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.get ({
			"uri": "/preapproval/"+id
		}, next);
	};

	/**
	Search payments according to filters, with pagination
	@param filters
	@param offset
	@param limit
	@return json
	*/
	mp.searchPayment = function (filters, offset, limit) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		if (!isNaN(offset)) {
			filters.offset = offset;
		}
		if (!isNaN(limit)) {
			filters.limit = limit;
		}

		var uriPrefix = this.__sandbox ? "/sandbox" : "";

		return mp.get ({
			"uri": uriPrefix+"/collections/search",
			"params": filters
		}, next);
	};

	/**
	Get information for specific payment
	@param id
	@return json
	*/    
	mp.getPayment = mp.getPaymentInfo = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		var uriPrefix = this.__sandbox ? "/sandbox" : "";

		return mp.get ({
			"uri": uriPrefix+"/collections/notifications/"+id
		}, next);
	};

	/**
	Get information for specific authorized payment
	@param id
	@return json
	*/    
	mp.getAuthorizedPayment = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.get ({
			"uri": "/authorized_payments/"+id
		}, next);
	};

	/**
	Refund accredited payment
	@param id
	@return json
	*/    
	mp.refundPayment = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/collections/"+id,
			"data": {
				"status": "refunded"
			}
		}, next);
	};

	/**
	Cancel pending payment
	@param id
	@return json
	*/    
	mp.cancelPayment = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/collections/"+id,
			"data": {
				"status": "cancelled"
			}
		}, next);
	};

	/**
	Cancel preapproval payment
	@param id
	@return json
	*/    
	mp.cancelPreapprovalPayment = function (id) {
		var next = typeof (arguments[arguments.length -1]) == "function" ? arguments[arguments.length -1] : null;

		return mp.put ({
			"uri": "/preapproval/"+id,
			"data": {
				"status": "cancelled"
			}
		}, next);
	};

	// Instance return
	return mp;
};

MP.version = p.version;

// /*************************************************************************/

var MPRestClient = (function() {
	function buildRequest (req) {
		var request = {};

		request.uri = config.API_BASE_URL + req.uri;
		request.method = req.method || "GET";

		req.headers || (req.headers = {});

		request.headers = {			
			"user-agent": "MercadoPago Node.js SDK v"+MP.version,
			"accept": config.MIME_JSON,
			"content-type": config.MIME_JSON
		};
		Object.keys(req.headers).map(function (h) {
			request.headers[h.toLowerCase()] = req.headers[h];
		});

		if (req.data) {
			if (request.headers["content-type"] == config.MIME_JSON) {
				request.json = req.data;
			} else {
				request.form = req.data;
			}
		}

		if (req.params) {
			request.qs = req.params;
		}

		request.strictSSL = true;

		return request;
	}

	function exec (req) {
		var deferred = Q.defer();

		req = buildRequest(req);

		request(req, function(error, response, body) {
			if (error) {
				deferred.reject (new MercadoPagoError(error));
			} else if (response.statusCode < 200 || response.statusCode >= 300) {
				deferred.reject (new MercadoPagoError(body ? body.message || body : "Unknown", response.statusCode));
			} else {
				try {
					(typeof body == "string") && (body = JSON.parse(body));
				} catch (e) {
					deferred.reject(new MercadoPagoError ("Bad response"));
				}

				deferred.resolve ({
					"status": response.statusCode,
					"response": body
				});
			}
		});

		return deferred.promise;

	}

	// Instance creation
	var restclient = {};

	restclient.get = function (req) {
		req.method = "GET";

		return exec(req);
	};

	restclient.post = function (req) {
		req.method = "POST";

		return exec(req);
	};

	restclient.put = function (req) {
		req.method = "PUT";

		return exec(req);
	};

	restclient.delete = function (req) {
		req.method = "DELETE";

		return exec(req);
	};

	return restclient;
})();

module.exports = MP;
module.exports.MercadoPagoError = MercadoPagoError;