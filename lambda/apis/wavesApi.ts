import { fetchWeatherApi } from 'openmeteo';
import { Periodicity, TimeInterval } from './weatherApi';


export interface WavesData {
  waveHeight: Float32Array;
  waveDirection: Float32Array;
  wavePeriod: Float32Array;
}

export async function getWavesData(lat: number, lon: number, interval: TimeInterval, periodicity: Periodicity): Promise<WavesData> {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ["wave_height", "wave_direction", "wave_period"],
    daily: ["wave_height_max", "wave_direction_dominant", "wave_period_max"],
    timezone: "auto",
    models: "best_match",
    "start_date": interval.start.toISOString().slice(0, 10),
    "end_date": interval.end.toISOString().slice(0, 10),
  };

  const url = "https://marine-api.open-meteo.com/v1/marine";

  try {
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();

    if (periodicity === "daily") {
      const daily = response.daily()!;
      return {
        waveHeight: daily.variables(0)!.valuesArray()!,
        waveDirection: daily.variables(1)!.valuesArray()!,
        wavePeriod: daily.variables(2)!.valuesArray()!,
      };
    }else{
      const hourly = response.hourly()!;
      return {
        waveHeight: hourly.variables(0)!.valuesArray()!,
        waveDirection: hourly.variables(1)!.valuesArray()!,
        wavePeriod: hourly.variables(2)!.valuesArray()!,
      };
    }
  } catch(error: any) {
    throw new Error(`WAVES ERROR: ${error}`);
  }
}