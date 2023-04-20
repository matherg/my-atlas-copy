import axios from 'axios';
import { HealthValue } from 'react-native-health';
import { dateDifferenceInMilliSeconds, retrieveHealthKitData } from './healthKitService';
import { ISleepSample, ISleepSampleDTO } from '../../interfaces/ISleepSample';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import { err } from 'react-native-svg/lib/typescript/xml';


export const addSleepSampleLocal = async (userId: string) => {
  try{
    const today: Date = new Date();
    today.setHours(0,0,0,0)
    const sleepSamples : Array<HealthValue> = await retrieveHealthKitData("getSleepSamples", today, new Date());
    const sleepSampleDTOS : Array<ISleepSampleDTO>= convertSleepSamples(userId, sleepSamples);
    if (sleepSampleDTOS.length > 0){
      const sleepSample = sleepSampleDTOS[0];
      setItemAsync("SleepSamples", JSON.stringify(sleepSample));
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
export const addManySleepSample = async (userId : string, authToken: string,  startDate: Date, endDate: Date) => {
  try{
      const headers = {
    'Authorization': 'Bearer ' + authToken,
  };
  const sleepSamples : Array<HealthValue> = await retrieveHealthKitData("getSleepSamples", startDate, endDate);
  const sleepSampleDTOS : Array<ISleepSampleDTO>= convertSleepSamples(userId, sleepSamples);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios
            .post('http://localhost:3000/api/sleepSample/addManySleepSample', 
            sleepSampleDTOS, 
            {headers})
            .then(
              response => {
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
    } catch(error){
      console.log(error);
    }
};


/**
 * Converts array of HealthValues to array of ISleepSampleDTO.
 * @param sleepSamples 
 * @returns 
 */
function convertSleepSamples(userId: string, sleepSamples: Array<HealthValue>): Array<ISleepSampleDTO> {
  var sleepSampleDTOS: Array<ISleepSampleDTO> = [];
  sleepSamples.forEach(sample => {
    let startDate = new Date(sample.startDate);
    let duration = dateDifferenceInMilliSeconds(startDate, new Date(sample.endDate));
    const sleepSampleDTO: ISleepSampleDTO = {
      userID: userId,
      startDate: startDate,
      duration: duration,
      sleepState: sample.value.toString()
    }
    // Add each sample
    sleepSampleDTOS.push(sleepSampleDTO)
  });
  return sleepSampleDTOS;
}