// Initialize Firebase
//  web app's Firebase configuration
var config = {
  apiKey: "AIzaSyAP7Bk77jOjD3CubWFZGJ5r7FZHXAKw48U",
  authDomain: "train-time-ded06.firebaseapp.com",
  databaseURL: "https://train-time-ded06.firebaseio.com",
  projectId: "train-time-ded06",
  messagingSenderId: "998836067969",
  appId: "1:998836067969:web:bd1de62c31d31ce768f780",
};
  // Initialize Firebase
  firebase.initializeApp(config);

var trainData = firebase.database();

$("#add-train-btn").on("click", function(event) {
// prevents degault form submit behavior
    event.preventDefault();

// users input 

var tNameInput = $("#train-name-input")
.val()
.trim();

var tDestinationInput = $("#destination-input")
.val()
.trim();

var firstTrainInput = $("#first-train-input")
.val()
.trim();

var tFrequencyInput = $("#frequency-input")
.val()
.trim();

// temporary train data holding

var tempTrain = {
   name: tNameInput,
   destination: tDestinationInput,
   firstTrain: firstTrainInput,
   frequency: tFrequencyInput
};

// uploads train data to the database
trainData.ref().push(tempTrain);

console.log(tempTrain.name);
console.log(tempTrain.destination);
console.log(tempTrain.firstTrain);
console.log(tempTrain.frequency);

// Alert
alert("Good Job! The Train has been ADDED!");

// clears the text-boxes
$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#frequency-input").val("");

});

// Firebase event 

trainData.ref().on("child_added", function(childSnapshot, prevChildKey){
    console.log(childSnapshot.val());

    // stored into variables
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFirstTrain = childSnapshot.val().firstTrain;
    var tFrequency = childSnapshot.val().frequency;

    var timeArrival = tFirstTrain.split(":");
    var trainTime = moment()
    .hours(timeArrival[0])
    .minutes(timeArrival[1]);

    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(),"minutes");
    }else {
        var intervalTimes = moment().diff(trainTime, "minutes");
        var tRemainder = intervalTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
// calculating arrival time and add tMinutes to current time
        tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);


    // train's data into the table
  $("#train-table > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDestination),
      $("<td>").text(tFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );

});