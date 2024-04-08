import { ReadingQuestionsCreateManyDataType } from "../../utils/types/common/types";

interface IReadingTestStageQuestionRepository<T> {
  create(readingTestStageId: string, question: string, questionNum: number, type: string): Promise<T>;
  createMany(data: Array<ReadingQuestionsCreateManyDataType>, stageId: string): Promise<Array<T>>;
  getAllByStageId(readingTestStageId: string): Promise<Array<T>>;
  updateAnswer(questionId: string, answer: string): Promise<T>;
  updateResult(questionId: string, result: string): Promise<T>;
}

export default IReadingTestStageQuestionRepository;
