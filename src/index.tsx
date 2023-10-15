import { ws } from 'elysia/ws'
import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { db } from "./db";
import { Todo, todos } from "./db/schema";
import { eq } from "drizzle-orm";
import * as tmi from 'tmi.js';
import { onMessageHandler, onMessageHandlerWS, onConnectedHandler } from './widgets/twitch';
import NotificationsConnector from './templates/NotificationsConnector';
import ChatRoomConnector from './templates/ChatRoomConnector';
import ChatRoom from './partials/Chatroom';
import WordHolder from './partials/WordHolder';
import Notifications from './partials/Notifications';

const opts = {
  identity: {
    username: 'jd4codes_chat_game',
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    'jd4codes'
  ]
};

const client = new tmi.client(opts);

client.on('connected', onConnectedHandler)
client.on('message',(target, context, msg, self) => onMessageHandler(target, context, msg, self, client))

client.connect();

const app = new Elysia()
  .use(html())
  .use(ws())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body
          class="flex w-full h-screen justify-center items-center bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ..."
          hx-get="/wordgame"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
      </BaseHtml>
    )
  )
  .get("/wordgame", async () => {
    // const data = await db.select().from(todos).all();
    return (
      <span>
        <NotificationsConnector>
          <Notifications>Waiting for a word...</Notifications>
          <br /><br />
          <WordHolder />
        </NotificationsConnector>
          <br /><br />
        <ChatRoomConnector>
          <ChatRoom>Type !word or !word # in the chat. Ex: !word or !word 4</ChatRoom>
        </ChatRoomConnector>
      </span>
    );
  })
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"));

app.ws('/ws', {
  open(ws) {
    console.log('connected')

    client.on('message', (target, context, msg, self) => {
      if (self) {return;}

      onMessageHandlerWS(target, context, msg, self, ws)

    })

  }
})
app.listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JD Chat Game</title>
  <script src="https://unpkg.com/htmx.org@1.9.6"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/ws.js"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;
