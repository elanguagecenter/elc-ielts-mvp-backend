import OpenAI from "openai";
import ITestGeneratorService from "./ITestGeneratorService";
import GptPrompts from "../../utils/openai/GptPrompts";
import Contexts from "../../utils/openai/context.json";
import OpenAIUtils from "../../utils/openai/OpenAIUtils";
import ELCIELTSGPTError from "../../exception/ELCIELTSGPTError";

class ChatGPTGeneratorService implements ITestGeneratorService {
  private openai: OpenAI;
  private static instance: ITestGeneratorService = new ChatGPTGeneratorService();
  private constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.CHAT_GPT_APIKEY,
    });
  }

  static getInstance(): ITestGeneratorService {
    return this.instance;
  }

  async generateSpeakingTestStage2(): Promise<string> {
    const context: string = OpenAIUtils.getRandomContextValue(Contexts.SpeakingTestPartOne);
    return await this.openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: GptPrompts.PartOneSpeakingQuestionGenerationPrompt(context) }],
        temperature: 0.39,
        max_tokens: 2048,
        top_p: 1,
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
      })
      .then((completion) => {
        if (completion.choices[0].message.content) {
          return completion.choices[0].message.content;
        }
        throw new Error();
      })
      .catch(() => {
        throw new ELCIELTSGPTError("Error happened in speaking stage 2 generation");
      });
  }

  async generateSpeakingTestStage3(previousGeneratedText: string): Promise<string> {
    return await this.openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: GptPrompts.PartTwoSpeakingQuestionGenerationPrompt(previousGeneratedText) }],
        temperature: 0.39,
        max_tokens: 2048,
        top_p: 1,
        presence_penalty: 0.5,
        frequency_penalty: 0.5,
      })
      .then((completion) => {
        if (completion.choices[0].message.content) {
          return completion.choices[0].message.content;
        }
        throw new Error();
      })
      .catch(() => {
        throw new ELCIELTSGPTError("Error happened in speaking stage 3 generation");
      });
  }
}

export default ChatGPTGeneratorService;
