import document from "document";
import { geolocation } from "geolocation";
import { peerSocket } from "messaging";
import { MessageQueue } from "../common";
import { doUI, setLoader } from "./ui";
import * as fs from "fs";

const messageQueue = new MessageQueue(peerSocket);
const fileName = "coords.json";

const getAndPersistCoordinates = (fn) => {
  geolocation.getCurrentPosition((position) => {
    fs.writeFileSync("coords.json", JSON.stringify(position.coords), "json");
    fn(position.coords);
  });
};

const fetchPollenDataViaCompanion = (coords) => {
  console.log(coords.latitude + ", " + coords.longitude);
  messageQueue.queueMessage(coords);
};

if (fs.existsSync(fileName)) {
  const cachedCoords = fs.readFileSync(fileName, "json");
  console.log(cachedCoords);
  fetchPollenDataViaCompanion(JSON.parse(cachedCoords));
} else {
  setLoader(true);
  getAndPersistCoordinates(fetchPollenDataViaCompanion);
}

messageQueue.on('message', (evt) => {
  doUI(evt.data);
});

console.log('Started');

const locationBtn = document.getElementById("location-btn");
locationBtn.onclick = function(evt) {
  setLoader(true);
  getAndPersistCoordinates(fetchPollenDataViaCompanion);
}
