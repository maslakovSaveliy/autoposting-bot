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
        model: "gpt-3.5-turbo",
        messages: [...this.chat],
      });
      return res.choices[0].message.content;
    } catch (e) {
      console.log(e.message);
    }
  }

  async generatePost(post) {
    try {
      const max_size = 4096;
      var messageString = post.description;

      var amount_sliced = messageString.length / max_size;
      var start = 0;
      var end = max_size;
      var message;
      var messagesArray = [];

      for (let i = 0; i < amount_sliced; i++) {
        message = messageString.slice(start, end);
        messages.push(message);
        start = start + max_size;
        end = end + max_size;
      }

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
          content:
            `Ты популярный новостной журналист. Тебе нужно написать новостной пост в свои соц сети, в котором ты будешь обсуждать и рассказывать про новость. У меня уже есть новость для тебя:` +
            `\n` +
            `${post.title}.`,
        },
        ...messagesArray.map((item) => {
          return { role: this.roles.USER, content: item + `\n` };
        }),
        {
          role: this.roles.USER,
          content: `Ответь мне уже готовым новостным постом. Уникальность должна быть 90%. Пиши на русском языке. Должно быть меньше 1000 символов. ${this.prompt}`,
        },
      ];
      const res = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: this.chat,
      });
      return res.choices[0].message.content;
    } catch (e) {
      console.log(e.message);
    }
  }
}

export const openai = new OpenAIService(config.get("OPENAI_KEY"));
