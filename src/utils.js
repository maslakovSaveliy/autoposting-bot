import config from "config";

export async function adminCheck(ctx, next) {
  if (ctx.from.username === config.get("ADMIN")) {
    next();
  }
}
