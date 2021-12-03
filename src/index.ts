import Discord from 'discord.js';
import dotenv from 'dotenv';
import MemeConfig from './meme-config.interface';
import config from './config.json';

dotenv.config();

const token = process.env['NODE_ENV'] === 'development' ?
  process.env['DISCORD_DEV_TOKEN'] :
  process.env['DISCORD_PROD_TOKEN'];
const client = new Discord.Client();
const memes = new Map<string, MemeConfig>();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}`);

  for (const meme of config as MemeConfig[]) {
    memes.set(meme.name, meme);
  }
});

client.on('message', message => {
  console.log(message.content);
});

client.login(token).catch(console.error);
