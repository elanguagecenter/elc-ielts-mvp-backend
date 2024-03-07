import { TestStatus } from "../../utils/types/common/common";
import { TestSeachResult } from "../../utils/types/common/types";
import { TestModel } from "../../utils/types/dbtypes/models";

interface ITestRepository {
  create(studentId: string, testName: string): Promise<TestModel>;
  updateStatusById(testId: string, status: string): Promise<TestModel>;
  getById(testId: string): Promise<TestModel>;
  seachByTestNameAndUserId(name: string, userId: string): Promise<Array<TestSeachResult>>;
  getAllWithLimit(limit: number): Promise<Array<TestModel>>;
}

export default ITestRepository;
