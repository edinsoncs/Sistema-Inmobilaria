var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Execution = require('execution');
var Record = require('record');

module.exports = Execution.extend({
    // The type of option could be HTML5 input types: file, directory, number, range, select,
    // url, email, tel, color, date, time, month, time, week, datetime(datetime-local),
    // string(text), boolean(checkbox), array, regexp, function and object.
    options: {
        url: {
            type: 'url'
        },
        method: {
            label: 'http method',
            default: 'GET',
            type: 'select',
            options: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE']
        }
    },
    run: function (inputs, options, logger) {
        if (_.isString(options)) {
            options = {url: options};
        }
        return this._run(inputs, options, logger);
    },
    execute: function (resolve, reject) {
        var options = this.options;
        var inputs = this.inputs;
        var logger = this.logger;

        logger.log('Requesting', options.url);

        var request = require('request');
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var record = new Record({
                    path: options.url,
                    contents: body
                });
                resolve(inputs.concat(record));
            } else {
                reject(error)
            }
        })
    }
})
