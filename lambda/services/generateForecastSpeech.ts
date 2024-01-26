import { getCoordinates } from "../apis/geocodingApi";
import { openAiApi } from "../apis/openAiApi";
import { Periodicity } from "../apis/weatherApi";
import { getForecastData } from "./forecastData";
import { calculateDateRange } from "./handleDates";


export async function generateForecastSpeech(period: string, local: string, periodicity: Periodicity): Promise<string | null> {
  try{
    const dateRange = calculateDateRange(period);
    
    const {latitude, longitude} = await getCoordinates(local);
    const forecastData = await getForecastData(latitude, longitude, dateRange, periodicity);
    
    const speech = await openAiApi(JSON.stringify(forecastData));

    return speech
  }catch(error:any){
throw new Error(error)
  }
 
}