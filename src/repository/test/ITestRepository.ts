import { TestStatus } from "../../utils/types/common/common";
import { TestModel } from "../../utils/types/dbtypes/models";

interface ITestRepository {
  create(studentId: string, testName: string): Promise<TestModel>;
  updateStatusById(testId: string, status: string): Promise<TestModel>;
  getById(testId: string): Promise<TestModel>;
}

export default ITestRepository;
