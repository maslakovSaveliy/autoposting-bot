import { Telegraf, session } from "telegraf";
import config from "config";
import { adminCheck } from "./utils.js";
import { getMainMenu } from "./keyboard.js";
import { pars } from "./pars.js";
import { openai } from "./openai.js";

const channelID = config.get("CHANNEL_ID");
let chatId = "";
let post = "";
let msg = { id: "" };

const bot = new Telegraf(config.get("BOT_TOKEN"), { handlerTimeout: Infinity });

bot.use(adminCheck);
bot.use(session());

bot.start(async (ctx) => {
  ctx.reply("Бот запущен");
  chatId = ctx.chat.id;
  post = await openai.generatePost(await pars.getPost());
  const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
  msg.id = msgId;
});

bot.action("post", async (ctx) => {
  bot.telegram.sendMessage(channelID, post);
  ctx.deleteMessage(msg.id);
});

bot.action("edit", async (ctx) => {
  ctx.deleteMessage(msg.id);
  post = await openai.reGeneratePost();
  const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
  msg.id = msgId;
});

bot.action("decline", async (ctx) => {
  post = "";
  ctx.deleteMessage(msg.id);
});

bot.action("new", async (ctx) => {
  ctx.deleteMessage(msg.id);
  post = await openai.generatePost(await pars.getNewPost());
  const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
  msg.id = msgId;
});

// test command
bot.command("prompt", (ctx) => {
  const data = ctx.message.text.split(" ").slice(1).join(" ");
  openai.changePrompt(data);
  ctx.reply("Ваш промпт: " + data);
});

setInterval(async () => {
  if (chatId !== "" || msg.id !== "") {
    post = await openai.generatePost(await pars.getPost());
    const { msgId } = bot.telegram.sendMessage(chatId, post, getMainMenu());
    msg.id = msgId;
  }
}, 86400000); // 86400000 - сутки

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
