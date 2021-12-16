FROM node:14

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY package*.json ./

RUN npm install

COPY . .

RUN cp -n src/config.template.json src/config.json

RUN npm run lint && \
    npm run build

CMD [ "npm", "start" ]
