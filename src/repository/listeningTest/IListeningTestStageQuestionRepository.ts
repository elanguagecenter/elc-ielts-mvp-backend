import { ListeningQuestionsCreateManyDataType } from "../../utils/types/common/types";

interface IListeningTestStageQuestionRepository<T> {
  create(stageId: string, question: string, questionNum: number, type: string): Promise<T>;
  createMany(data: Array<ListeningQuestionsCreateManyDataType>, stageId: string): Promise<Array<T>>;
  getAllByStageId(stageId: string): Promise<Array<T>>;
  updateAnswer(questionId: string, answer: string): Promise<T>;
  updateResult(questionId: string, result: string): Promise<T>;
}

export default IListeningTestStageQuestionRepository;
