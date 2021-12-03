import Discord from 'discord.js';
import dotenv from 'dotenv';
import MemeConfig from './meme-config.interface';
import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';

dotenv.config();

const IMAGE_WIDTH = 500;
const FONT_FAMILY = 'Roboto';

const token = process.env['NODE_ENV'] === 'development' ?
  process.env['DISCORD_DEV_TOKEN'] :
  process.env['DISCORD_PROD_TOKEN'];
const client = new Discord.Client();
const memes = new Map<string, MemeConfig>();

registerFont('./src/fonts/roboto.ttf', { family: FONT_FAMILY });

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

client.on('message', async message => {
  if (message.content.startsWith('!meme')) {
    const memeName = message.content.split(' ')[1];
    const text = message.content.substring(message.content.indexOf(' ', 6));

    if (!memes.has(memeName)) {
      message.channel.send("That meme doesn't exist!")
        .catch(console.error);
    } else if (!text) {
      message.channel.send('No text provided!')
        .catch(console.error);
    } else {
      const meme = memes.get(memeName)!;
      const attachment = new Discord.MessageAttachment(await drawImage(meme, text), `${meme.name}.png`);

      message.channel.send(attachment)
        .catch(console.error);
    }
  }
});

client.login(token).catch(console.error);

async function drawImage(meme: MemeConfig, text: string): Promise<Buffer> {
  const image = await loadImage(`images/${meme.filename}`);

  const canvas = createCanvas(IMAGE_WIDTH, image.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);

  ctx.font = `30px ${FONT_FAMILY}`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(text, IMAGE_WIDTH / 2, image.height - 20);

  ctx.strokeStyle = 'black';
  ctx.strokeText(text, IMAGE_WIDTH / 2, image.height - 20);

  return canvas.toBuffer();
}
