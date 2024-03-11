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

    return {
      title: post.title,
      description: post.abstract,
      url: post.url,
      media: post.multimedia ? post.multimedia[2] : null,
    };
  }

  async getNewPost() {
    let post = {};
    const rndmN = Math.round(Math.random());

    switch (rndmN) {
      case 0:
        const habrPost = await axios
          .get("https://habr.com/ru/flows/marketing/articles/")
          .then((res) => {
            const randomNum = Math.floor(Math.random() * 10);
            const curPage = res.data;
            const dom = new JSDOM(curPage);

            const postContainer = dom.window.document.querySelectorAll(
              ".tm-articles-list__item"
            );

            const titleElement =
              postContainer[randomNum].querySelector(".tm-title_h2");

            const descriptionElement = postContainer[randomNum].querySelector(
              ".article-formatted-body"
            );

            const url = postContainer[randomNum]
              .querySelector(".tm-article-snippet__readmore")
              .getAttribute("href");

            const img = postContainer[randomNum].querySelector(
              ".tm-article-snippet__lead-image"
            );
            return {
              title: titleElement.textContent,
              description: descriptionElement.textContent,
              url: "https://habr.com" + url,
              media: img ? img.getAttribute("src") : null,
            };
          });

        post = habrPost;
        break;

      case 1:
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

            const url = elements
              .getElementsByClassName("w-full")
              [randomNum].querySelectorAll("div > a")[0]
              .getAttribute("href");

            const img = elements
              .getElementsByClassName("w-full")
              [randomNum].querySelectorAll("div > a > div")[0]
              .querySelector("img")
              .getAttribute("src");

            return {
              title: article.textContent.trim(),
              description: description.textContent,
              url: "https://mashable.com" + url,
              media: img,
            };
          });
        post = res;
        break;
    }
    return post;
  }
}

export const pars = new Pars();
