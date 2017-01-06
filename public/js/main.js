$(function() {

    // Initialize the dropdowns with the list of lights
    $.get("/lights", function(data) {
        $("#lights").find('option').remove();
        $("#lights-set").find('option').remove();
        $("#lights-gradient").find('option').remove();
        for (var i in data) {
            $("#lights").append(new Option(data[i].name, data[i].id));
            $("#lights-set").append(new Option(data[i].name, data[i].id));
            $("#lights-gradient").append(new Option(data[i].name, data[i].id));
        }
    });

    // Click handler for test button
    $("#test-light").click(function() {
        $.post("/light", {"light": $("#lights").val()}, function(data) {
            if (data.error) {
                alert(data.error);
            } else {
                var newColor = data.hex;
                $("#colour-set").val(newColor);
            }
        });
    });

    // Click handler for set button
    $("#set-light").click(function() {
        $.post("/light-set", {"light": $("#lights-set").val(), "color": $("#colour-set").val()}, function(data) {
            if (data.error) {
                alert(data.error);
            }
        });
    });

    // Click handler for gradient button
    $("#set-gradient").click(function() {
        $.post("/light-gradient", {
                "light": $("#lights-gradient").val(),
                "color1": $("#colour-one").val(),
                "color2": $("#colour-two").val(),
                "value": $("#value").val()
            },
            function(data) {
                if (data.error) {
                    alert(data.error);
                }
            });
    });

    // Click handler for test-gradient button
    $("#test-gradient").click(function() {
        $.post("/test-gradient", {
                "light": $("#lights").val(),
                "color1": $("#colour-one").val(),
                "color2": $("#colour-two").val()
            },
            function(data) {
                if (data.error) {
                    alert(data.error);
                }
            });
    });

});
