import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { adminCheck } from "./utils.js";
import { getMainMenu } from "./keyboard.js";
import getPost from "./pars.js";
import { openai } from "./openai.js";

const channelID = config.get("CHANNEL_ID");
let chatId = "";
let post = "";
let msg = { id: "" };

const bot = new Telegraf(config.get("BOT_TOKEN"), { handlerTimeout: Infinity });

bot.use(adminCheck);
bot.use(session());

bot.start(async (ctx) => {
  ctx.reply("Hi");
  chatId = ctx.chat.id;
  post = await openai.generatePost(await getPost());
  const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
  msg.id = msgId;
});

bot.action("post", async (ctx) => {
  bot.telegram.sendMessage(channelID, post);
  ctx.deleteMessage(msg.id);
});

bot.action("edit", async (ctx) => {
  post = await openai.reGeneratePost(await getPost());
  const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
  msg.id = msgId;
  ctx.deleteMessage(msg.id);
});

bot.action("decline", async (ctx) => {
  post = "";
  ctx.deleteMessage(msg.id);
});

bot.on(message("text"), async (ctx) => {
  bot.telegram.sendMessage(channelID, ctx.message.text);
});

setInterval(async () => {
  if (chatId !== "" || msg.id !== "") {
    post = await openai.generatePost(await getPost());
    const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
    msg.id = msgId;
  }
}, 6000); // 86400000 - сутки

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
