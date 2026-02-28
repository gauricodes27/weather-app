import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaGithub, FaSearch } from "react-icons/fa";

const API_KEY = "efbf0af813fafdc47036419ca1ba0ed8";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showWeather, setShowWeather] = useState(false);

  // Fetch suggestions while typing
  const handleChange = async (value) => {
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );
      setSuggestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch weather
  const getWeather = async () => {
    if (!city) return;

    try {
      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const weekly = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      const dailyData = weekly.data.list.filter((_, i) => i % 8 === 0);

      setWeather(current.data);
      setForecast(dailyData);
      setShowWeather(true);
      setSuggestions([]);
    } catch (err) {
      alert("City not found");
    }
  };

  return (
    <div className="app">
      <div className="card">

        {/* HEADER */}
        <div className="header">
          <div className="logo">
            <h1>The Weather</h1>
            <span>Forecasting</span>
          </div>
          <div className="date">{new Date().toUTCString()}</div>
          <FaGithub className="github" />
        </div>

        {/* SEARCH SECTION */}
        <div className="search-container">
          <input
            value={city}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search for cities"
            className="search"
          />
          <button className="search-btn" onClick={getWeather}>
            <FaSearch />
          </button>

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setCity(`${s.name}, ${s.country}`);
                    setSuggestions([]);
                  }}
                >
                  {s.name}, {s.state ? s.state + "," : ""} {s.country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FIRST PAGE (Moon screen) */}
        {!showWeather && (
          <div className="empty">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1163/1163624.png"
              alt="moon"
            />
            <p>
              Explore current weather data and 6-day forecast of more than
              200,000 cities!
            </p>
          </div>
        )}

        {/* FINAL WEATHER PAGE */}
        {showWeather && weather && (
          <div className="content">

            {/* LEFT */}
            <div className="left">
              <h3>CURRENT WEATHER</h3>

              <div className="current">
                <div>
                  <h2>
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p>{new Date().toDateString()}</p>
                </div>

                <div className="temp">
                  <h1>{Math.round(weather.main.temp)}°C</h1>
                  <p>{weather.weather[0].description}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="icon"
                  />
                </div>
              </div>

              <h3>AIR CONDITIONS</h3>
              <div className="conditions">
                <div>
                  <p>Real Feel</p>
                  <h4>{Math.round(weather.main.feels_like)}°C</h4>
                </div>
                <div>
                  <p>Wind</p>
                  <h4>{weather.wind.speed} m/s</h4>
                </div>
                <div>
                  <p>Clouds</p>
                  <h4>{weather.clouds.all}%</h4>
                </div>
                <div>
                  <p>Humidity</p>
                  <h4>{weather.main.humidity}%</h4>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="right">
              <h3>WEEKLY FORECAST</h3>

              {forecast.map((day, i) => (
                <div className="week-card" key={i}>
                  <div>
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </div>
                  <div>{Math.round(day.main.temp)}°C</div>
                  <div>{day.wind.speed} m/s</div>
                  <div>{day.main.humidity}%</div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;