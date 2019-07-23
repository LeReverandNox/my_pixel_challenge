FROM node:8.3

RUN npm install -g bower

RUN mkdir /src
RUN chown -R node:node /src
WORKDIR /src

ADD --chown=node:node  src/package.json /src
ADD --chown=node:node  src/bower.json /src
ADD --chown=node:node  src/.bowerrc /src

USER node
RUN npm install
RUN bower install

ADD --chown=node:node src /src

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start", "--"]
