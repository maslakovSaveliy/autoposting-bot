import { pars } from "./pars.js";

const test = async () => {
  const post = await pars.getPost();
  console.log(post);
};

test();
