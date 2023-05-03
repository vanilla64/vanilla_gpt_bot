import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

export const openai = new OpenAIApi(configuration);
