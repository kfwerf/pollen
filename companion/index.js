import { peerSocket } from "messaging";
import { getPollenStats } from "./api";

peerSocket.onopen = function() {
  // Ready to send or receive messages
}

// Listen for the onmessage event
peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(evt.data);
  if (evt.data.latitude && evt.data.longitude) {
    const { latitude, longitude } = evt.data;
    const pollenResponse = getPollenStats(latitude, longitude).then(function(pollenData) {
      peerSocket.send(pollenData);
    })
    
  }
}
