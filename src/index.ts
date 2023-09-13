import { Bot } from 'grammy/web';
import Env from './env';

const formatMessage = (message: PlusofonMessage) => `<b>От кого:</b> <pre>+${message.src_number}</pre>\n`
  + `<b>Кому:</b> <pre>+${message.dst_number}</pre>\n`
  + '\n'
  + `<pre>${message.content}</pre>`;

interface PlusofonMessage {
  src_number: string;
  dst_number: string;
  content: string;
  date: string;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.headers.get('x-telegram-bot-api-secret-token') === env.TELEGRAM_SECRET) {
      return new Response(null, { status: 403 });
    }

    if (req.method !== 'POST') {
      return new Response(null, { status: 405 });
    }

    if (req.headers.get('content-type') !== 'application/json') {
      return new Response(null, { status: 415 });
    }

    const body = await req.json();
    const message = body as PlusofonMessage;

    const bot = new Bot(env.TELEGRAM_TOKEN);

    const recipients = env.TELEGRAM_RECEPIENTS.split(',')
      .map((recepient) => parseInt(recepient, 10));

    for (const recipient of recipients) {
      // eslint-disable-next-line no-await-in-loop
      await bot.api.sendMessage(
        recipient,
        formatMessage(message),
        {
          parse_mode: 'HTML',
        },
      );
    }

    return Response.json({
      ok: true,
    });

    // if (req.headers.get('x-telegram-bot-api-secret-token') === env.TELEGRAM_SECRET) {
    //   const bot = new Bot(env.TELEGRAM_TOKEN);
    //   await handleBotUpdate(bot, env);
    //   return webhookCallback(bot, 'cloudflare-mod', { secretToken: env.TELEGRAM_SECRET })(req);
    // }

    // return handleNonBotRequest(req, env);
  },
};
