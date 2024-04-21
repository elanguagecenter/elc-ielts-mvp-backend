import OpenAI from "openai";
import IVoiceGeneratorService from "./IVoiceGeneratorService";
import OpenAISource from "../../config/OpenAIConfig";
import { OpenAIVoices } from "../../utils/openai/Types";

class OpenAIVoiceGeneratorService implements IVoiceGeneratorService {
  private openai: OpenAI;
  private static instance: IVoiceGeneratorService = new OpenAIVoiceGeneratorService();

  constructor() {
    this.openai = OpenAISource;
  }

  static getInstance(): IVoiceGeneratorService {
    return this.instance;
  }

  async generateVoiceForListeningTestStageOne(lines: Array<string>): Promise<Array<Buffer>> {
    return await Promise.all(
      lines.map(async (line, index) => (index % 2 === 0 ? await this.generateVoiceForText(line, OpenAIVoices.ALLOY) : this.generateVoiceForText(line, OpenAIVoices.NOVA)))
    );
  }

  async generateVoiceForListeningTestStageTwo(lines: Array<string>): Promise<Array<Buffer>> {
    const transcript: string = lines.join("\n\n");
    return [await this.generateVoiceForText(transcript, OpenAIVoices.ALLOY)];
  }

  async generateVoiceForListeningTestStageThree(lines: Array<string>): Promise<Array<Buffer>> {
    return await Promise.all(
      lines.map(async (line, index) =>
        index % 3 === 0
          ? await this.generateVoiceForText(line, OpenAIVoices.ALLOY)
          : index % 3 === 1
            ? this.generateVoiceForText(line, OpenAIVoices.NOVA)
            : this.generateVoiceForText(line, OpenAIVoices.FABLE)
      )
    );
  }

  async generateVoiceForListeningTestStageFour(lines: Array<string>): Promise<Array<Buffer>> {
    const transcript: string = lines.join("\n\n");
    return [await this.generateVoiceForText(transcript, OpenAIVoices.FABLE)];
  }

  private async generateVoiceForText(text: string, voice: OpenAIVoices): Promise<Buffer> {
    const audio = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
      speed: 0.9,
    });
    return Buffer.from(await audio.arrayBuffer());
  }
}

export default OpenAIVoiceGeneratorService;
