import { PracticeReadingTestModel } from "../../../utils/types/dbtypes/models";
import IReadingTestRepository from "../IReadingTestRepository";

interface IPracticeReadingTestRepository extends IReadingTestRepository<PracticeReadingTestModel> {
  createPracticeReadingTest(studentId: string): Promise<PracticeReadingTestModel>;
  getAllByStudentId(studentId: string, page: number, limit: number): Promise<Array<PracticeReadingTestModel>>;
}

export default IPracticeReadingTestRepository;
