import { Configuration, OpenAIApi } from 'openai';
import config from "config";

const configuration = new Configuration({
  apiKey: config.get('OPEN_AI_KEY'),
});

export const openai = new OpenAIApi(configuration);
