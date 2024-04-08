import { PracticeReadingTestStageModel, PracticeReadingTestStageQuestionsModel } from "../../../utils/types/dbtypes/models";
import { UpdateReadingTestStage } from "../../../utils/types/test/IELTSTestTypes";

interface IReadingTestService {
  getTestStageByStageId(testStageId: string): Promise<any>;
  createReadingTest(id: string): Promise<any>;
  getAllReadingTestsByReleventId(id: string, page: string, limit: string): Promise<any>;
  getNextAvailableReadingTestStages(readingTestId: string): Promise<Array<any>>;
  getQuestionsByStageId(readingTestStageId: string): Promise<Array<any>>;
  generateReadingTestStageQuestions(stageId: string): Promise<PracticeReadingTestStageModel>;
  evaluateTestStage(testId: string, testStageId: string, operation: string, payLoad: UpdateReadingTestStage): Promise<PracticeReadingTestStageModel>;
}

export default IReadingTestService;
