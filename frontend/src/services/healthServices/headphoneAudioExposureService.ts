import axios from 'axios';
import { HealthValue } from 'react-native-health';
import { dateDifferenceInMilliSeconds, retrieveHealthKitData } from './healthService';
import { IActivityDTO } from '../../interfaces/IActivity';
import { IHeadphoneAudioExposureDTO, IHeadphoneAudioExposure } from '../../interfaces/IHeadphoneAudioExposure';

/**
 * 
 * @returns 
 */
export const addManyHeadphoneAudioExposure = async (userId:string, startDate:Date, endDate:Date) : Promise<IHeadphoneAudioExposure[]> => {
    const headphoneExposureSamples : Array<HealthValue> = await retrieveHealthKitData("getHeadphoneAudioExposure", startDate, endDate);
    const headphoneExposureSampleDTOs : Array<IHeadphoneAudioExposureDTO>= convertHeadphoneExposureSamples(userId, headphoneExposureSamples);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios
            .post('http://localhost:3000/api/headphoneAudioExposure/addManyHeadphoneAudioExposure', 
            headphoneExposureSampleDTOs)
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
};

/**
 * Converts array of HealthValues to array of IHeadphoneExposureSampleDTO.
 * @param headphoneExposureSamples 
 * @returns Array<IHeadphoneExposureSampleDTO>
 */
function convertHeadphoneExposureSamples(userId: string, headphoneExposureSamples: Array<HealthValue>): Array<IHeadphoneAudioExposureDTO> {
    var headphoneExposureSampleDTOs: Array<IHeadphoneAudioExposureDTO> = [];
    headphoneExposureSamples.forEach(sample => {
      let startDate = new Date(sample.startDate);
      let duration = dateDifferenceInMilliSeconds(startDate, new Date(sample.endDate));
      const headphoneExposureSampleDTO: IHeadphoneAudioExposureDTO = {
        userID: userId,
        startDate: startDate,
        duration: duration,
        value: sample.value,
        hkID: sample.id,
        //hkWasUserEntered: Boolean(sample.metadata.HKWasUserEntered)
      }
      // Add each sample
      headphoneExposureSampleDTOs.push(headphoneExposureSampleDTO)
    });
    return headphoneExposureSampleDTOs;
  }
  