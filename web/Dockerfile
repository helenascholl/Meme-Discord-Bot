FROM node:16.10-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run lint && \
    npm run build

FROM nginx:1.21.4-alpine

COPY --from=builder /usr/src/app/dist/meme-bot-web/ /usr/share/nginx/html/

RUN chmod -R u+x /usr/share/nginx/html
