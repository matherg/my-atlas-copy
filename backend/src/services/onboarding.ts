import { Service, Inject } from 'typedi';
import { IOnboarding, IOnboardingInputDTO } from '@/interfaces/IOnboarding';
import MailerService from './mailer';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';

@Service()
export default class OnboardingService {
  constructor(
    @Inject('onboardingModel') private onboardingModel: Models.OnboardingModel,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  // Takes in an onboardingInputDTO and adds to to the database. Returns the added onboarding data
  // if there were no problems. Otherwise returns the error
  public async addOnboarding(onboardingInputDTO: IOnboardingInputDTO): Promise<{ onboarding: IOnboarding }> {
    try {
      this.logger.debug(onboardingInputDTO);
      const onboardingRecord = await this.onboardingModel.create({
        ...onboardingInputDTO,
      });
      const onboarding :IOnboarding= onboardingRecord.toObject();
      return { onboarding };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // Gets the onboarding information associated with the given userID (not the
  // objectID). Others returns an error if there is no onbarding information associated
  // with the given ID
  public async getOnboarding(userID: string): Promise<{ onboarding: IOnboarding }> {
    try {
      const onboardingRecord = await this.onboardingModel.findOne({userID: userID});
      const onboarding : IOnboarding = onboardingRecord.toObject();
      return { onboarding };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // Deletes the onboarding information associated with the given userID (not the
  // objectID). Returns the deleted onbaording data. Otherwise returns an error
  // if the data could not be deleted.
  public async deleteOnboardingByUserID(userID: string): Promise<{ onboarding : IOnboarding }> {
    try {
      const onboardingRecord = await this.onboardingModel.findOneAndDelete({userID: userID});
      const onboarding : IOnboarding = onboardingRecord.toObject();
      return { onboarding };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // Takes in onboardingInputDTO and uses the userID within to update the onboarding data associated with
  // the given id. Returns an error if it could not update, either due to no onboarding data associated with
  // the given id or could not be updated for anotehr reason
  public async updateOnboardingByUserID(onboardingInputDTO: IOnboardingInputDTO): Promise<{ onboarding: IOnboarding  }> {
    try {
      const userID = onboardingInputDTO.userID;
      const onboardingRecord = await this.onboardingModel.findOneAndUpdate({userID: userID}, onboardingInputDTO,{
        runValidators: true,
        new: true}); // new implies we want to return the new document
      const onboarding : IOnboarding = onboardingRecord.toObject();
      return { onboarding };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
