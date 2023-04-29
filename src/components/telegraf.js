import { Telegraf, session } from 'telegraf';
import { TG_TOKEN } from '../constants/TG_TOKEN.js';
import config from 'config'

export const bot = new Telegraf(config.get('TG_TOKEN'))
export const appSession = session()
