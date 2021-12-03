import Discord from 'discord.js';
import dotenv from 'dotenv';
import MemeConfig from './meme-config.interface';
import fs from 'fs';

dotenv.config();

const token = process.env['NODE_ENV'] === 'development' ?
  process.env['DISCORD_DEV_TOKEN'] :
  process.env['DISCORD_PROD_TOKEN'];
const client = new Discord.Client();
const memes = new Map<string, MemeConfig>();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}`);

  if (!fs.existsSync('./src/config.json')) {
    fs.copyFileSync('./src/config.template.json', './src/config.json');
    console.log('Created config.json');
  }

  const config: MemeConfig[] = JSON.parse(fs.readFileSync('./src/config.json', 'utf8'));

  for (const meme of config) {
    memes.set(meme.name, meme);
  }
});

client.on('message', message => {
  console.log(message.content);
});

client.login(token).catch(console.error);
