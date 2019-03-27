const updateValue = (id, value) => {
  if (value) {
    document.getElementById(id).innerHTML = value;
  }
};

const setImage = (weatherDescription) => {
  document.getElementById('weatherImage').src = `assets/images/${weatherDescription}.png`;
};

const updateCurrentWeather = (weatherData) => {
  console.log('weatherData', weatherData);
  if (weatherData) {
    setImage(weatherData.description);
    updateValue('currentDescription', weatherData.description);
    updateValue('currentTempLow', weatherData.temperatureLow);
    updateValue('currentTempHigh', weatherData.temperatureHigh && `- ${weatherData.temperatureHigh}`);
    updateValue('currentWindLow', weatherData.windLow);
    updateValue('currentWindHigh', weatherData.windHigh && `- ${weatherData.windHigh}`);
  }
};

const getWeatherData = (city = 'Bielsko-biała') => {
  return fetch(`https://pogodynka.ml/${encodeURI(city)}`)
    .then(response => response.json());
};


getWeatherData()
  .then(weatherData => updateCurrentWeather(weatherData.now));
