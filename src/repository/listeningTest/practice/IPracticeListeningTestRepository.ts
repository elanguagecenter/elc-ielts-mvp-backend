import { PracticeListeningTestModel } from "../../../utils/types/dbtypes/models";
import IListeningTestRepository from "../IListeningTestRepository";

interface IPracticeListeningTestRepository extends IListeningTestRepository<PracticeListeningTestModel> {
  createPracticeTest(studentId: string): Promise<PracticeListeningTestModel>;
  getAllByStudentId(studentId: string, page: number, limit: number): Promise<Array<PracticeListeningTestModel>>;
}

export default IPracticeListeningTestRepository;
