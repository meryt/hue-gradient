$(function() {

    $.get("/lights", function(data) {
        for (var i in data) {
            $("#lights").append(new Option(data[i].name, data[i].id));
        }
    });

    // Click handler for test button
    $("#test-light").click(function() {
        $.post("/light", {"light": $("#lights").val()}, function(data) {
           alert(data.message);
        });
    });

});
