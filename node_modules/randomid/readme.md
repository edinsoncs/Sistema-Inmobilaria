# Node RandomID
RandomID it's a little module for NodeJS for generating passwords or UniqID with length customization.  

RandomID is capable of generating codes with the alphanumeric characters with and without capital letters (a-z, A-Z, 0-9).

## How to use RandomID
You need to install randomID with **npm**:
``` 
npm install randomid
```
   
Require randomID and call the function: 
```javascript
var randomid = require('randomid')

console.log(randomid(24))
```

The function has only **one property**. It's a length of the result.

## A problem, bug ?
If you have found a bug, please open an issue on GitHub.