import axios from "axios";

// ── API Keys ─────────────────────────────
const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;
const NEWS_KEY = import.meta.env.VITE_NEWS_KEY;
const MOVIE_KEY = import.meta.env.VITE_MOVIE_KEY;

// ── DEBUG CHECK (VERY IMPORTANT) ─────────
if (!WEATHER_KEY || !NEWS_KEY || !MOVIE_KEY) {
  console.error("❌ Missing API keys in .env file");
}

// ── Axios Clients ────────────────────────
const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

const newsClient = axios.create({
  baseURL: "https://newsapi.org/v2",
});

const movieClient = axios.create({
  baseURL: "https://www.omdbapi.com",
});

// ── WEATHER ──────────────────────────────
export const fetchWeatherByCity = async (city = "Chennai") => {
  const { data } = await weatherClient.get("/weather", {
    params: {
      q: city,
      units: "metric",
      appid: WEATHER_KEY,
    },
  });

  return data;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const { data } = await weatherClient.get("/weather", {
    params: {
      lat,
      lon,
      units: "metric",
      appid: WEATHER_KEY,
    },
  });

  return data;
};

// ── NEWS ────────────────────────────────
export const fetchTopHeadlines = async () => {
  const { data } = await newsClient.get("/top-headlines", {
    params: {
      country: "in",
      language: "en",
      apiKey: NEWS_KEY,
    },
  });

  return data.articles || [];
};

// ── MOVIES (FIXED) ──────────────────────
// OMDB doesn't support real genres → keyword mapping
const genreKeywords = {
  Action: "avengers",
  Comedy: "funny",
  Horror: "ghost",
  Romance: "love",
  Thriller: "killer",
  Drama: "life",
};

export const searchMoviesByGenre = async (genre) => {
  const query = genreKeywords[genre] || genre;

  const { data } = await movieClient.get("/", {
    params: {
      s: query,
      type: "movie",
      apikey: MOVIE_KEY,
    },
  });

  return data.Search || [];
};

// ── MOVIE DETAILS ───────────────────────
export const fetchMovieDetails = async (imdbID) => {
  const { data } = await movieClient.get("/", {
    params: {
      i: imdbID,
      plot: "full",
      apikey: MOVIE_KEY,
    },
  });

  return data;
};