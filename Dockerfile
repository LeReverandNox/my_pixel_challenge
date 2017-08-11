FROM node:8.3

RUN npm install -g bower

RUN mkdir /src
RUN chown -R node:node /src
WORKDIR /src

USER node

ADD src/package.json /src
ADD src/bower.json /src
ADD src/.bowerrc /src

RUN npm install
RUN bower install

ADD src /src

EXPOSE 3000

CMD ["npm", "start"]