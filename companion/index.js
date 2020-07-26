import { peerSocket } from "messaging";
import { getPollenStats, getAverageData } from "./api";
import { MessageQueue, valueToHumanReadable, getImage, valueToColor } from "../common";

const messageQueue = new MessageQueue(peerSocket);

const getDecoratedScore = (score) => {
  const color = valueToColor[score];
  const href = getImage(score);
  const humanReadable = valueToHumanReadable[score];
  return {
    color,
    href,
    humanReadable,
  }
}

const getDecoratedScores = (averageData) => {
  return Object.keys(averageData)
    .map((key) => ({
      [key]: getDecoratedScore(averageData[key]),
    }))
    .reduce((a,b) => ({ ...a, ...b }), {});
};

messageQueue.on('message', (evt) => {
  // Output the message to the console
  console.log(evt.data);
  if (evt.data.latitude && evt.data.longitude) {
    const { latitude, longitude } = evt.data;
    const pollenResponse = getPollenStats(latitude, longitude)
      .then(getAverageData)
      .then(getDecoratedScores)
      .then((decoratedData) => {
        messageQueue.queueMessage(decoratedData);
      });
  }
});
