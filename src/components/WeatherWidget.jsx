import { useEffect, useState } from "react";
import { fetchWeatherByCoords, fetchWeatherByCity } from "../services/apiServices";
import styles from "../widgets/WeatherWidget.module.css";

const ICON_URL = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

export function WeatherWidget() {
  const [data,    setData]    = useState(null);
  const [city,    setCity]    = useState("Chennai");
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = async (fetchFn) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn();
      setData(res);
      setCity(res.name);
    } catch {
      setError("Could not fetch weather. Check your API key or city name.");
    } finally {
      setLoading(false);
    }
  };

  // Try geolocation on mount, fall back to Chennai
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => load(() => fetchWeatherByCoords(coords.latitude, coords.longitude)),
        ()           => load(() => fetchWeatherByCity("Chennai"))
      );
    } else {
      load(() => fetchWeatherByCity("Chennai"));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      load(() => fetchWeatherByCity(input.trim()));
      setInput("");
    }
  };

  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>🌤 Weather</h3>

      <form onSubmit={handleSearch} className={styles.search}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city…"
        />
        <button type="submit">Go</button>
      </form>

      {loading && <p className={styles.state}>Loading…</p>}
      {error   && <p className={styles.error}>{error}</p>}

      {data && !loading && (
        <div className={styles.body}>
          <div className={styles.main}>
            <img src={ICON_URL(data.weather[0].icon)} alt={data.weather[0].description} />
            <div>
              <p className={styles.temp}>{Math.round(data.main.temp)}°C</p>
              <p className={styles.desc}>{data.weather[0].description}</p>
              <p className={styles.cityName}>{city}, {data.sys.country}</p>
            </div>
          </div>
          <div className={styles.stats}>
            <Stat label="Humidity"  value={`${data.main.humidity}%`} />
            <Stat label="Pressure"  value={`${data.main.pressure} hPa`} />
            <Stat label="Wind"      value={`${data.wind.speed} m/s`} />
            <Stat label="Feels Like" value={`${Math.round(data.main.feels_like)}°C`} />
          </div>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className={styles.stat}>
    <span className={styles.statVal}>{value}</span>
    <span className={styles.statLbl}>{label}</span>
  </div>
);

export default WeatherWidget;
