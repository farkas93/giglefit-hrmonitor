let document = require("document");
import { HeartRateSensor } from "heart-rate";
import * as messaging from "messaging";


// Sensor Constants
const const_batch = 2;


// Fetch UI elements we will need to change
let hrLabel = document.getElementById("hrm");
// let updatedLabel = document.getElementById("updated");

// Keep a timestamp of the last reading received. Start when the app is started.
let lastValueTimestamp = Date.now();
let deltaTimeMS = 0;

// Initialize the UI with some values
hrLabel.text = "--";
// updatedLabel.text = "...";

// This function takes a number of milliseconds and returns a string
// such as "5min ago".
function convertMsAgoToString(millisecondsAgo) {
  if (millisecondsAgo < 120*1000) {
    return Math.round(millisecondsAgo / 1000) + "s ago";
  }
  else if (millisecondsAgo < 60*60*1000) {
    return Math.round(millisecondsAgo / (60*1000)) + "min ago";
  }
  else {
    return Math.round(millisecondsAgo / (60*60*1000)) + "h ago"
  }
}

// // This function updates the label on the display that shows when data was last updated.
// function updateDisplay() {
//   if (lastValueTimestamp !== undefined) {
//     updatedLabel.text = convertMsAgoToString(Date.now() - lastValueTimestamp);
//   }
// }

// This function will send data to the companion
function sendMessage(hrData) {
  // Sample data
  // let data = {
  //   timestamp: hrData.timestamp[1],
  //   heartrate: hrData.heartRate[1]
  // }

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(hrData);
  }
}


// Create a new instance of the HeartRateSensor object
var hrm = new HeartRateSensor({ batch: const_batch });

// Declare an event handler that will be called every time a new HR value is received.
// hrm.onreading = function() {
//   // Peek the current sensor values
//   deltaTimeMS =  Date.now() - lastValueTimestamp;
//   lastValueTimestamp = Date.now();
//   console.log("deltaTimeMS: " + deltaTimeMS + " Current time: " + lastValueTimestamp + " Current heart rate: " + hrm.heartRate);
//   hrLabel.text = hrm.heartRate;
// }

hrm.addEventListener("reading", () => {
  var hearRateAr = [];
  for (let index = 0; index < hrm.readings.timestamp.length; index++) {
    hearRateAr.push(hrm.readings.heartRate[index]);
    // data = {...data, "measurement"[Date.now()] : {"hrData":hrm.readings.heartRate[index]}};
    
    // console.log(
    //   `HeartRateSensor Reading: \
    //     timestamp=${hrm.readings.timestamp[index]}, \
    //     [${hrm.readings.heartRate[index]}]`
    // );    
  }
  // var data = `{timestamp : {$data : ${hrm.readings.timestamp[0]}},hrData:[${hearRateAr}]}`;
  var data = {"timestamp" : {"$data" : hrm.readings.timestamp[0]},"hrData":hearRateAr};
  // console.log(data);
  sendMessage(data);

  // Update HeartRate on watch
  hrLabel.text = hrm.readings.heartRate[0];
});

// Open Socket to Companion
messaging.peerSocket.addEventListener("open", (evt) => {
  console.log("Ready to send or receive messages");
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});


// And update the display every second
// setInterval(updateDisplay, 10000);

// Check if Companion is Connected:
if(messaging.peerSocket.readyState === messaging.peerSocket.CLOSED){
  console.log(`Waiting for App to connect to companion!`);
  while(messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
  }
  console.log(`App connected to companion!`);
}

// Begin monitoring the sensor
console.log(`Start Monitoring!`);
hrm.start();
