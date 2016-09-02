var MP = require ("mercadopago"),
    config = require ("../config");

exports.run = function (req, res) {
    var mp = new MP (config.client_id, config.client_secret);

    var preapprovalPayment = {
        "payer_email": "my_customer@my_site.com",
        "back_url": "http://www.my_site.com",
        "reason": "Monthly subscription to premium package",
        "external_reference": "OP-1234",
        "auto_recurring": {
            "frequency": 1,
            "frequency_type": "months",
            "transaction_amount": 60,
            "currency_id": "BRL",
            "start_date": "2012-12-10T14:58:11.778-03:00",
            "end_date": "2013-06-10T14:58:11.778-03:00"
        }
    };

    mp.createPreapprovalPayment (preapprovalPayment, function (err, data){
        if (err) {
            res.send (err);
        } else {
            res.render ("preapproval-payments/button", {"preapproval": data});
        }
    });
};