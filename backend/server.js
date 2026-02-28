const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "efbf0af813fafdc47036419ca1ba0ed8";

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric"
        }
      }
    );

    res.json({
      city: response.data.name,
      temp: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      clouds: response.data.clouds.all,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});