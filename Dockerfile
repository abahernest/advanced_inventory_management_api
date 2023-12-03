FROM node:18-bookworm-slim
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app
COPY yarn.lock /app
RUN yarn install --production
COPY dist /app

