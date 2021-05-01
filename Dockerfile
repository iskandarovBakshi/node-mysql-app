FROM node:14.16.1

## Add the wait script to the image
WORKDIR /app
ADD package.json ./
RUN npm install
ADD . ./


ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.8.0/wait /wait
RUN chmod +x /wait

EXPOSE ${NODE_DOCKER_PORT}
CMD /wait && ./entrypoint.sh
