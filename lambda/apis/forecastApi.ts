import { fetchWeatherApi } from 'openmeteo';

interface HourlyData {
  time: Date[];
  temperature2m: Float32Array;
  precipitationProbability: Float32Array;
  windSpeed10m: Float32Array;
  windDirection80m: Float32Array;
}

interface WavesData {
  waveHeight: Float32Array;
  waveDirection: Float32Array;
  wavePeriod: Float32Array;
}

interface ProcessedData {
  time: Date;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
}

interface TimeInterval {
  start: Date;
  end: Date;
}
export async function getWeatherData(lat: number, lon: number, interval: TimeInterval): Promise<HourlyData> {

  const params = {
    latitude: lat,
    longitude: lon,
    hourly: ["temperature_2m", "precipitation_probability", "wind_speed_10m", "wind_direction_80m"],
    timezone: "auto",
    "start_date": interval.start.toISOString().slice(0, 10),
    "end_date": interval.end.toISOString().slice(0, 10),
  };
  console.log("PARAMS",params)
try {
  const url = "https://api.open-meteo.com/v1/gfs";
  const responses = await fetchWeatherApi(url, params);

  if (responses.length === 0) {
    throw new Error("No weather data found");
  }

  const response = responses[0];
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const hourly = response.hourly()!;

  console.log("BBBBBBBBBBBBBBBBBB",hourly.interval())

  return {
    time: range(Number(hourly.time()), Number(hourly.timeEnd()), 10800).map(
			(t) => new Date((t + utcOffsetSeconds) * 1000)
		),
    temperature2m: hourly.variables(0)!.valuesArray()!,
    precipitationProbability: hourly.variables(1)!.valuesArray()!,
    windSpeed10m: hourly.variables(2)!.valuesArray()!,
    windDirection80m: hourly.variables(3)!.valuesArray()!,
  };
} catch(error: any) {
  throw new Error(error);
}
}

export async function getWavesData(lat: number, lon: number, interval: TimeInterval): Promise<WavesData> {
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
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;

    return {
      waveHeight: hourly.variables(0)!.valuesArray()!,
      waveDirection: hourly.variables(1)!.valuesArray()!,
      wavePeriod: hourly.variables(2)!.valuesArray()!,
    };
  } catch(error: any) {
    throw new Error(error);
  }
}

function processHourlyData(hourly: HourlyData, utcOffsetSeconds: number): ProcessedData[] {
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


export function forecastDataMapper(weatherData: HourlyData, wavesData: WavesData): ProcessedData[] {
  const processedData = processHourlyData(weatherData, 0); // 0 is a placeholder for utcOffsetSeconds
  processedData.forEach((data, i) => {
    data.waveHeight = wavesData.waveHeight[i];
    data.waveDirection = wavesData.waveDirection[i];
    data.wavePeriod = wavesData.wavePeriod[i];
  });
  return processedData;
}

export async function getForecastData(lat: number, lon: number, interval: TimeInterval): Promise<ProcessedData[]> {
  const weatherData = await getWeatherData(lat, lon, interval);
  const wavesData = await getWavesData(lat, lon, interval);
  return forecastDataMapper(weatherData, wavesData);
}

const range = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

// Exemplo de uso
(async () => {
  try {
    const lat = -24.32 
    const lon = -46.9983
    const forecastData = await getForecastData(lat, lon, {
      start: new Date(),
      end: new Date(),
    });
    console.log(forecastData);
  } catch (error) {
    console.error(error);
  }
})();
