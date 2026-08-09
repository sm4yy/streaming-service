FROM node:22-alpine

WORKDIR /app

COPY . .

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn", "start"]