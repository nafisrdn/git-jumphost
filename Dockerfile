FROM node:16

RUN adduser node root

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install tzdata -y

RUN ln -sf /usr/share/zoneinfo/Asia/Jakarta /etc/localtime
RUN echo "Asia/Jakarta" > /etc/timezone

RUN dpkg-reconfigure --frontend noninteractive tzdata


WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@9.4.1
RUN npm install
COPY . .

RUN chmod -R 775 /app
RUN chown -R node:root /app

RUN mkdir /.npm
RUN chgrp -R 0 /.npm && chmod -R g=u /.npm

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}

RUN if [ "$ENVIRONMENT" != "PROD" ]; then mkdir /jumphost-logs && chgrp -R 0 /jumphost-logs && chmod -R g=u /jumphost-logs; fi

EXPOSE 8080
USER 1000

CMD [ "npm", "run", "prod" ]


