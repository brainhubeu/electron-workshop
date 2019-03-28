/* global document */
const { ipcRenderer } = require('electron');
const getWeatherData = require('./weather');

const updateValue = (id, value) => {
  if (value) {
    document.getElementById(id).innerHTML = value;
  }
};

const setImage = (weatherDescription) => {
  document.getElementById('weatherImage').src = `assets/images/${weatherDescription}.png`;
};

const updateCurrentWeather = (weatherData) => {
  if (weatherData) {
    setImage(weatherData.description);
    updateValue('currentDescription', weatherData.description);
    updateValue('currentTempLow', weatherData.temperatureLow);
    updateValue('currentTempHigh', weatherData.temperatureHigh && `- ${weatherData.temperatureHigh}`);
    updateValue('currentWindLow', weatherData.windLow);
    updateValue('currentWindHigh', weatherData.windHigh && `- ${weatherData.windHigh}`);
  }
};

const saveToJson = async () => {
  try {
    const data = await getWeatherData();
    updateCurrentWeather(data.now);
    ipcRenderer.send('save-to-json', data);
  } catch (error) {
    console.error(error);
  }
};


getWeatherData()
  .then(weatherData => {
    updateCurrentWeather(weatherData.now);
    document.getElementById('saveToJsonBtn').addEventListener('click', saveToJson);
    ipcRenderer.on('save-to-json-shortcut', saveToJson);
  });

