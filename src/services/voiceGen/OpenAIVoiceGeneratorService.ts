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

  private async generateVoiceForText(text: string, voice: OpenAIVoices): Promise<Buffer> {
    const audio = await this.openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
      speed: 0.8,
    });
    return Buffer.from(await audio.arrayBuffer());
  }
}

export default OpenAIVoiceGeneratorService;
