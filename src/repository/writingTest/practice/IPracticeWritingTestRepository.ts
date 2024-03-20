import { PracticeWritingTestModel } from "../../../utils/types/dbtypes/models";
import IWritingTestRepository from "../IWritingTestRepository";

interface IPracticeWritingTestRepository extends IWritingTestRepository<PracticeWritingTestModel> {
  createPracticeWritingTest(studentId: string): Promise<PracticeWritingTestModel>;
  getAllByStudentId(studentId: string, page: number, limit: number): Promise<Array<PracticeWritingTestModel>>;
}

export default IPracticeWritingTestRepository;
