import { getCoordinates } from "../apis/geocodingApi.ts";
import { openAiApi } from "../apis/openAiApi.ts";
import { Periodicity } from "../apis/weatherApi.ts";
import { getForecastData } from "./forecastData.ts";
import { calculateDateRange } from "./handleDates.ts";


export async function generateForecastSpeech(period: string, local: string, periodicity: Periodicity): Promise<string | null> {
  try{
    const dateRange = calculateDateRange(period);
    
    const {latitude, longitude} = await getCoordinates(local);
    const forecastData = await getForecastData(latitude, longitude, dateRange, periodicity);
    
    const speech = await openAiApi(JSON.stringify(forecastData));
console.log("AQUI 5")
    return speech
  }catch(error:any){
throw new Error(error)
  }
 
}