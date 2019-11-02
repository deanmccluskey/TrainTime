
// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC6esYDjPNVNTKjpK6P-IUSWer3L2SZchA",
    authDomain: "traintime-3adcf.firebaseapp.com",
    databaseURL: "https://traintime-3adcf.firebaseio.com",
    projectId: "traintime-3adcf",
    storageBucket: "traintime-3adcf.appspot.com",
    messagingSenderId: "786829153702",
    appId: "1:786829153702:web:c777998635ae93ce10eb67",
    measurementId: "G-TEJQNEJ3R5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize local database to download Firebase
var database = firebase.database();

// Initialize values
var trainName = "";
var trainDest = "";
var trainFirst = "";
var trainFreq = 0;

// Capture train info
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grab user input
    trainName = $("#train-name-input").val().trim();
    trainDest = $("#train-dest-input").val().trim();
    //    trainFirst = moment($("#train-first-input").val().trim(), "HH:mm");
    trainFirst = $("#train-first-input").val().trim();
    trainFreq = $("#train-freq-input").val().trim();

    // Validate user input
    if (!moment(trainFirst, "HH:mm", true).isValid()) {
        $("#train-first-input").val("Please enter a valid 24-hour time! ('HH:mm')");
    }
    // else if (trainFreq < 10 || trainFreq > (12 * 60)) {
    //     $("#train-freq-input").val("Please enter number of minutes! (10-720)");
    // }
    else {
        // Create local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            dest: trainDest,
            first: trainFirst,
            freq: trainFreq
        };

        // Upload train data to the database
        database.ref().push(newTrain);
        // Log database to console
        console.log("database");
        console.log("newTrain.name - " + newTrain.name);
        console.log("newTrain.dest - " + newTrain.dest);
        console.log("newTrain.first - " + newTrain.first);
        console.log("newTrain.freq - " + newTrain.freq);

        // Clear all text-boxes
        $("#train-name-input").val("");
        $("#train-dest-input").val("");
        $("#train-first-input").val("");
        $("#train-freq-input").val("");
    }
});

// Create Firebase event for adding train to database, and row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDest = childSnapshot.val().dest;
    var tFirst = childSnapshot.val().first;
    var tFreq = childSnapshot.val().freq;
    // Log childSnapshot to console
    console.log("childSnapshot");
    console.log("tName - " + tName);
    console.log("tDest - " + tDest);
    console.log("tFirst - " + tFirst);
    console.log("tFreq - " + tFreq);

    // Calculate minutes until next train
    // First train time (pushed back 1 day to insure it's before current time)
    var tFirstConv = moment(tFirst, "minutes").subtract(1, "days");
    // Difference between first train and now
    var tDiff = moment().diff(moment(tFirstConv), "minutes");
    // Time apart (remainder)
    var tRemain = tDiff % tFreq;
    // Minutes until next train
    var tMins = tFreq - tRemain;
    // Next train time
    var tNext = moment().add(tMins, "minutes");
    // Log train calculation
    console.log("calculation");
    console.log("tFirstConv - " + tFirstConv);
    console.log("tDiff - " + tDiff);
    console.log("tRemain - " + tRemain);
    console.log("tMins - " + tMins);
    console.log("tNext - " + tNext);

    // Prettify next train
    var tNextPretty = moment(tNext).format("LT");

    // Create new table row
    var newRow = $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDest),
        $("<td>").text(tFreq),
        // $("<td>").text(tNext),
        $("<td>").text(tNextPretty),
        $("<td>").text(tMins),
    );

    // Append new row to the table
    $("#train-table > tbody").append(newRow);

    // Handle errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

});
