FROM node:alpine

MAINTAINER Mike Hathaway

RUN mkdir -p /usr/Civilization-Zombie/backend-service
WORKDIR /usr/Civilization-Zombie/backend-service

COPY . /usr/Civilization-Zombie/backend-service

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]
