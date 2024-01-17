import axios from 'axios';

const apiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

export type Coordinates = {
  latitude: number;
  longitude: number;
};


export async function getCoordinates(place:string): Promise<Coordinates> {
  try{
    const response = await axios.get(apiUrl, {
      params: {
        name: place,
        count:1,
        language: 'pt',
      }
    });
    if (response.data.results.length < 1) {
      throw new Error('Place not found');
    }
    return {
      latitude: response.data.results[0].latitude,
      longitude: response.data.results[0].longitude
    }
  } catch(error:any){
    throw new Error(error);
  }
  
} 


