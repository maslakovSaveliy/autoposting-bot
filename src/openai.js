import OpenAI from "openai";
import config from "config";

class OpenAIService {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
  };

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generatePost(post) {
    try {
      const res = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: this.roles.USER,
            content: "Привет",
          },
          {
            role: this.roles.ASSISTANT,
            content: "Привет! Как я могу помочь тебе сегодня?",
          },
          {
            role: this.roles.USER,
            content: `Тебе нужно написать новостной пост. Он должен состоять из заголовка и текста. У меня уже есть новость которую ты должен переписать. Заголовок: ${post.title}. Текст: ${post.description}. Ответь мне уже готовым новостным постом`,
          },
        ],
      });
      return res.choices[0].message.content;
    } catch (e) {
      console.log(e.message);
    }
  }
}

export const openai = new OpenAIService(config.get("OPENAI_KEY"));
