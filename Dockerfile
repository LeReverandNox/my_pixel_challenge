FROM node:8.3

RUN mkdir /src

WORKDIR /src

ADD src/package.json /src

RUN npm install

ADD src /src

EXPOSE 3000

USER node