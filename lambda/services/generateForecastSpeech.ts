import { getForecastData } from "../apis/forecastApi";
import { getCoordinates } from "../apis/geocodingApi";
import { openAiApi } from "../apis/openAiApi";
import { calculateDateRange } from "./handleDates";


export async function generateForecastSpeech(period: string, local: string): Promise<string | null> {
const dateRange = calculateDateRange(period);
const {latitude, longitude} = await getCoordinates(local);
const forecastData = await getForecastData(latitude, longitude, dateRange);

const speech = await openAiApi(JSON.stringify(forecastData));

return speech
}