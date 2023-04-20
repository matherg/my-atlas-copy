import axios from 'axios';
import { HealthValue } from 'react-native-health';
import { dateDifferenceInMilliSeconds, retrieveHealthKitData } from './healthKitService';
import { IRestingHeartRate, IRestingHeartRateDTO } from '../../interfaces/IRestingHeartRate';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';

export const addRestingHeartRateLocal = async (userId: string) => {
  try{
    const today: Date = new Date();
    today.setHours(0,0,0,0)
    const restHeartRates : Array<HealthValue> = await retrieveHealthKitData("getRestingHeartRateSamples", today, new Date());
    const restHeartRateDTOs : Array<IRestingHeartRateDTO>= convertRestingHeartRate(userId, restHeartRates);
    if (restHeartRateDTOs.length > 0){
      const restingHeartRate = restHeartRateDTOs[0];
      setItemAsync("RestingHeartRate", JSON.stringify(restingHeartRate));
    }
  }
  catch (error){
    console.log(error)
  }
}
/**
 * 
 * @returns 
 */
export const addManyRestingHeartRate = async (userId : string , authToken:string, startDate: Date, endDate: Date) : Promise<IRestingHeartRate[]> => {
  try{
  const headers = {
    'Authorization': 'Bearer ' + authToken,
  };
  const restHeartRates : Array<HealthValue> = await retrieveHealthKitData("getRestingHeartRateSamples", startDate, endDate);
    const restHeartRateDTOs : Array<IRestingHeartRateDTO>= convertRestingHeartRate(userId, restHeartRates);
    console.log(restHeartRateDTOs);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios
            .post('http://localhost:3000/api/restingHeartRate/addManyRestingHeartRate', 
            restHeartRateDTOs, 
            {headers})
            .then(
              response => {
                console.log("DAVE")
                console.log(response.data);
                resolve(response.data);
              },
              error => {
                console.log(error.response.data.errors.message);
                reject(error.response.data.errors.message);
              },
            );
        });
      });
     } 
    catch (error){
      console.log(error);
    }
};


/**
 * Converts array of HealthValues to array of IRestingHeartRateDTO.
 * @param heartRateVariabilities 
 * @returns Array<IRestingHeartRateDTO>
 */
function convertRestingHeartRate(userId: string, restingHeartRate: Array<HealthValue>): Array<IRestingHeartRateDTO> {
  var restingHeartRateDTOs: Array<IRestingHeartRateDTO> = [];
  restingHeartRate.forEach(sample => {
    const restingHeartRateDTO: IRestingHeartRateDTO = {
      userID: userId,
      startDate: new Date(sample.startDate),
      bpm: Number(sample.value),
      hkID: sample.id,
      hkWasUserEntered: Boolean(sample.metadata.HKWasUserEntered)
    }
    // Add each sample
    restingHeartRateDTOs.push(restingHeartRateDTO);
  });
  return restingHeartRateDTOs;
}