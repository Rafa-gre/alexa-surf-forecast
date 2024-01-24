import { getCoordinates } from "../apis/geocodingApi";
import { openAiApi } from "../apis/openAiApi";
import { Periodicity } from "../apis/weatherApi";
import { getForecastData } from "./forecastData";
import { calculateDateRange } from "./handleDates";


export async function generateForecastSpeech(period: string, local: string, periodicity: Periodicity): Promise<string | null> {
  try{
    console.log("11111111111111111111111111",periodicity)
    const dateRange = calculateDateRange(period);
    console.log("2222222222222222222222222", dateRange)
    
    const {latitude, longitude} = await getCoordinates(local);
    console.log("AQUIIIIIIIIIII")
    const forecastData = await getForecastData(latitude, longitude, dateRange, periodicity);
    console.log("FORECAST DATA", forecastData)
    
    const speech = await openAiApi(JSON.stringify(forecastData));
    
    console.log("DATE RANGE",dateRange);
    
    console.log("LAT LONG",latitude,longitude);
    
    console.log("FORECAST DATA",forecastData);
    
    console.log("SPEECH",speech);
    
    return speech
  }catch(error:any){
throw new Error(error)
  }
 
}