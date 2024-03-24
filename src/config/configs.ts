const configs = {
  port: process.env.PORT,
  serverUrl: process.env.SERVER_URL,
  dbUrl: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=${process.env.DB_SCHEMA}`,
  awsCognitoJwk: process.env.AWS_COGNITO_JWK || "{}",
  ffmpegPath: process.env.FFMPEG_PATH || "ffmpeg",
  mediaOutBasepath: process.env.MEDIA_OUT_BASEPATH || "./",
  openAIAPIKey: process.env.CHAT_GPT_APIKEY,
};

export default configs;
