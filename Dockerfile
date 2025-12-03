FROM node:16-alpine

ARG NODE_ENV

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY next.config.js ./
COPY ./.next ./.next
COPY ./public ./public

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]