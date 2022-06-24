FROM node:16-buster-slim

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY src ./src
COPY tsconfig.json .
RUN yarn run build

CMD ["yarn", "start"]
