import { Markup } from "telegraf";

export function getMainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("Опубликовать", "post"),
      Markup.button.callback("Редактировать", "edit"),
      Markup.button.callback("Отклонить", "decline"),
    ],
    [Markup.button.callback("Получить другую новость", "new")],
  ]).resize();
}
