FROM node:alpine

LABEL alias "Robot-Zombie-Server"

MAINTAINER Mike Hathaway

RUN mkdir -p /usr/Civilization-Zombie/backend-service
WORKDIR /usr/Civilization-Zombie/backend-service

COPY . /usr/Civilization-Zombie/backend-service

RUN npm install

EXPOSE 4000

CMD [ "npm", "start" ]
