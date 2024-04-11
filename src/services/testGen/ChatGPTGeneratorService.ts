import OpenAI from "openai";
import ITextGeneratorService from "./ITextGeneratorService";
import GptPrompts from "../../utils/openai/GptPrompts";
import Contexts from "../../utils/openai/context.json";
import OpenAIUtils from "../../utils/openai/OpenAIUtils";
import ELCIELTSGPTError from "../../exception/ELCIELTSGPTError";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import configs from "../../config/configs";

class ChatGPTGeneratorService implements ITextGeneratorService {
  private openai: OpenAI;
  private static instance: ChatGPTGeneratorService = new ChatGPTGeneratorService();
  private constructor() {
    this.openai = new OpenAI({
      apiKey: configs.openAIAPIKey,
    });
  }

  static getInstance(): ChatGPTGeneratorService {
    return ChatGPTGeneratorService.instance;
  }

  async generateSpeakingTestStage2(): Promise<Array<string | null>> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.SpeakingTestPartOne);
    console.log(`Context to br generated: ${context}`);
    const content: string = GptPrompts.StageTwoSpeakingQuestionGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Speaking", 2, "generation");
  }

  async generateSpeakingTestStage3(previousGeneratedText: string): Promise<Array<string | null>> {
    const content: string = GptPrompts.StageThreeSpeakingQuestionGenerationPrompt(previousGeneratedText);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Speaking", 3, "generation");
  }

  async generateWritingTestStage1(): Promise<Array<string | null>> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.WritingTestPart1);
    console.log(`Writing part 1 Context to br generated: ${context}`);
    const content: string = GptPrompts.StageOneWritingTestQuestionGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Writing", 1, "generation");
  }

  async generateWritingTestStage2(): Promise<Array<string | null>> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.WritingTestPart2);
    console.log(`Writing part 2 Context to br generated: ${context}`);
    const content: string = GptPrompts.StageTwoWritingTestQuestionGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Writing", 2, "generation");
  }

  async evaluateWritingTestStage(question: string, answer: string, testStage: number): Promise<Array<string | null>> {
    const systemPromptContent: string = GptPrompts.WritingTestQuestionEvaluationSystemPrompt(testStage);
    const userPromptContent: string = GptPrompts.WritingTestQuestionEvaluationUserPrompt(question, answer);
    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemPromptContent },
      { role: "user", content: userPromptContent },
    ];
    return await this.invokeOpenApi(messages, 1, "Writing", 2, "evaluation");
  }

  async generateReadingTestStageOneText(): Promise<Array<string | null>> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.ReadingTestPart1);
    console.log(`Reading part 1 Context to be generated: ${context}`);
    const content: string = GptPrompts.StageOneReadingTestTextGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Reading", 1, "generation");
  }

  async generateReadingTestStageTwoText(): Promise<Array<string | null>> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.ReadingTestPart2And3);
    console.log(`Reading part 2 Context to be generated: ${context}`);
    const content: string = GptPrompts.StageTwoReadingTestTextGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Reading", 2, "generation");
  }

  async generateReadingTestStageThreeText(): Promise<Array<string | null>> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.ReadingTestPart2And3);
    console.log(`Reading part 3 Context to be generated: ${context}`);
    const content: string = GptPrompts.StageThreeReadingTestTextGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, 1, "Reading", 3, "generation");
  }

  async generateReadingTestStageMcqQuestions(text: string, numberOfQuestion: number, taskNum: number): Promise<Array<string | null>> {
    const systemPrompt: string = GptPrompts.ReadingTestQuestionGenerationSystemPrompt(taskNum);
    const mcqGenPrompt: string = GptPrompts.ReadingTestMcqQuestionGenerationPrompt();

    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: text },
      { role: "user", content: mcqGenPrompt },
    ];
    return await this.invokeOpenApi(messages, numberOfQuestion, "Reading", 1, "question generation");
  }

  async generateReadingTestStageSentanceCompletionQuestions(text: string, numberOfQuestion: number, taskNum: number): Promise<Array<string | null>> {
    const systemPrompt: string = GptPrompts.ReadingTestQuestionGenerationSystemPrompt(taskNum);
    const senCompletionGenPrompt: string = GptPrompts.ReadingTestSentenceCompletionQuestionGenerationPrompt();

    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: text },
      { role: "user", content: senCompletionGenPrompt },
    ];
    return await this.invokeOpenApi(messages, numberOfQuestion, "Reading", 1, "question generation");
  }

  async evaluateReadingTestQuestions(text: string, question: string, answer: string): Promise<Array<string | null>> {
    const systemPrompt: string = GptPrompts.ReadingTestQuestionEvaluationSystemPrompt();
    const evaluationPrompt: string = GptPrompts.ReadingTestQuestionEvaluationUserPrompt(question, answer);

    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: text },
      { role: "user", content: evaluationPrompt },
    ];
    return await this.invokeOpenApi(messages, 1, "Reading", 1, "question generation");
  }

  private async invokeOpenApi(messages: Array<ChatCompletionMessageParam>, itteration: number, testType: string, stage: number, promptType: string): Promise<Array<string | null>> {
    return await this.openai.chat.completions
      .create({
        model: "gpt-4-turbo",
        n: itteration,
        temperature: 1.2,
        messages: messages,
      })
      .then((completion) => {
        return completion.choices.map((choice) => choice.message.content);
      })
      .catch((err) => {
        console.log(err);
        throw new ELCIELTSGPTError(`Error happened in ${testType} stage ${stage} ${promptType}`);
      });
  }
}

export default ChatGPTGeneratorService;
