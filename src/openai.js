import OpenAI from "openai";
import config from "config";

class OpenAIService {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
  };

  chat = [];

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async reGeneratePost() {
    try {
      this.chat.push({
        role: this.roles.USER,
        content: `Перепиши этот пост`,
      });
      const res = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [...this.chat],
      });
      return res.choices[0].message.content;
    } catch (e) {
      console.log(e.message);
    }
  }

  async generatePost(post) {
    try {
      this.chat = [
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
          content: `Тебе нужно написать новостной пост. У меня уже есть новость которую ты должен переписать:\n${post.title}.\n${post.description}.\nОтветь мне уже готовым новостным постом`,
        },
      ];
      const res = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: this.chat,
      });
      return res.choices[0].message.content;
    } catch (e) {
      console.log(e.message);
    }
  }
}

export const openai = new OpenAIService(config.get("OPENAI_KEY"));
