import { TestStatusModel } from "../../utils/types/dbtypes/models";

interface ITestStatusRepository {
  create(testId: string, status: string): Promise<TestStatusModel>;
  getStatusByTestId(testId: string): Promise<Array<TestStatusModel>>;
}

export default ITestStatusRepository;
