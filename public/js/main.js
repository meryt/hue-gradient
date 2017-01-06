$(function() {

    $.get("/lights", function(data) {
        $("#lights").find('option').remove();
        $("#lights-set").find('option').remove();
        for (var i in data) {
            $("#lights").append(new Option(data[i].name, data[i].id));
            $("#lights-set").append(new Option(data[i].name, data[i].id));
        }
    });

    // Click handler for test button
    $("#test-light").click(function() {
        $.post("/light", {"light": $("#lights").val()}, function(data) {

        });
    });

    // Click handler for set button
    $("#set-light").click(function() {
        $.post("/light-set", {"light": $("#lights-set").val(), "color": $("#colour-set").val()}, function(data) {

        });
    });

});
