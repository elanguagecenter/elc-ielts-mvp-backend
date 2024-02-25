import { SpeakingTestStatusModel } from "../../types/dbtypes/models";

interface ISpeakingTestStatusRepository {
  create(speakingTestId: string, status: string): Promise<SpeakingTestStatusModel>;
  getStatusesBySpeakingTestId(speakingTestId: string): Promise<Array<SpeakingTestStatusModel>>;
}

export default ISpeakingTestStatusRepository;
