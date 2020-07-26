import { settingsStorage } from "settings";

const givenKey = '';
const customKey = settingsStorage.getItem("apiKey") || givenKey;


const getAverage = (arr, type) =>
  Math.round(arr.map(data => data[type]).reduce((a, b) => a + b, 0) / arr.length);

export const getAverageData = (normalizedData) => {
  const averageData = {
    tree: getAverage(normalizedData, 'tree'),
    grass: getAverage(normalizedData, 'grass'),
    weed: getAverage(normalizedData, 'weed'),
  };
  const { grass, tree, weed } = averageData;
  return { 
    ...averageData,
    overall: Math.round((grass + tree + weed) / 3),
  };
}

const getNormalizedData = (response) => {
  return response
  .map(entry => ({
    lat: entry.lat,
    lon: entry.lon,
    time: entry.observation_time.value,
    grass: entry.pollen_grass.value,
    tree: entry.pollen_tree.value,
    weed: entry.pollen_weed.value,
  }));
}

const getJSON = (response) => response.json();

export const getPollenStats = (lat, long) => {
  const endTime = new Date();
  endTime.setUTCSeconds(60 * 60 * 12); // 24 hours for now
  const url = `https://api.climacell.co/v3/weather/forecast/hourly?lat=${lat}&lon=${long}&unit_system=si&start_time=now&end_time=${endTime.toISOString()}&fields=pollen_weed%2Cpollen_tree%2Cpollen_grass&apikey=${customKey}`;
  console.log(url);
  return fetch(url)
    .then(getJSON)
    .then(getNormalizedData)
    .catch((error) => {
      console.log('error', error);
    });
};
