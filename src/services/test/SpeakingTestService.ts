import ELCIELTSNotImplementedError from "../../exception/ELCIELTSNotImplementedError";
import ISpeakingTestRepository from "../../repository/speakingTest/ISpeakingTestRepository";
import PrismaSpeakingTestRepository from "../../repository/speakingTest/PrismaSpeakingTestRepository";
import { CreateSpekingTest, CreateSpekingTestStage, UpdateSpeakingTestQuestion } from "../../types/test/IELTSTestTypes";

class SpeakingTestService {
  private speakingTestRepository: ISpeakingTestRepository;
  constructor(speakingTestRepository: ISpeakingTestRepository) {
    this.speakingTestRepository = speakingTestRepository;
  }

  createSpeakingTest(testId: string, payload: CreateSpekingTest) {
    // TODO - Implement create speaking test logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  createSpeakingTestStage(testId: string, stgNumber: string, payload: CreateSpekingTestStage) {
    // TODO - Implement create speaking test stage logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  getAllSpeakingTestStages(testId: string) {
    // TODO - Implement get all speaking test stages logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  getSpecificTestStage(testId: string, stgNumber: string) {
    // TODO - Implement get specific speaking test stage logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  getSpeakingQuestion(testId: string, stgNumber: string, qid: string) {
    // TODO - Implement get speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }

  updateSpeakingQuestion(testId: string, stgNumber: string, qid: string, payload: UpdateSpeakingTestQuestion) {
    // TODO - Implement update speaking question logic
    throw new ELCIELTSNotImplementedError("Requested functionality is under construction");
  }
}
const service = {
  prismaSpeakingTest: new SpeakingTestService(PrismaSpeakingTestRepository.getInstance()),
};
export default service;
