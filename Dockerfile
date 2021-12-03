FROM node:14-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run lint && \
    npm run build

CMD [ "npm", "start" ]
