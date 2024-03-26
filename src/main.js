import { Telegraf, session } from "telegraf";
import config from "config";
import { adminCheck } from "./utils.js";
import { getMainMenu } from "./keyboard.js";
import { pars } from "./pars.js";
import { openai } from "./openai.js";

const channelID = config.get("CHANNEL_ID");
let chatId = "";
let post = "";
let news = {};
let msg = { id: "" };

const bot = new Telegraf(config.get("BOT_TOKEN"), { handlerTimeout: Infinity });

bot.use(adminCheck);
bot.use(session());

bot.start(async (ctx) => {
  ctx.reply("Бот запущен");
  chatId = ctx.chat.id;
  news = await pars.getPost();
  post = await openai.generatePost(news);
  if (news.media) {
    const { msgId } = bot.telegram.sendPhoto(chatId, news.media, {
      caption: `${post}\n\nИсточник: ${news.url}`,
      reply_markup: getMainMenu().reply_markup,
    });
    msg.id = msgId;
  } else {
    const { msgId } = bot.telegram.sendMessage(
      chatId,
      `${post}\n\nИсточник: ${news.url}`,
      getMainMenu()
    );
    msg.id = msgId;
  }
});

bot.action("post", async (ctx) => {
  if (news.media) {
    bot.telegram.sendPhoto(channelID, news.media, {
      caption: `${post}\n\nИсточник: ${news.url}`,
    });
  } else {
    bot.telegram.sendMessage(channelID, `${post}\n\nИсточник: ${news.url}`);
  }
  ctx.deleteMessage(msg.id);
});

bot.action("edit", async (ctx) => {
  ctx.deleteMessage(msg.id);
  post = await openai.reGeneratePost();
  if (news.media) {
    const { msgId } = bot.telegram.sendPhoto(chatId, news.media, {
      caption: `${post}\n\nИсточник: ${news.url}`,
      reply_markup: getMainMenu().reply_markup,
    });
    msg.id = msgId;
  } else {
    const { msgId } = bot.telegram.sendMessage(
      chatId,
      `${post}\n\nИсточник: ${news.url}`,
      getMainMenu()
    );
    msg.id = msgId;
  }
});

bot.action("decline", async (ctx) => {
  post = "";
  ctx.deleteMessage(msg.id);
});

bot.action("new", async (ctx) => {
  ctx.deleteMessage(msg.id);
  news = await pars.getPost();
  post = await openai.generatePost(news);
  if (news.media) {
    const { msgId } = bot.telegram.sendPhoto(chatId, news.media, {
      caption: `${post}\n\nИсточник: ${news.url}`,
      reply_markup: getMainMenu().reply_markup,
    });
    msg.id = msgId;
  } else {
    const { msgId } = bot.telegram.sendMessage(
      chatId,
      `${post}\n\nИсточник: ${news.url}`,
      getMainMenu()
    );
    msg.id = msgId;
  }
});

// test command
bot.command("prompt", (ctx) => {
  const data = ctx.message.text.split(" ").slice(1).join(" ");
  openai.changePrompt(data);
  ctx.reply("Ваш промпт: " + data);
});

bot.command("defaultPrompt", (ctx) => {
  openai.defaultPrompt();
  ctx.reply("Установлен промпт по умолчанию: " + openai.prompt);
});

setInterval(async () => {
  if (chatId !== "" || msg.id !== "") {
    news = await pars.getPost();
    post = await openai.generatePost(news);
    if (news.media) {
      const { msgId } = bot.telegram.sendPhoto(chatId, news.media, {
        caption: `${post}\n\nИсточник: ${news.url}`,
        reply_markup: getMainMenu().reply_markup,
      });
      msg.id = msgId;
    } else {
      const { msgId } = bot.telegram.sendMessage(
        chatId,
        `${post}\n\nИсточник: ${news.url}`,
        getMainMenu()
      );
      msg.id = msgId;
    }
  }
}, 86400000); // 86400000 - сутки

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
