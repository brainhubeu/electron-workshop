const storage = require('electron-json-storage');
require('isomorphic-fetch');

const getWeatherData = (city = 'Bielsko-biała') => {
  return fetch(`https://pogodynka.ml/${encodeURI(city)}`)
    .then(response=> response.json())
    .then(weatherData => {
      storage.set('weatherData', weatherData);
      return weatherData;
    })
    .catch(() => {
      return new Promise((resolve, reject) => storage.get('weatherData', (error, data) => {
        error ? reject(error) : resolve(data);
      }));
    });
};

module.exports = getWeatherData;
