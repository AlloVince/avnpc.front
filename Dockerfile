FROM node:8.11.1-alpine

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

COPY . /opt/htdocs/avnpc.front
WORKDIR /opt/htdocs/avnpc.front

RUN npm install && npm run build && npm prune --production

EXPOSE 3000

CMD node ./server.js
