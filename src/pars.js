import puppeteer from "puppeteer";

async function getPost() {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto("https://habr.com/ru/news/");

  const post = await page.evaluate(() => {
    const postContainer = document.querySelectorAll(".tm-articles-list__item");
    const titleElement = postContainer[0].querySelector(".tm-title_h2");
    const descriptionElement = postContainer[0].querySelector(
      ".article-formatted-body"
    );

    return {
      title: titleElement.innerText,
      description: descriptionElement.innerText,
    };
  });

  await browser.close();

  return post;
}

export default getPost;
