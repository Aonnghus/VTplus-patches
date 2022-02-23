$(document).ready(function() {
    var maxWatts = $("#select-amp").find(":selected").val();
    $("#select-amp").on("change", function() {
        maxWatts = $(this).find(":selected").val();
        if (typeof settings != "undefined") {
            applySettings(settings, maxWatts);
        }
    });
    $("#click").click(function() {
        var selectedIndex = parseInt($("#text").val());
        if (0 <= selectedIndex && selectedIndex < arrayJSON.length) {
            settings = arrayJSON[selectedIndex];
            console.log(settings);
            applySettings(settings, maxWatts);
        } else {
            alert("Wrong patch number!");
        }
        
    });
});

function applySettings(settings, maxWatts) {
    $("#knob-amp").css({"transform": "rotate(" + 30 * settings["Amp style"] + "deg)"});
    $("#power").css({"transform": "rotate(" + Math.min(30 + 3 * (settings["PowerLevel"] * settings["AmpPower"] / maxWatts), 330) + "deg)"});
    $("#gain").css({"transform": "rotate(" + (30 + 3 * settings["Gain"]) + "deg)"});
    $("#volume").css({"transform": "rotate(" + (30 + 3 * settings["Volume"]) + "deg)"});
    $("#treble").css({"transform": "rotate(" + (30 + 3 * settings["Treble"]) + "deg)"});
    $("#middle").css({"transform": "rotate(" + (30 + 3 * settings["Middle"]) + "deg)"});
    $("#bass").css({"transform": "rotate(" + (30 + 3 * settings["Bass"]) + "deg)"});
    $("#master").css({"transform": "rotate(" + (30 + 3 * settings["Master"]) + "deg)"});
    $("#pedal-selector").css({"transform": "rotate(" + (30 * settings["Effect1"]) + "deg)"});
    $("#pedal-value").css({"transform": "rotate(" + (30 + 3 * settings["Edit1"]) + "deg)"});
    $("#mod").css({"transform": "rotate(" + (30 * settings["Effect2"]) + "deg)"});
    $("#depth").css({"transform": "rotate(" + (30 + 3 * settings["Edit2"]) + "deg)"});
    $("#reverb-selector").css({"transform": "rotate(" + (30 + 3 * settings["Edit3"]) + "deg)"});

    switch(settings["Red-Green"]) {
        case "1.0":
            $("#led-amp").attr("src", "assets/images/green.png");
            break;
        case "2.0":
            $("#led-amp").attr("src", "assets/images/red.png");
            break;
        case "3.0":
            $("#led-amp").attr("src", "assets/images/orange.png");
            break;
    }
};

// $("#list").css({"border": "5px solid red"});



