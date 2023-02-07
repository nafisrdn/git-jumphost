FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@9.4.1
RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]