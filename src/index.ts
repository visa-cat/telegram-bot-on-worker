import { Bot } from 'grammy/web';
import Env from './env';

const formatNumber = (number: unknown) => {
  if (Number.isInteger(number)) {
    return `+${number}`;
  }

  return number;
};

const formatMessage = (message: PlusofonMessage) => {
  const result = `<b>От кого:</b> <code>${formatNumber(message.src_number)}</code>\n`
    + `<b>Кому:</b> <code>+${formatNumber(message.dst_number)}</code>\n`
    + '\n'
    + `<pre>${message.content}</pre>`;

  return result;
};

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
      try {
        // eslint-disable-next-line no-await-in-loop
        await bot.api.sendMessage(
          recipient,
          formatMessage(message),
          {
            parse_mode: 'HTML',
          },
        );
      } catch (e) {
        console.warn(`Failed to send message to ${recipient}`, e);
      }
    }

    return new Response(null, { status: 200 });
  },
};
