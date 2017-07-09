FROM node:alpine

MAINTAINER Mike Hathaway

RUN mkdir -p /usr/Civilization-Zombie/frontend-service
WORKDIR /usr/Civilization-Zombie/frontend-service

COPY . /usr/Civilization-Zombie/frontend-service

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
