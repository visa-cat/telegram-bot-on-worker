import { Bot } from 'grammy/web';
import Env from './env';

export async function handleBotUpdate(
  bot: Bot,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  env: Env,
): Promise<void> {
  // Example of using Worker KV
  // See https://developers.cloudflare.com/workers/wrangler/workers-kv/
  // and https://developers.cloudflare.com/workers/runtime-apis/kv/
  //
  // await env.BINDING_NAME_1.put('hello', 'world');

  // Example of adding a command handler with [grammY](https://grammy.dev/).
  // See https://grammy.dev/guide/basics.html

  const url = new URL('https://restapi.plusofon.ru/api/v1/sms');

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Client: '10553',
    Authorization: `Bearer ${env.PLUSOFON_TOKEN}`,
  };

  const body: Record<string, string> = {};

  body.incoming = '0';
  // {
  //   // date_from: 'alias',
  //   // date_to: 'natus',
  //   // incoming: 3,
  //   // receiver: 'facere',
  //   // sender: 'rem',
  //   // limit: 18,
  //   incoming: 0,
  // };

  url.search = new URLSearchParams(body).toString();

  const response = await fetch(url, {
    headers,
    // body: JSON.stringify(body),
  });

  bot.command('start', async (ctx) => {
    console.log(await response.json());
    await ctx.reply(`<pre>${JSON.stringify(await response.json(), null, 2)}</pre>`, {
      parse_mode: 'HTML',
    });
  });
}

export async function handleBotCronEvent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bot: Bot,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  env: Env,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ctrl: ScheduledController,
): Promise<void> {
  // Handle worker cron events here

  // bot.api.sendMessage(1145141919810, 'Hello, world!');
}

export async function handleNonBotRequest(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  env: Env,
): Promise<Response> {
  // Request not having the correct secret token is handled here
  return new Response(null, { status: 403 });
}
