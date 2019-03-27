/* global fetch */
const storage = require('electron-json-storage');

const getWeatherData = async (city = 'Bielsko-biała') => {
  try {
    const response = await fetch(
      `https://wttr.pluszczewski.pl/${encodeURI(city)}`,
    );
    const data = await response.json();

    storage.set('weatherData', data);

    return data;
  } catch (err) {
    const getStorageData = new Promise((resolve, reject) => storage.get('weatherData', (error, data) => {
      if (error) {
        reject(error);
      }
      resolve(data);
    }));

    return getStorageData;
  }
};

module.exports = getWeatherData;
