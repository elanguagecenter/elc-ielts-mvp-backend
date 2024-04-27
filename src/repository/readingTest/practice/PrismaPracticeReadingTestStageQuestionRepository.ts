import prisma from "../../../config/DatabaseSource";
import { QuestionStatus } from "../../../utils/types/common/common";
import { ReadingQuestionsCreateManyDataType } from "../../../utils/types/common/types";
import { PracticeReadingTestStageQuestionsModel } from "../../../utils/types/dbtypes/models";
import IPracticeReadingTestStageQuestionRepository from "./IPracticeReadingTestStageQuestionRepository";

class PrismaPracticeReadingTestStageQuestionRepository implements IPracticeReadingTestStageQuestionRepository {
  private static instance: PrismaPracticeReadingTestStageQuestionRepository = new PrismaPracticeReadingTestStageQuestionRepository();

  static getInstance() {
    return this.instance;
  }
  private constructor() {}

  async create(readingTestStageId: string, question: string, questionNum: number, type: string): Promise<PracticeReadingTestStageQuestionsModel> {
    return await prisma.practice_reading_question.create({
      data: {
        question_number: questionNum,
        generated_question: question,
        practice_reading_test_stage_id: readingTestStageId,
        type: type,
        status: QuestionStatus.CREATED,
      },
    });
  }

  async createMany(data: Array<ReadingQuestionsCreateManyDataType>, stageId: string): Promise<Array<PracticeReadingTestStageQuestionsModel>> {
    return await prisma.practice_reading_question
      .createMany({
        data: data,
      })
      .then(() =>
        prisma.practice_reading_question.findMany({
          where: {
            practice_reading_test_stage_id: stageId,
          },
          orderBy: {
            question_number: "asc",
          },
        })
      );
  }

  async getAllByStageId(readingTestStageId: string): Promise<Array<PracticeReadingTestStageQuestionsModel>> {
    return await prisma.practice_reading_question.findMany({
      where: {
        practice_reading_test_stage_id: readingTestStageId,
      },
      orderBy: {
        question_number: "asc",
      },
    });
  }

  async updateAnswer(questionId: string, answer: string): Promise<PracticeReadingTestStageQuestionsModel> {
    return await prisma.practice_reading_question.update({
      where: {
        practice_reading_question_id: questionId,
      },
      data: {
        submitted_answer: answer,
      },
    });
  }

  async updateResult(questionId: string, result: string): Promise<PracticeReadingTestStageQuestionsModel> {
    return await prisma.practice_reading_question.update({
      where: {
        practice_reading_question_id: questionId,
      },
      data: {
        evaluated_result: result,
      },
    });
  }
}

export default PrismaPracticeReadingTestStageQuestionRepository;
