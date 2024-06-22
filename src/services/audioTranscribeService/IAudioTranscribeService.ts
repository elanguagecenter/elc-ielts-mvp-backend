import { GetTranscriptionJobCommandOutput, LanguageCode, MediaFormat, StartTranscriptionJobCommandOutput } from "@aws-sdk/client-transcribe";

interface IAudioTranscribeService {
  startTranscriptionJob(mediaUrl: string, jobName: string, mediaFormat: MediaFormat, languageCode: LanguageCode): Promise<StartTranscriptionJobCommandOutput>;
  getTranscriptionResult(jobName: string): Promise<GetTranscriptionJobCommandOutput>;
}

export default IAudioTranscribeService;
