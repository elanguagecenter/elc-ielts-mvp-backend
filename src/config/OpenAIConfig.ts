import OpenAI from "openai";
import configs from "./configs";

const OpenAISource = new OpenAI({
  apiKey: configs.openAIAPIKey,
});

export default OpenAISource;
