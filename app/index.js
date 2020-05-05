import document from "document";
import { geolocation } from "geolocation";
import { peerSocket } from "messaging";

let coords = { latitude: 0, longitude: 0 };

let messageQueue = [];

function trySend(msg) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send(msg);
    return null;
  } else {
    return msg;
  }
}

function nonNull(msg) {
  return msg !== null;
}

function tryClearingQueue() {
  messageQueue = messageQueue.map(trySend).filter(nonNull);
}

function addMessage(msg) {
  messageQueue.push(msg);
  tryClearingQueue();
}
/*
geolocation.getCurrentPosition(function(position) {
  console.log(position.coords.latitude + ", " + position.coords.longitude);
  coords = position.coords;
  addMessage(coords);
})*/

addMessage({
  latitude: 59.325788333333335,
  longitude: 18.007841666666668,
});

peerSocket.onopen = function() {
  // Ready to send or receive messages
  tryClearingQueue();
}

// Listen for the onmessage event
peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log('App evt', JSON.stringify(evt));
  
  const averages = {
    tree: getAverage(evt.data, 'tree'),
    grass: getAverage(evt.data, 'grass'),
    weed: getAverage(evt.data, 'weed'),
  };

  if (evt.data) {
    doUi(evt.data);  
  }
}

function getAverage(arr, type) {
  return Math.round(arr.map(data => data[type]).reduce((a, b) => a + b, 0) / arr.length);
}


const valueToHumanReadable = {
  5: "High",
  4: "Med/Hi",
  3: "Medium",
  2: "Low/Med",
  1: "Low",
  0: "Min/Low",
};

const valueToColor = {
  5: "#F83C40",
  4: "#FC6B3A",
  3: "#FFD733",
  2: "#E4FA3C",
  1: "#B8FC68",
  0: "#00A629", 
};

function getImage(score) {
  return `Progress-${score}.png`;
}

function setScore(name, score) {
  const color = valueToColor[score];
  const href = getImage(score);
  const humanReadable = valueToHumanReadable[score];
  
  const progressEl = document.getElementById(`${name}-progress`);
  const descEl = document.getElementById(`${name}-desc`);
  
  console.log(`Setting ${name} and score ${score}, color ${color} is ${humanReadable} and image ${href}`);
  
  progressEl.href = href;
  descEl.text = humanReadable;
  descEl.style.fill = color;
}

/*
[{ grass: 0,
    lat: 48.13194,
    lon: 11.54944,
    time: '2020-05-07T02:00:00.000Z',
    tree: 5,
    weed: 0 }] */
const pollenLabel = document.getElementById("pollen-label");
const pollenData = document.getElementById("pollen-data");
function doUi(data) {
  const { grass, tree, weed, time } = data[0];
  
  const overallScore = Math.round((grass + tree + weed) / 3);
  
  console.log(overallScore);
  
  setScore('overall', overallScore);

  setScore('tree', tree);
  setScore('grass', grass);
  setScore('weed', weed);
}

console.log('Started');




