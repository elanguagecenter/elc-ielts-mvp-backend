import OpenAI from "openai";
import ITestGeneratorService from "./ITestGeneratorService";
import GptPrompts from "../../utils/openai/GptPrompts";
import Contexts from "../../utils/openai/context.json";
import OpenAIUtils from "../../utils/openai/OpenAIUtils";
import ELCIELTSGPTError from "../../exception/ELCIELTSGPTError";

class ChatGPTGeneratorService implements ITestGeneratorService {
  private openai: OpenAI;
  private static instance: ChatGPTGeneratorService = new ChatGPTGeneratorService();
  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.CHAT_GPT_APIKEY,
    });
  }

  static getInstance(): ChatGPTGeneratorService {
    return ChatGPTGeneratorService.instance;
  }

  async generateSpeakingTestStage2(): Promise<string> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.SpeakingTestPartOne);
    console.log(`Context to br generated: ${context}`);
    const content: string = GptPrompts.PartOneSpeakingQuestionGenerationPrompt(context);
    return await this.invokeOpenApi(content, "Speaking", 2);
  }

  async generateSpeakingTestStage3(previousGeneratedText: string): Promise<string> {
    const content: string = GptPrompts.PartTwoSpeakingQuestionGenerationPrompt(previousGeneratedText);
    return await this.invokeOpenApi(content, "Speaking", 3);
  }

  private async invokeOpenApi(content: string, testType: string, stage: number) {
    return await this.openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: content }],
      })
      .then((completion) => {
        if (completion.choices[0].message.content) {
          return completion.choices[0].message.content;
        }
        throw new Error();
      })
      .catch(() => {
        throw new ELCIELTSGPTError(`Error happened in ${testType} stage ${stage} generation`);
      });
  }
}

export default ChatGPTGeneratorService;
