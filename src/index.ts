import { Elysia } from "elysia";
import { bridge } from "./routes/bridge";
import { cacheRoutes } from "./routes/cacheRoutes";
import { cacheUser } from "./routes/cacheUserBalances";
import { Cache } from "./dto/cache";

const app = new Elysia()
  .decorate('cache', new Cache())
  .use(bridge)
  .use(cacheRoutes)
  .use(cacheUser)
  .get("/ping","pong")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
