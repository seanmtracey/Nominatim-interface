# Nominatim Interface

```javascript

const nominatim = require('nominatim-interface');

nominatim('London') // Search for any placename.
    .then(data => console.log(data))
    .catch(err => console.log('err:', err))
;

```