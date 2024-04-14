import { PracticeListeningTestStageModel } from "../../../utils/types/dbtypes/models";
import { UpdateListeningTestStage } from "../../../utils/types/test/IELTSTestTypes";

interface IListeningTestService {
  createTest(id: string): Promise<any>;
  getTestStageByStageId(stageId: string): Promise<any>;
  getAllListeningTestsByReleventId(id: string, page: string, limit: string): Promise<any>;
  getReadingTestStageByStageNum(testId: string, stageNum: string): Promise<any>;
  getQuestionsByStageId(stageId: string): Promise<Array<any>>;
  createStage(testId: string, stageNum: string): Promise<PracticeListeningTestStageModel>;
  evaluateTestStage(testId: string, stageId: string, operation: string, payLoad: UpdateListeningTestStage): Promise<PracticeListeningTestStageModel>;
}

export default IListeningTestService;
