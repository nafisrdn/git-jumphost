FROM node:16

RUN adduser node root

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@9.4.1
RUN npm install
COPY . .

RUN chmod -R 775 /app
RUN chown -R node:root /app

RUN mkdir /.npm

RUN chgrp -R 0 /.npm && chmod -R g=u /.npm

EXPOSE 8080

USER 1000

CMD [ "npm", "run", "prod" ]