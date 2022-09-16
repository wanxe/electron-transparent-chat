import { reactive } from 'vue';
import tmi from 'tmi.js';
import { TwitchMessage } from '../typings/types';
const TW_USERNAME = import.meta.env.VITE_TW_USERNAME;

const client = new tmi.Client({
  channels: [TW_USERNAME],
  connection: {
    reconnect: true,
    secure: true,
  },
});
await client.connect();

const parseMessage = ({ message, emotes }): string => {
  if (!emotes) return message;
  const stringReplacements = [];
  Object.entries(emotes).forEach(([, positions]) => {
    const position = positions[0];
    const [start, end] = position.split("-");
    const messageString = message.substring(
      parseInt(start),
      parseInt(end) + 1
    );

    stringReplacements.push(messageString);
  });

  return stringReplacements.reduce((acc, stringToReplace) => acc.replaceAll(stringToReplace, ''),  message);
};

const getEmotesMapping = (emotes: Record<string, string[]>) => {
  if (!emotes) return [];

  // TODO get 7TV and more...
  return Object.keys(emotes)
    .map(key => {
      return emotes[key].reduce((acc, item) => {
        acc.push(`https://static-cdn.jtvnw.net/emoticons/v2/${key}/default/dark/1.0?v=${item}`);

        return acc;
      }, []);
    }).flat();
};

export function useChatClient (): { messages: TwitchMessage[] } {
  console.log('connecting to twitch with the username: ', TW_USERNAME);
  const messages = reactive<TwitchMessage[]>([]);

  client.on('message', (channel, ctx, message, self) => {
    if (self) return;
    const emotes = ctx.emotes;
    const emotesMapping = getEmotesMapping(emotes);

    messages.push({
      id: ctx.id,
      userName: ctx['display-name'],
      createdAt: ctx['tmi-sent-ts'],
      color: ctx.color,
      type: ctx['message-type'],
      emotes: emotesMapping,
      message: parseMessage({
        message,
        emotes,
      }),
    });
  });

  return {
    messages,
  };
}
