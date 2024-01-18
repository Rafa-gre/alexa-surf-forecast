"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForecastData = exports.forecastDataMapper = exports.getWavesData = exports.getWeatherData = void 0;
const openmeteo_1 = require("openmeteo");
async function getWeatherData(lat, lon, interval) {
    const params = {
        latitude: lat,
        longitude: lon,
        hourly: ["temperature_2m", "precipitation_probability", "wind_speed_10m", "wind_direction_80m"],
        timezone: "auto",
        "start_date": interval.start.toISOString().slice(0, 10),
        "end_date": interval.end.toISOString().slice(0, 10),
    };
    console.log("PARAMS", params);
    try {
        const url = "https://api.open-meteo.com/v1/gfs";
        const responses = await (0, openmeteo_1.fetchWeatherApi)(url, params);
        if (responses.length === 0) {
            throw new Error("No weather data found");
        }
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        console.log("BBBBBBBBBBBBBBBBBB", hourly.interval());
        return {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), 10800).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            temperature2m: hourly.variables(0).valuesArray(),
            precipitationProbability: hourly.variables(1).valuesArray(),
            windSpeed10m: hourly.variables(2).valuesArray(),
            windDirection80m: hourly.variables(3).valuesArray(),
        };
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.getWeatherData = getWeatherData;
async function getWavesData(lat, lon, interval) {
    const params = {
        latitude: lat,
        longitude: lon,
        hourly: ["wave_height", "wave_direction", "wave_period"],
        timezone: "auto",
        models: "best_match",
        "start_date": interval.start.toISOString().slice(0, 10),
        "end_date": interval.end.toISOString().slice(0, 10),
    };
    const url = "https://marine-api.open-meteo.com/v1/marine";
    try {
        const responses = await (0, openmeteo_1.fetchWeatherApi)(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        return {
            waveHeight: hourly.variables(0).valuesArray(),
            waveDirection: hourly.variables(1).valuesArray(),
            wavePeriod: hourly.variables(2).valuesArray(),
        };
    }
    catch (error) {
        throw new Error(error);
    }
}
exports.getWavesData = getWavesData;
function processHourlyData(hourly, utcOffsetSeconds) {
    return hourly.time.map((t, i) => ({
        time: t,
        temperature: hourly.temperature2m[i],
        precipitationProbability: hourly.precipitationProbability[i],
        windSpeed: hourly.windSpeed10m[i],
        windDirection: hourly.windDirection80m[i],
        waveHeight: 0,
        waveDirection: 0,
        wavePeriod: 0,
    }));
}
function forecastDataMapper(weatherData, wavesData) {
    const processedData = processHourlyData(weatherData, 0); // 0 is a placeholder for utcOffsetSeconds
    processedData.forEach((data, i) => {
        data.waveHeight = wavesData.waveHeight[i];
        data.waveDirection = wavesData.waveDirection[i];
        data.wavePeriod = wavesData.wavePeriod[i];
    });
    return processedData;
}
exports.forecastDataMapper = forecastDataMapper;
async function getForecastData(lat, lon, interval) {
    const weatherData = await getWeatherData(lat, lon, interval);
    const wavesData = await getWavesData(lat, lon, interval);
    return forecastDataMapper(weatherData, wavesData);
}
exports.getForecastData = getForecastData;
const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
// Exemplo de uso
(async () => {
    try {
        const lat = -24.32;
        const lon = -46.9983;
        const forecastData = await getForecastData(lat, lon, {
            start: new Date(),
            end: new Date(),
        });
        console.log(forecastData);
    }
    catch (error) {
        console.error(error);
    }
})();
