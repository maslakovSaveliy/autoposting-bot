import config from "config";
import axios from "axios";
import { JSDOM } from "jsdom";

class Pars {
  async getPost() {
    const treds = ["technology", "business", "media"];
    const randomNum = Math.floor(Math.random() * 3);

    const post = await fetch(
      `https://api.nytimes.com/svc/news/v3/content/all/${
        treds[randomNum]
      }.json?api-key=${config.get("NYT_KEY")}`
    )
      .then((res) => res.json())
      .then((data) => {
        const randomNum = Math.floor(Math.random() * 6);
        return data.results[randomNum];
      })
      .catch((e) => console.log(e));

    return { title: post.title, description: post.abstract };
  }

  async getNewPost() {
    const res = await axios
      .get("https://mashable.com/category/social-good")
      .then((res) => {
        const curPage = res.data;
        const dom = new JSDOM(curPage);
        const elements = dom.window.document.querySelector(
          "body > main > section > section > div"
        );
        const randomNum = Math.floor(Math.random() * 25) * 3;
        const article = elements
          .getElementsByClassName("w-full")
          [randomNum].querySelectorAll("div > div > a")[0];
        const description = elements
          .getElementsByClassName("w-full")
          [randomNum].getElementsByClassName("hidden")[0];
        return {
          title: article.textContent.trim(),
          description: description.textContent,
        };
      });
    return res;
  }
}

export const pars = new Pars();
