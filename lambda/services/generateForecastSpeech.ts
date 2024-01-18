import { getForecastData } from "../apis/forecastApi";
import { getCoordinates } from "../apis/geocodingApi";
import { openAiApi } from "../apis/openAiApi";
import { calculateDateRange } from "./handleDates";


export async function generateForecastSpeech(period: string, local: string): Promise<string | null> {
const dateRange = calculateDateRange(period);
const {latitude, longitude} = await getCoordinates(local);
const forecastData = await getForecastData(latitude, longitude, dateRange);

const speech = await openAiApi(JSON.stringify(forecastData));

console.log("DATE RANGE",dateRange);

console.log("LAT LONG",latitude,longitude);

console.log("FORECAST DATA",forecastData);

console.log("SPEECH",speech);

return speech
}