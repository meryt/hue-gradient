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
            light.on         = true;
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

    setLightToColor(lightId, color, res);
};

/**
 * POST /light-gradient set a light to a colour along a gradient
 */
exports.gradient = function(req, res) {
    var lightId = req.body.light;

    var colorStart = Color(req.body.color1);
    var colorEnd = Color(req.body.color2);

    var value = req.body.value;

    var newColor = interpolate(colorStart, colorEnd, value/100.0);

    setLightToColor(lightId, newColor, res);
};

exports.testGradient = function(req, res) {
    var lightId = req.body.light;

    var colorStart = Color(req.body.color1);
    var colorEnd = Color(req.body.color2);

    var i = 0;
    function doGradient() {
        // update color using i
        setLightToColor(lightId, interpolate(colorStart, colorEnd, i/100.0));
        i += 5;
        if (i <= 100) {
            setTimeout(doGradient, 1 * 1000);
        } else {
            console.log('Done iterating gradient');
        }
    }
    doGradient();

    res.json({"message": 'Started iteration'});
};

function setLightToColor(lightId, color, res) {
    client.lights.getById(lightId)
        .then(light => {
            light.brightness = 255;
            light.hue        = normalizeHue(color.hue());
            light.saturation = normalizeSaturation(color.saturation());

            return client.lights.save(light);
        })
        .then(light => {
            if (res) {
                res.json({"message": `Updated light [${light.id}]`});
            }
        })
        .catch(error => {
            console.log(error.stack);
            if (res) {
                res.json({"error": error.message});
            }
        });
}

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

function interpolate(color1, color2, distance) {
    var red = color1.red() + distance * (color2.red() - color1.red());
    var green = color1.green() + distance * (color2.green() - color1.green());
    var blue = color1.blue() + distance * (color2.blue() - color1.blue());

    return new Color.RGB(red, green, blue);
}