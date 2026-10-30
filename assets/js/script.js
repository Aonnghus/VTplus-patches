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
    $("#list").on("click", ".patch-index", function() {
        var selectedIndex = parseInt($(this).data("index"));
        settings = arrayJSON[selectedIndex];
        console.log(settings);
        applySettings(settings, maxWatts);
    });
});

// Some patches were recovered without their settings: those fields are all null.
function hasSettings(settings) {
    return settings["Amp style"] !== null;
}

function applySettings(settings, maxWatts) {
    $("#patch-name").text(settings["Name"]);
    $("#patch-description").text(settings["Description"] || "");

    if (!hasSettings(settings)) {
        // Return the knobs and LED to their rest position rather than reading nulls as zero.
        $(".knob").css({"transform": ""});
        $("#led-amp").attr("src", "assets/images/green.png");
        $(".panel, .overlay").addClass("no-settings");
        $("#patch-note").text("The settings for this patch were not recovered.");
        return;
    }
    $(".panel, .overlay").removeClass("no-settings");
    $("#patch-note").text("");

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

    switch(parseInt(settings["Red-Green"])) {
        case 1:
            $("#led-amp").attr("src", "assets/images/green.png");
            break;
        case 2:
            $("#led-amp").attr("src", "assets/images/red.png");
            break;
        case 3:
            $("#led-amp").attr("src", "assets/images/orange.png");
            break;
    }
};

// $("#list").css({"border": "5px solid red"});



