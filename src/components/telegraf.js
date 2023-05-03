import { Telegraf, session } from 'telegraf';
import * as dotenv from 'dotenv'

dotenv.config()

export const bot = new Telegraf(process.env.TG_TOKEN)
export const appSession = session()
