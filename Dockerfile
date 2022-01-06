FROM node:17.3.0

WORKDIR /app

COPY package*.json ./
RUN npm instal
COPY . .
CMD node server.js