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

  initMemes();
});

client.on('message', async message => {
  if (message.content.startsWith('!say config')) {
    const text = message.content.indexOf(' ', 10) != -1
      ? message.content.substring(message.content.indexOf(' ', 10) + 1)
      : '';

    config(text, message);
  } else if (message.content.startsWith('!say')) {
    const memeName = message.content.split(' ')[1];
    const text = message.content.indexOf(' ', 5) !== -1
      ? message.content.substring(message.content.indexOf(' ', 6) + 1)
      : '';

    try {
      new URL(memeName);
      sendMeme(memeName, text, message);
    } catch {
      if (!memes.has(memeName)) {
        message.channel.send('That meme doesn\'t exist!')
          .catch(console.error);
      } else {
        sendMeme(memes.get(memeName)!, text, message);
      }
    }
  } else {
    for (const memeValue of Array.from(memes.values())) {
      if (memeValue.customPrefix !== undefined && message.content.startsWith(memeValue.customPrefix)) {
        const text = message.content.indexOf(' ') !== -1
          ? message.content.substring(message.content.indexOf(' ') + 1)
          : '';

        sendMeme(memeValue, text, message);
      }
    }
  }
});

client.login(token).catch(console.error);

function config(text: string, message: Discord.Message): void {
  if (!message.member?.hasPermission('ADMINISTRATOR')) {
    message.channel.send("You don't have permission to do that!")
      .catch(console.error);
  } else {
    const commandText = text.indexOf(' ') !== -1
      ? text.substring(text.indexOf(' ') + 1)
      : '';

    if (text.startsWith('add')) {
      addMeme(commandText, message);
    } else {
      message.channel.send('Invalid operation!')
        .catch(console.error);
    }
  }
}

async function addMeme(text: string, message: Discord.Message): Promise<void> {
  if (text !== '') {
    const splitText = text.split(' ');
    const memeName = splitText[0];
    let imageUrl = message.attachments.size > 0 ? undefined : splitText[1];
    const customPrefix = message.attachments.size > 0 ? splitText[1] : splitText[2];

    if (Array.from(memes.values()).map(m => m.name).includes(memeName) || memeName === 'config') {
      message.channel.send('That meme already exists!')
        .catch(console.error);
    } else if (Array.from(memes.values())
      .filter(m => m.customPrefix !== undefined)
      .map(m => m.customPrefix)
      .includes(customPrefix)) {
      message.channel.send('That prefix is already in use!')
        .catch(console.error);
    } else {
      if (message.attachments.size > 0) {
        const attachment = Array.from(message.attachments.values())
          .find(a => [ 'png', 'jpg', 'jpeg' ].includes(a.url.split('.').pop() ?? ''));

        if (attachment) {
          imageUrl = attachment.url;
        } else {
          message.channel.send('Unsupported image type!')
            .catch(console.error);
        }
      } else if (imageUrl !== undefined && imageUrl !== '') {
        try {
          new URL(imageUrl);
        } catch (e) {
          message.channel.send('Invalid URL!')
            .catch(console.error);
        }
      } else {
        message.channel.send('No image specified!')
          .catch(console.error);
      }

      if (imageUrl !== undefined) {
        try {
          await saveImage(imageUrl, memeName);
        } catch (e) {
          message.channel.send('Unsupported image type!')
            .catch(console.error);
        }

        const config: MemeConfig[] = Array.from(memes.values());
        config.push({
          name: memeName,
          filename: `${memeName}.png`,
          customPrefix: customPrefix
        });

        await saveConfig(config);
        await initMemes();

        message.channel.send(`Added meme ${splitText[0]}!`)
          .catch(console.error);
      }
    }
  } else {
    message.channel.send('Please specify a name!')
      .catch(console.error);
  }
}

async function saveConfig(config: MemeConfig[]): Promise<void> {
  fs.writeFileSync('./src/config.json', JSON.stringify(config, null, 2));
}

async function initMemes(): Promise<void> {
  const config: MemeConfig[] = JSON.parse(fs.readFileSync('./src/config.json', 'utf8'));

  for (const meme of config) {
    memes.set(meme.name, meme);
  }
}

async function saveImage(url: string, filename: string): Promise<void> {
  const image = await loadImage(url);
  const imageHeight = image.height * IMAGE_WIDTH / image.width;

  const canvas = createCanvas(IMAGE_WIDTH, imageHeight);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0, IMAGE_WIDTH, imageHeight);

  fs.writeFileSync(`images/${filename}.png`, canvas.toBuffer());
}

async function sendMeme(meme: MemeConfig | string, text: string, message: Discord.Message): Promise<void> {
  if (text !== '') {
    try {
      message.channel.send(new Discord.MessageAttachment(await drawImage(meme, text),
        `${typeof meme === 'string' ? 'meme' : meme.name}.png`))
        .catch(console.error);
    } catch (e) {
      message.channel.send('Unsupported image type!')
        .catch(console.error);
    }
  } else {
    message.channel.send('No text provided!')
      .catch(console.error);
  }
}

async function drawImage(meme: MemeConfig | string, text: string): Promise<Buffer> {
  const image = typeof meme === 'string' ? await loadImage(meme) : await loadImage(`images/${meme.filename}`);
  const imageHeight = image.height * IMAGE_WIDTH / image.width;

  const canvas = createCanvas(IMAGE_WIDTH, imageHeight);
  const ctx = canvas.getContext('2d');

  const wrappedText = wrapText(text, IMAGE_WIDTH - 20, ctx);

  ctx.drawImage(image, 0, 0, IMAGE_WIDTH, imageHeight);

  ctx.font = `30px ${FONT_FAMILY}`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'black';

  for (let i = 0; i < wrappedText.length; i++) {
    const x = IMAGE_WIDTH / 2;
    const y = imageHeight - (30 * wrappedText.length - 1) + (30 * i);

    ctx.fillText(wrappedText[i], x, y);
    ctx.strokeText(wrappedText[i], x, y);
  }

  return canvas.toBuffer();
}

function wrapText(text: string, maxWidth: number, ctx: CanvasRenderingContext2D): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const testLine = `${line}${word} `;
    ctx.font = `30px ${FONT_FAMILY}`;
    const { width } = ctx.measureText(testLine);

    if (width > maxWidth && line !== '') {
      lines.push(line);
      line = '';
    } else {
      line = testLine;
    }
  }

  lines.push(line);
  return lines;
}
