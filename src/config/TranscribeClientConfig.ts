import configs from "./configs";
import { TranscribeClient } from "@aws-sdk/client-transcribe";

const transcribeClient: TranscribeClient = new TranscribeClient({ region: configs.aws_region });

export default transcribeClient;
