import { bot } from "./components/telegraf.js";
import { message } from "telegraf/filters";
import { oggConverter } from "./components/oggConverter.js";
import { openai } from "./components/openAI.js";
import {code} from "telegraf/format";

bot.command('start', async (ctx) => {
  try {
    await ctx.reply(code(`Привет, ${ctx.message.from.first_name}! Добро пожаловать к ручному GPT!`))
  } catch (e) {
    console.log(e.message)
    ctx.reply(JSON.stringify(e.message))
  }
})

bot.on(message('voice'), async (ctx) => {
  try {
    // await ctx.reply(JSON.stringify(ctx.message.voice, null, 2))

    const userId = String(ctx.message.from.id)
    const voiceLink = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

    const oggPath = await oggConverter.saveOgg(voiceLink.href, userId)
    const mp3Path = await oggConverter.convertToMp3(oggPath, userId)

    await ctx.reply(oggPath)
  } catch (e) {
    console.log(e.message)
    ctx.reply(JSON.stringify(e.message))
  }
})

bot.on(message('text'), async (ctx) => {
  try {
    ctx.reply(code('Запрос обрабатывается...'))

    const text = await ctx.message.text
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{role: 'user', content: text}],
    })

    await ctx.reply(completion.data.choices[0].message.content);
  } catch (e) {
    console.log(e.message)
    ctx.reply(e.status)
    ctx.reply(e.message)
  }
})

bot.on(message('sticker'), async (ctx) => {
  console.log(ctx.message)
  ctx.reply(ctx.entries('sticker_id'))

  await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch()
  .then(() => {})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
