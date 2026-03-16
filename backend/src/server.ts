import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`EZY Smart Shop API listening on port ${env.port}`);
});

