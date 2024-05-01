import { PracticeSpeakingTestModel } from "../../../utils/types/dbtypes/models";
import ISpeakingTestRepository from "../ISpeakingTestRepository";

interface IPracticeSpeakingTestRepository extends ISpeakingTestRepository<PracticeSpeakingTestModel> {
  getAllByStudentIdWithPageAndLimit(studentId: string, page: number, limit: number): Promise<Array<PracticeSpeakingTestModel>>;
  getAllByTeacherIdWithPageAndLimit(teacherId: string, page: number, limit: number): Promise<Array<PracticeSpeakingTestModel>>;
}

export default IPracticeSpeakingTestRepository;
