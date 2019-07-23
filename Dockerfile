FROM node:8.3

RUN npm install -g bower

RUN mkdir /src

WORKDIR /src

ADD src/package.json /src
ADD src/bower.json /src
ADD src/.bowerrc /src

RUN chown -R node:node /src

USER node
RUN npm install
RUN bower install

ADD src /src

USER root
RUN find /src ! -name node_modules -exec chown -R node:node {} \;

USER node

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start", "--"]
