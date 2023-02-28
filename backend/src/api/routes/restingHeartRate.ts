import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IRestingHeartRateDTO } from '../../interfaces/IRestingHeartRate';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import RestingHeartRateService from '@/services/restingHeartRate';

const route = Router();

export default (app: Router) => {
app.use('/restingHeartRate', route);

// make post request to add restingHeartRate
route.post(
'/addRestingHeartRate',
celebrate({
  body: Joi.object({
    userID: Joi.string().required(),
    startDate: Joi.date().required(),
    duration: Joi.number().required(),
    bpm: Joi.number().required(),
    hkID: Joi.string().required(),
    hkWasUserEntered: Joi.boolean().required()
  }),
}),
async (req: Request, res: Response, next: NextFunction) => {
  const logger:Logger = Container.get('logger');
  logger.debug('Calling addRestingHeartRate endpoint with body: %o', req.body );
  try {
    const RestingHeartRateServiceInstance = Container.get(RestingHeartRateService);
    const { restingHeartRate } = await RestingHeartRateServiceInstance.addRestingHeartRate(req.body as IRestingHeartRateDTO);
    return res.status(201).json({ restingHeartRate });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
},
);

// make get request to retrieve heart rate sample, given id
route.get(
'/getRestingHeartRateByID/id/:id/',
async (req: Request, res: Response, next: NextFunction) => {
  const logger:Logger = Container.get('logger');
  logger.debug('Calling getRestingHeartRateByID endpoint');
  try {
    const id = req.params.id;
    const RestingHeartRateServiceInstance = Container.get(RestingHeartRateService);
    const { restingHeartRate } = await RestingHeartRateServiceInstance.getRestingHeartRateByID(id);
    return res.json({ restingHeartRate }).status(200);
  } catch (e) {
    logger.error('🔥 error: %o',  e );
    return next(e);
  }
},
);

// deletes heart rate sample given an id
route.delete(
   '/deleteRestingHeartRateByID/id/:id',
   async (req: Request, res: Response, next: NextFunction) => {
     const logger: Logger = Container.get('logger');
     logger.debug('Calling deleteRestingHeartRateByID endpoint');
     try {
       const id = req.params.id;
       const RestingHeartRateServiceInstance = Container.get(RestingHeartRateService);
       const { restingHeartRate } = await RestingHeartRateServiceInstance.deleteRestingHeartRateByID(id);
       return res.json({ restingHeartRate }).status(200);
     } catch (e) {
       logger.error('🔥 error: %o', e);
       return next(e);
     }
   },
 );
};