FROM node:16-alpine

ARG BASE_DIR

WORKDIR /application

COPY ${BASE_DIR}/package.json .

RUN yarn install

COPY ${BASE_DIR}/. .

RUN yarn run build

CMD ["yarn", "run", "serve"]