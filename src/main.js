import { appSession, bot } from "./components/telegraf.js";
import { message } from "telegraf/filters";
import { oggConverter } from "./components/oggConverter.js";
import { openai } from "./components/openAI.js";
import { code } from "telegraf/format";
import { INITIAL_SESSION }  from "./constants/INITIAL_SESSION.js";
import { LISTENERS } from "./constants/LISTENERS.js";
import { OPEN_AI_ROLES } from "./constants/OPEN_AI_ROLES.js";

bot.use(appSession)

bot.command(LISTENERS.START, async (ctx) => {
  ctx.session ? ctx.session.messages = [] : ctx.session = INITIAL_SESSION

  try {
    await ctx.reply(code(`Привет, ${ctx.message.from.first_name}! Добро пожаловать к ручному GPT!`))
  } catch (e) {
    console.log(e.message)
    ctx.reply(JSON.stringify(e.message))
  }
})

bot.command(LISTENERS.NEW, async (ctx) => {
  ctx.session ? ctx.session.messages = [] : ctx.session = INITIAL_SESSION

  try {
    await ctx.reply(code(`Ну штош, ${ctx.message.from.first_name}! Давай поговорим о чем нибудь другом!`))
  } catch (e) {
    console.log(e.message)
    ctx.reply(JSON.stringify(e.message))
  }
})

bot.on(message(LISTENERS.TEXT), async (ctx) => {
  ctx.session ??= INITIAL_SESSION

  try {
    ctx.reply(code('Запрос обрабатывается...'))

    const text = await ctx.message.text
    const sessionMessages = ctx.session.messages

    sessionMessages.push({ role: OPEN_AI_ROLES.USER, content: text })

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: sessionMessages,
    })

    const answerAI = completion.data.choices[0].message.content

    sessionMessages.push({ role: OPEN_AI_ROLES.ASSISTANT, content: answerAI })
    await ctx.reply(answerAI)
  } catch (e) {
    console.log(e.message)
    ctx.reply(e.status)
    ctx.reply(e.message)
  }
})

bot.on(message(LISTENERS.VOICE), async (ctx) => {
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

bot.on(message(LISTENERS.STICKER), async (ctx) => {
  console.log(ctx.message)
  ctx.reply(ctx.entries('sticker_id'))

  await ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch()
  .then(() => {})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
