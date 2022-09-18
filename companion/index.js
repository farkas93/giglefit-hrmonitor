import * as messaging from "messaging";

// Websocket Const
const wsUri = "wss://gigle-websocket.azurewebsites.net/echo";
const websocket = new WebSocket(wsUri);


//////////////////////////////////////////////
// Open Socket to app
messaging.peerSocket.addEventListener("open", (evt) => {
  console.log("Ready to send or receive messages");
});

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

messaging.peerSocket.addEventListener("message", (evt) => {

  // for (let index = 0; index < evt.data.timestamp.length; index++) {
  //   console.log(
  //     `HeartRateSensor Reading: \
  //       timestamp=${evt.data.timestamp[index]}, \
  //       [${evt.data.heartRate[index]}]`
  //   );
  // }
  console.log("Received dataset from app!");
  // console.log(JSON.stringify(evt.data));
  if(websocket.readyState !== websocket.OPEN){
    console.log(`Waiting for companion to connect to Azure!`);
    while(websocket.readyState !== websocket.OPEN) {
    }
  }
  console.log(`Companion connected to Azure!`);
  websocket.send(JSON.stringify(evt.data));

});



//////////////////////////////////////////////
// Websocket
websocket.addEventListener("open", wssOnOpen);
websocket.addEventListener("close", wssOnClose);
websocket.addEventListener("message", wssOnMessage);
websocket.addEventListener("error", wssOnError);

function wssOnOpen(evt) {
   console.log("CONNECTED");
}

function wssOnClose(evt) {
   console.log("DISCONNECTED");
}

function wssOnMessage(evt) {
   console.log(`MESSAGE RECEIVED FROM AZURE: ${evt.data}`);
   console.log(JSON.stringify(evt.data));
}

function wssOnError(evt) {
   console.error(`ERROR: ${evt.data}`);
}
