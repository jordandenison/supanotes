FROM node:20.9-alpine3.18
MAINTAINER Jordan Denison <jordan@denisonweb.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./config ./config
COPY ./lib ./lib
COPY ./public ./public

RUN npm install --location=global npm@10.2.4 && npm install --omit=dev

WORKDIR /usr/src/app

CMD ["npm", "start"]