import {
  GetTranscriptionJobCommand,
  GetTranscriptionJobCommandInput,
  GetTranscriptionJobCommandOutput,
  LanguageCode,
  MediaFormat,
  StartTranscriptionJobCommand,
  StartTranscriptionJobCommandInput,
  StartTranscriptionJobCommandOutput,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import transcribeClient from "../../config/TranscribeClientConfig";
import IAudioTranscribeService from "./IAudioTranscribeService";

class AWSAudioTranscribeService implements IAudioTranscribeService {
  private static instance: IAudioTranscribeService = new AWSAudioTranscribeService();
  private transcribeClient: TranscribeClient;
  constructor() {
    this.transcribeClient = transcribeClient;
  }

  static GetInstance(): IAudioTranscribeService {
    return this.instance;
  }

  async startTranscriptionJob(mediaUrl: string, jobName: string, mediaFormat: MediaFormat, languageCode: LanguageCode): Promise<StartTranscriptionJobCommandOutput> {
    const params: StartTranscriptionJobCommandInput = {
      TranscriptionJobName: jobName,
      Media: {
        MediaFileUri: mediaUrl,
      },
      MediaFormat: mediaFormat,
      LanguageCode: languageCode,
    };
    const command = new StartTranscriptionJobCommand(params);
    return await this.transcribeClient.send(command);
  }

  async getTranscriptionResult(jobName: string): Promise<GetTranscriptionJobCommandOutput> {
    const params: GetTranscriptionJobCommandInput = {
      TranscriptionJobName: jobName,
    };
    const command = new GetTranscriptionJobCommand(params);
    return await this.transcribeClient.send(command);
  }
}
