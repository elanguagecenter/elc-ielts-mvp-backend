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

  async generateSpeakingTestStage2(): Promise<string> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.SpeakingTestPartOne);
    console.log(`Context to br generated: ${context}`);
    const content: string = GptPrompts.StageTwoSpeakingQuestionGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, "Speaking", 2, "generation");
  }

  async generateSpeakingTestStage3(previousGeneratedText: string): Promise<string> {
    const content: string = GptPrompts.StageThreeSpeakingQuestionGenerationPrompt(previousGeneratedText);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, "Speaking", 3, "generation");
  }

  async generateWritingTestStage1(): Promise<string> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.WritingTestPart1);
    console.log(`Writing part 1 Context to br generated: ${context}`);
    const content: string = GptPrompts.StageOneWritingTestQuestionGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, "Writing", 1, "generation");
  }

  async generateWritingTestStage2(): Promise<string> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.WritingTestPart2);
    console.log(`Writing part 2 Context to br generated: ${context}`);
    const content: string = GptPrompts.StageTwoWritingTestQuestionGenerationPrompt(context);
    const messages: Array<ChatCompletionMessageParam> = [{ role: "system", content: content }];
    return await this.invokeOpenApi(messages, "Writing", 2, "generation");
  }

  async evaluateWritingTestStage(question: string, answer: string, testStage: number): Promise<string> {
    const systemPromptContent: string = GptPrompts.WritingTestQuestionEvaluationSystemPrompt(testStage);
    const userPromptContent: string = GptPrompts.WritingTestQuestionEvaluationUserPrompt(question, answer);
    const messages: Array<ChatCompletionMessageParam> = [
      { role: "system", content: systemPromptContent },
      { role: "user", content: userPromptContent },
    ];
    return await this.invokeOpenApi(messages, "Writing", 2, "evaluation");
  }

  private async invokeOpenApi(messages: Array<ChatCompletionMessageParam>, testType: string, stage: number, promptType: string) {
    return await this.openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: messages,
      })
      .then((completion) => {
        if (completion.choices[0].message.content) {
          return completion.choices[0].message.content;
        }
        throw new Error();
      })
      .catch(() => {
        throw new ELCIELTSGPTError(`Error happened in ${testType} stage ${stage} ${promptType}`);
      });
  }
}

export default ChatGPTGeneratorService;
