import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IOnboardingInputDTO } from '@/interfaces/IOnboarding';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import OnboardingService from '@/services/onboarding';

const route = Router();
export default (app: Router) => {
  app.use('/onboarding', route);

  route.post(
    '/addOnboarding',
    celebrate({
      body: Joi.object({
        userID: Joi.number().required(),
        nickname: Joi.string(),
        city: Joi.string(),
        zipcode: Joi.string(),
        religion: Joi.string(),
        ethnicity: Joi.string(),
        sexualOrientation: Joi.string(),
        identifyYourself: Joi.string(),
        gender: Joi.string(),
        concerns: Joi.array(),
        goals: Joi.array(),
        personalityTestScore: Joi.array(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
      try {
        const OnboardingServiceInstance = Container.get(OnboardingService);
        const { onboarding } = await OnboardingServiceInstance.addOnboarding(req.body as IOnboardingInputDTO);
        return res.status(201).json({ onboarding });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};