import OpenAI from "openai";
import config from "config";

class OpenAIService {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
  };

  chat = [];

  prompt =
    "Твоя целевая аудитория это люди 18-30 лет. Их интересует маркетинг, IT и СММ. Должно быть минимум 3 абзаца. Нужно чтобы те люди, которые прочитали твою новость, могли узнать в простой форме о том, что произошло. Используй хэштеги и яркий слоган.";

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  changePrompt(prompt) {
    this.prompt = prompt;
  }
  defaultPrompt() {
    this.prompt =
      "Твоя целевая аудитория это люди 18-30 лет. Их интересует маркетинг, IT и СММ. Должно быть минимум 3 абзаца. Нужно чтобы те люди, которые прочитали твою новость, могли узнать в простой форме о том, что произошло. Используй хэштеги и яркий слоган.";
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
          content: `Ты популярный новостной журналист. Тебе нужно написать новостной пост в свои соц сети, в котором ты будешь обсуждать и рассказывать про новость. У меня уже есть новость для тебя:\n${post.title}.\n${post.description}.\nОтветь мне уже готовым новостным постом. Уникальность должна быть 90%. Пиши на русском языке. ${this.prompt}`,
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
