const configs = {
  port: process.env.PORT,
  serverUrl: process.env.SERVER_URL,
  dbUrl: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=${process.env.DB_SCHEMA}`,
  awsCognitoJwk: process.env.AWS_COGNITO_JWK || "{}",
  ffmpegPath: process.env.FFMPEG_PATH || "ffmpeg",
  mediaOutBasepath: process.env.MEDIA_OUT_BASEPATH || "./",
  openAIAPIKey: process.env.CHAT_GPT_APIKEY,
  listeningAudioOutBasePath: process.env.LISTENING_AUDIO_OUT_BASE_PATH || "./",
  listeningAudioOutS3BasePath: process.env.LISTENING_AUDIO_OUT_S3_BASE_PATH || "",
  aws_region: process.env.AWS_REGION || "ap-southeast-1",
  bucket_name: process.env.S3_BUCKET_NAME || "elc-b2b-ielts-mvp-dev-local-bucket-bucket",
  cognito_client_id: process.env.COGNITO_CLIENT_ID || "",
  cognito_client_secret: process.env.COGNITO_CLIENT_SECRET || "",
};

export default configs;
