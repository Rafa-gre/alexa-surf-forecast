import { format } from "date-fns";
import { WavesData, getWavesData } from "../apis/wavesApi";
import { Periodicity, TimeInterval, WeatherData, getWeatherData } from "../apis/weatherApi";
import { ptBR } from "date-fns/locale";
import { utcToZonedTime } from "date-fns-tz";

interface ProcessedData {
  time: Date;
  weekDay: string;
  temperature: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  waveDirection: string;
  wavePeriod: number;
}

function processWeatherData(data: WeatherData , utcOffsetSeconds: number): ProcessedData[] {
  return data.time.map((t, i) => ({
    time: t,
    weekDay: format(utcToZonedTime(t, "UTC"), "EEEE", {locale: ptBR}),
    temperature: data.temperature2m[i],
    precipitationProbability: data.precipitationProbability[i],
    windSpeed: data.windSpeed10m[i],
    windDirection: degreesToCardinal(data.windDirection10m[i]),
    waveHeight: 0, 
    waveDirection: '', 
    wavePeriod: 0, 
  }));
}


export function forecastDataMapper(weatherData: WeatherData, wavesData: WavesData): ProcessedData[] {
  const processedData = processWeatherData(weatherData, 0); // 0 is a placeholder for utcOffsetSeconds
  processedData.forEach((data, i) => {
    data.waveHeight = wavesData.waveHeight[i];
    data.waveDirection = degreesToCardinal(wavesData.waveDirection[i]);
    data.wavePeriod = wavesData.wavePeriod[i];
  });
  return processedData;
}

export async function getForecastData(lat: number, lon: number, interval: TimeInterval, periodicity: Periodicity): Promise<ProcessedData[]> {
  console.log("ENTRADA", periodicity)
  const weatherData = await getWeatherData(lat, lon, interval, periodicity);
  const wavesData = await getWavesData(lat, lon, interval, periodicity);
  console.log("SAIDA", forecastDataMapper(weatherData, wavesData))
  return forecastDataMapper(weatherData, wavesData);
}

function degreesToCardinal(degrees: number): string {
  const cardinalPoints = ['Norte', 'Norte-Nordeste', 'Nordeste', 'Leste-Nordeste', 'Leste', 'Leste-Sudeste', 'Sudeste', 'Sul-Sudeste', 'Sul', 'Sul-Sudoeste', 'Sudoeste', 'Oeste-Sudoeste', 'Oeste', 'Oeste-Noroeste', 'Noroeste', 'Norte-Noroeste', 'Norte'];

  const adjustedDegrees = (degrees + 360) % 360;

  const index = Math.round(adjustedDegrees / 22.5);

  return cardinalPoints[index];
}


