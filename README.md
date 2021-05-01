# Nodejs developer test

### Project start up

- `.env` file is required - example:
```
MYSQL_ROOT_PASSWORD=123
# Db name
MYSQL_DATABASE=ftsyms
# Serve mysql at port locally
MYSQL_PORT=3306
# Serve mysql at port inside contanier
MYSQL_DOCKER_PORT=3306
# Serve node at port locally
NODE_LOCAL_PORT=8000
# Serve node at port inside container
NODE_DOCKER_PORT=3000
# by default runs every minute, reference: https://www.npmjs.com/package/node-cron
CRON_SCHEDULE="*/5 * * * *"
# specify environment: development, production
NODE_ENV=development
# Hostname
NODE_LOCAL_HOSTNAME="0.0.0.0"

# Send data via socket every ms
SOCKET_MS=1000

FSYMS="BTC,XRP,ETH,BCH,EOS,LTC,XMR,DASH"
TSYMS="USD,EUR,GBP,JPY,RUR"
```
- start app `docker-compose up`
- you can check socket on `localhost:$NODE_LOCAL_PORT`

-----
### Used packages

- [express](https://expressjs.com/)
- [socket.io](https://socket.io/)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [winston](https://www.npmjs.com/package/winston)
- [morgan](https://www.npmjs.com/package/morgan)
- [sequelize](https://sequelize.org/master/)