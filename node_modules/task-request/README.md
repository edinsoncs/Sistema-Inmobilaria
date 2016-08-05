# task-request
> Read files with request.

## The "request" task

### Usage Examples

```js
var request = new (require('task-request'))
request.run(inputs, options, logger)
```

### Options

#### options.url
Type: `url`

A URL string.

#### options.method
Type: `select`
Default: `'GET'`
Options: `'GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'`

HTTP method.

## Release History
* 2014-03-30    0.1.0    Initial release.

## License
Copyright (c) 2014 Yuanyan Cao. Licensed under the MIT license.
