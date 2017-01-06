var Color = require('onecolor');

var MAX_PHILIPS_HUE = 65535;

var client = new (require('huejay')).Client({
    host: process.env.HUE_BRIDGE_HOST,
    username: process.env.HUE_API_USERNAME
});

/**
 * GET /lights for display in select list
 */
exports.lights = function(req, res) {
    var response = [];

    client.lights.getAll()
        .then(lights => {
            for (let light of lights) {
                response.push({"id": light.id, "name": light.id + " - " + light.name});
            }
            res.json(response);
        });
};

/**
 * POST /light update a light to a random bright color
 */
exports.light = function(req, res) {

    var lightId = req.body.light;
    var randomHue = Math.floor(Math.random() * (65535 + 1));

    // The lightness is not the same as Hue brightness.
    // Pick a value that shows the approximate colour of the light.
    var color = new Color.HSL(philipsHueToCssHue(randomHue), 1, 0.65);

    client.lights.getById(lightId)
        .then(light => {
            light.brightness = 255;
            light.hue        = randomHue;
            light.saturation = 255;

            return client.lights.save(light);
        })
        .then(light => {
            var hex = color.rgb().hex();
            var message = `Updated light [${light.id}] to ` + hex;
            console.log(message);
            res.json({"message" : message, "hex": hex});
        })
        .catch(error => {
            console.log(error.stack);
            res.json({"error": error.message});
        });
};

/**
 * POST /light-set update a light to a specific colour
 */
exports.lightSet = function(req, res) {

    var lightId = req.body.light;

    // Convert from an rgb string like #FF0000 to a color object
    var color = Color(req.body.color);
    console.log('Setting colour to H' + color.hue() + " S" + color.saturation() + " L" + color.lightness());

    client.lights.getById(lightId)
        .then(light => {
            light.brightness = normalizeLightness(color.lightness());
            light.hue        = normalizeHue(color.hue());
            light.saturation = normalizeSaturation(color.saturation());

            return client.lights.save(light);
        })
        .then(light => {
            res.json({"message" : `Updated light [${light.id}]`});
        })
        .catch(error => {
            console.log(error.stack);
            res.json({"error": error.message});
        });
};

function normalize(fraction, max) {
    return Math.round(fraction * max);
}

function normalizeHue(fraction) {
    return normalize(fraction, MAX_PHILIPS_HUE);
}

function normalizeLightness(fraction) {
    return normalize(fraction, 255);
}

function normalizeSaturation(fraction) {
    return normalize(fraction, 255);
}

function philipsHueToCssHue(philipsHue) {
    return philipsHue / MAX_PHILIPS_HUE;
}