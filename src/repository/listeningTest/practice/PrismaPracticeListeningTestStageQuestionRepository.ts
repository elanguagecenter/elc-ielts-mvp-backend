import prisma from "../../../config/DatabaseSource";
import Handle from "../../../utils/decorators/DBErrorHandlingDecorator";
import { QuestionStatus } from "../../../utils/types/common/common";
import { ListeningQuestionsCreateManyDataType } from "../../../utils/types/common/types";
import { PracticeListeningTestStageQuestionsModel } from "../../../utils/types/dbtypes/models";
import IPracticeListeningTestStageQuestionRepository from "./IPracticeListeningTestStageQuestionRepository";

class PrismaPracticeListeningTestStageQuestionRepository implements IPracticeListeningTestStageQuestionRepository {
  private static instance: IPracticeListeningTestStageQuestionRepository = new PrismaPracticeListeningTestStageQuestionRepository();

  static getInstance() {
    return this.instance;
  }

  private constructor() {}

  @Handle
  async create(stageId: string, question: string, questionNum: number, type: string): Promise<PracticeListeningTestStageQuestionsModel> {
    return await prisma.practice_listening_test_stage_question.create({
      data: {
        question_number: questionNum,
        generated_question: question,
        practice_listening_test_stage_id: stageId,
        type: type,
        status: QuestionStatus.CREATED,
      },
    });
  }

  @Handle
  async createMany(data: ListeningQuestionsCreateManyDataType[], stageId: string): Promise<Array<PracticeListeningTestStageQuestionsModel>> {
    return await prisma.practice_listening_test_stage_question
      .createMany({
        data: data,
      })
      .then(() =>
        prisma.practice_listening_test_stage_question.findMany({
          where: {
            practice_listening_test_stage_id: stageId,
          },
          orderBy: {
            question_number: "asc",
          },
        })
      );
  }

  @Handle
  async getAllByStageId(stageId: string): Promise<Array<PracticeListeningTestStageQuestionsModel>> {
    return await prisma.practice_listening_test_stage_question.findMany({
      where: {
        practice_listening_test_stage_id: stageId,
      },
      orderBy: {
        question_number: "asc",
      },
    });
  }

  @Handle
  async updateAnswer(questionId: string, answer: string): Promise<PracticeListeningTestStageQuestionsModel> {
    return await prisma.practice_listening_test_stage_question.update({
      where: {
        practice_listening_test_stage_question_id: questionId,
      },
      data: {
        submitted_answer: answer,
      },
    });
  }

  @Handle
  async updateResult(questionId: string, result: string): Promise<PracticeListeningTestStageQuestionsModel> {
    return await prisma.practice_listening_test_stage_question.update({
      where: {
        practice_listening_test_stage_question_id: questionId,
      },
      data: {
        evaluated_result: result,
      },
    });
  }
}

export default PrismaPracticeListeningTestStageQuestionRepository;
