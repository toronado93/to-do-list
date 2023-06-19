const axios = require("axios");

const fetchWeatherInfo = async () => {
  const city = "Bournemouth";
  const apiKey = process.env.apiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const responde = await axios.get(url);

    const open_obj = {
      city_name: responde.data.name,
      temp: responde.data.main.temp,
      icon_url: `https://openweathermap.org/img/wn/${responde.data.weather[0].icon}@2x.png`,
    };

    return open_obj;
  } catch (error) {
    console.log(error);
  }
};

module.exports.fetchWeatherInfo = fetchWeatherInfo;
