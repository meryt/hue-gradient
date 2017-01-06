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
 * POST /light update a light
 */
exports.light = function(req, res) {

    var lightId = req.body.light;

    client.lights.getById(lightId)
        .then(light => {
            var randomHue = Math.floor(Math.random() * (65535 + 1));

            light.brightness = 254;
            light.hue        = randomHue;
            light.saturation = 254;

            return client.lights.save(light);
        })
        .then(light => {
            res.json({"message" : `Updated light [${light.id}]`});
        })
        .catch(error => {
            console.log('Something went wrong');
            console.log(error.stack);
            res.json({"message": "Error"});
        });


};
