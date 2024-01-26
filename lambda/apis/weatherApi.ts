import { fetchWeatherApi } from 'openmeteo';
export interface WeatherData {
  time: Date[];
  temperature2m: Float32Array;
  precipitationProbability: Float32Array;
  windSpeed10m: Float32Array;
  windDirection10m: Float32Array;
}

export interface TimeInterval {
  start: Date;
  end: Date;
}

export type Periodicity = "hourly" | "daily" 

export const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

export async function getWeatherData(lat: number, lon: number, interval: TimeInterval, periodicity: Periodicity): Promise<WeatherData> {

  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ["temperature_2m", "precipitation_probability", "wind_speed_10m", "wind_direction_10m"],
    daily: ["temperature_2m_max", "precipitation_probability_max", "wind_speed_10m_max", "wind_direction_10m_dominant"],
    "wind_speed_unit": "kn",
    timezone: "auto",
    "start_date": interval.start.toISOString().slice(0, 10),
    "end_date": interval.end.toISOString().slice(0, 10),
  };
try {
  const url = "https://api.open-meteo.com/v1/gfs";
  const responses = await fetchWeatherApi(url, params);

  if (responses.length === 0) {
    throw new Error("No weather data found");
  }

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();

  if (periodicity === "daily") {
    const daily = response.daily()!;
    return {
      time: range(Number(daily.time()), Number(daily.timeEnd()), 86400).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      temperature2m: daily.variables(0)!.valuesArray()!,
      precipitationProbability: daily.variables(1)!.valuesArray()!,
      windSpeed10m: daily.variables(2)!.valuesArray()!,
      windDirection10m: daily.variables(3)!.valuesArray()!,
    };
    
  } else  {
    const hourly = response.hourly()!;
    return {
      time: range(Number(hourly.time()), Number(hourly.timeEnd()), 10800).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      ),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      precipitationProbability: hourly.variables(1)!.valuesArray()!,
      windSpeed10m: hourly.variables(2)!.valuesArray()!,
      windDirection10m: hourly.variables(3)!.valuesArray()!,
    };
  }
} catch(error: any) {
  throw new Error(`WEATHER ERROR: ${error}`);
}
}