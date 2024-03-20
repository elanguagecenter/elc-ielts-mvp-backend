import { UpdateWritingTestStage } from "../../../utils/types/test/IELTSTestTypes";

interface IWritingTestService {
  createWritingTest(id: string): Promise<any>;
  submitAnswer(id: string, answer: string): Promise<any>;
  getAllWritingTestsByReleventId(id: string, page: string, limit: string): Promise<any>;
  getNextAvailableWritingTestStages(writingTestId: string): Promise<Array<any>>;
  evaluateWritingTestStage(writingTestId: string, writingTestStageId: string, operation: string, payLoad: UpdateWritingTestStage): Promise<any>;
}

export default IWritingTestService;
