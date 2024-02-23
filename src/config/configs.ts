const configs = {
  port: process.env.PORT,
  serverUrl: process.env.SERVER_URL,
  dbUrl: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SCHEMA}?schema=${process.env.DB_PORT}`,
  awsCognitoJwk: process.env.AWS_COGNITO_JWK || "{}",
};

export default configs;
