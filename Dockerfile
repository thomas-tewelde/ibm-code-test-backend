FROM node:10

ARG NODE_ENV=production
ARG COM
ARG APP
ARG APP_DIR=/opt/${COM}/${APP}

ENV NODE_ENV ${NODE_ENV}

CMD ["node", "server.js"]
EXPOSE 3000

RUN mkdir -p ${APP_DIR}/data/ && \
    chown node:node ${APP_DIR}/data/
WORKDIR ${APP_DIR}/dist/
VOLUME ${APP_DIR}/data/

ADD package.json package-lock.json /tmp/_npm/
RUN cd /tmp/_npm/ && \
    npm cache clean --force && \
    npm install --ignore-scripts && \
    npm rebuild && \
    mv /tmp/_npm/node_modules/ ${APP_DIR}/

ADD . ${APP_DIR}/
