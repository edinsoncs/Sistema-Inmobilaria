var MP = require ("mercadopago"),
    config = require ("../config");

exports.run = function (req, res) {
    var mp = new MP (config.client_id, config.client_secret);

    var filters = {
            "range": "date_created",
            "begin_date": "2011-10-21T00:00:00Z",
            "end_date": "2011-10-25T24:00:00Z",
            "payment_type": "credit_card",
            "operation_type": "regular_payment"
        };

    mp.searchPayment (filters, function (err, data){
        if (err) {
            res.send (err);
        } else {
            res.render ("payment-search/search-result", {"result": data});
        }
    });
};
