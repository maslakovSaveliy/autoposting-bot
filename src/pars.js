import config from "config";
import axios from "axios";
import { JSDOM } from "jsdom";

class Pars {
  async getPost() {
    const rndmN = Math.floor(Math.random() * 5);

    if (rndmN === 0) {
      const url = "https://www.socialmediatoday.com";

      const postUrl = await axios.get(url).then((res) => {
        const randomNum = Math.floor(Math.random() * 5);
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const news = dom.window.document
          .querySelectorAll(".top-stories ol")[0]
          .querySelectorAll("li h3 a")
          [randomNum].getAttribute("href");

        return news;
      });

      const post = await axios.get(url + postUrl).then((res) => {
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const title = dom.window.document.querySelectorAll(
          ".display-heading-04"
        )[0].textContent;

        const descriptionParagraphs = dom.window.document.querySelectorAll(
          ".article-body p span span span"
        );
        let description = "";
        for (let i = descriptionParagraphs.length - 1; i >= 0; i--) {
          description += ` ${descriptionParagraphs[i].textContent}`;
        }

        const img = dom.window.document
          .querySelectorAll(".article-body")[0]
          .querySelectorAll("img")[0]
          .getAttribute("src");

        return {
          title,
          description,
          url: url + postUrl,
          media: img ? url + img : null,
        };
      });

      return post;
    } else if (rndmN === 1) {
      const url = "https://www.marketingdive.com";

      const postUrl = await axios.get(url).then((res) => {
        const randomNum = Math.floor(Math.random() * 4);
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const news = dom.window.document
          .querySelectorAll(".sidebar-box-list")[0]
          .querySelectorAll("li div")
          [randomNum].querySelectorAll("a")[0]
          .getAttribute("href");

        return news;
      });

      const post = await axios.get(url + postUrl).then((res) => {
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const title = dom.window.document.querySelectorAll(
          ".display-heading-04"
        )[0].textContent;

        const descriptionParagraphs =
          dom.window.document.querySelectorAll(".article-body p");
        let description = "";
        for (let i = descriptionParagraphs.length - 1; i >= 0; i--) {
          description += ` ${descriptionParagraphs[i].textContent}`;
        }

        const img = dom.window.document
          .querySelectorAll(".figure_content")[0]
          .querySelectorAll("img")[0]
          .getAttribute("src");

        return {
          title,
          description,
          url: url + postUrl,
          media: img ? url + img : null,
        };
      });

      return post;
    } else if (rndmN === 2) {
      const url = "https://www.marketingweek.com";
      let img;

      const postUrl = await axios.get(url).then((res) => {
        const randomNum = Math.floor(Math.random() * 6);
        const curPage = res.data;
        const dom = new JSDOM(curPage);
        const news = dom.window.document
          .querySelectorAll(
            "article:not(.sponsor-subscriber-exclusive) .hentry-title a"
          )
          [randomNum].getAttribute("href");

        img = dom.window.document.querySelectorAll(
          "article:not(.sponsor-subscriber-exclusive) .thumb a img"
        )[randomNum];

        return news;
      });

      const post = await axios.get(postUrl).then((res) => {
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const title = dom.window.document.querySelectorAll(
          ".article-header .page-title"
        )[0].textContent;

        const descriptionParagraphs =
          dom.window.document.querySelectorAll(".content p");
        let description = "";
        for (let i = descriptionParagraphs.length - 1; i >= 0; i--) {
          description += ` ${descriptionParagraphs[i].textContent}`;
        }

        if (!img) {
          img = dom.window.document.querySelectorAll(".content figure  img")[0];
        }

        return {
          title,
          description,
          url: postUrl,
          media: img ? img.getAttribute("src") : null,
        };
      });

      return post;
    } else if (rndmN === 3) {
      const url = "https://adindex.ru/news/marketing";

      const postUrl = await axios.get(url).then((res) => {
        const randomNum = Math.floor(Math.random() * 3);
        const curPage = res.data;
        const dom = new JSDOM(curPage);
        const news = dom.window.document
          .querySelectorAll(".newsfeed__list-item-title a")
          [randomNum].getAttribute("href")
          .replace("/news/marketing", "");

        return news;
      });

      const post = await axios.get(url + postUrl).then((res) => {
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const title =
          dom.window.document.querySelectorAll(".page-title")[0].textContent;

        const descriptionParagraphs =
          dom.window.document.querySelectorAll(".news-text p");
        let description = "";
        for (let i = descriptionParagraphs.length - 1; i >= 0; i--) {
          description += ` ${descriptionParagraphs[i].textContent}`;
        }

        return {
          title,
          description,
          url: url + postUrl,
          media: null,
        };
      });

      return post;
    } else if (rndmN === 4) {
      const url = "https://www.forbes.ru";

      const postUrl = await axios.get(url + "/tegi/marketing").then((res) => {
        const randomNum = Math.floor(Math.random() * 3);
        const curPage = res.data;
        const dom = new JSDOM(curPage);
        const news = dom.window.document.body
          .querySelectorAll(".Sa7ru")
          [randomNum].querySelectorAll("a")[1]
          .getAttribute("href");

        return news;
      });

      const post = await axios.get(url + postUrl).then((res) => {
        const curPage = res.data;
        const dom = new JSDOM(curPage);

        const title =
          dom.window.document.querySelectorAll(".T16gd")[0].textContent;

        const descriptionParagraphs =
          dom.window.document.querySelectorAll(".CFaZ3 p");
        let description = "";
        for (let i = descriptionParagraphs.length - 1; i >= 0; i--) {
          description += ` ${descriptionParagraphs[i].textContent}`;
        }

        const img = dom.window.document.querySelectorAll(".Dzdg3 div  img")[0];

        return {
          title,
          description,
          url: url + postUrl,
          media: img ? img.getAttribute("src") : null,
        };
      });

      return post;
    }
  }
}

export const pars = new Pars();
