var MP = require ("mercadopago"),
    config = require ("../../config");

exports.run = function (req, res) {
    var mp = new MP (config.client_id, config.client_secret);

    var preference = {
            "items": [
                {
                    "title": "Test",
                    "quantity": 1,
                    "currency_id": "ARS",
                    "unit_price": 10.5
                }
            ]
        };

    mp.createPreference (preference, function (err, data){
        if (err) {
            res.send (err);
        } else {
            res.render ("checkout-buttons/basic-preference/button", {"preference": data});
        }
    });
};