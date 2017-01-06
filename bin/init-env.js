'use strict';

var fs = require('fs');

var path = __dirname + "/../.env";

if (!fs.existsSync(path)) {
    fs.writeFile(path,
        "SESSION_SECRET='" + require('crypto').randomBytes(32).toString('hex') + "'\n\n" +
        "# To obtain the below see https://developers.meethue.com/documentation/getting-started\n" +
        "HUE_BRIDGE_HOST='192.168.0.0'\n" +
        "HUE_API_USERNAME='abcxyz'\n",
        function(err) {
            if (err) {
                return console.log(err);
            }
            console.log('Created .env');
        }
    );
}
