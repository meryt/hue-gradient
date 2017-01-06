## Hue Gradient

### Getting started

```
npm install
npm run init-env
```

Edit the .env file to set the HUE_BRIDGE_HOST and and HUE_API_USERNAME values for
your Hue system. See https://developers.meethue.com/documentation/getting-started
to learn how to obtain these values.

```
npm start
```

This will start the server on port 3000. You can change the port by adding `PORT` to
your .env file and setting a different value.

When the server starts up, it also attempts to connect to the Hue Bridge defined in
.env, and if it fails to connect or fails to authenticate, the server process will
exit.

