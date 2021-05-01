const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const cron = require("node-cron");
const { default: fetch } = require("node-fetch");
const config = require("src/config"); // run this first
const logger = require("src/utils/app-logger");
const sequelize = require("./models");
const http = require("http");
const { Server } = require("socket.io");
const { Op } = require("sequelize");

(async () => {
  // check db and start cron
  try {
    await sequelize.sequelize.authenticate();
    logger.info(
      "Connection to the database has been established successfully."
    );

    await sequelize.sequelize.sync(); // sync models

    cron.schedule(config.cronSchedule, async () => {
      // start cron
      const response = await fetch(config.api.pricemultifull.url).catch(
        // fetch from api
        logger.error
      );

      const res = await response.json().catch(logger.error);
      if (res) {
        // parse object data into array
        const raw = res["RAW"];
        const display = res["DISPLAY"];
        let parcedResponse = [];
        for (let coin_name in raw) {
          // O of n2
          const details = {
            coin_name: "",
            currencies: [],
            currenciesDisplay: [],
          };
          details.coin_name = coin_name;
          const currencies = raw[coin_name];
          const currenciesDisplay = display[coin_name];

          for (let currency_name in currencies) {
            const currency = currencies[currency_name];
            currency.currency_name = currency_name;
            details.currencies.push(currency);
          }
          for (let currency_name in currenciesDisplay) {
            const currency = currenciesDisplay[currency_name];
            currency.currency_name = currency_name;
            details.currenciesDisplay.push(currency);
          }

          parcedResponse.push(details);
        }

        try {
          // store data into db
          parcedResponse.forEach(async (coin) => {
            // O of n2
            const found = await sequelize.list_coins.findOne({
              where: { coin_name: coin.coin_name },
            });
            if (!found) {
              await sequelize.list_coins.create({ coin_name: coin.coin_name });
            }
            const foundCoinId = await sequelize.list_coins.findOne({
              where: { coin_name: coin.coin_name },
            });
            coin.currencies.forEach(async (curr, i) => {
              const foundCurrId = await sequelize.currencies.findOne({
                where: { currency_name: curr.currency_name },
              });
              let currRow;
              if (!foundCurrId) {
                currRow = await sequelize.currencies.create({
                  currency_name: curr.currency_name,
                });
              }
              await sequelize.raw_detail.create({
                coin_id: foundCoinId.id,
                currency_id: foundCurrId ? foundCurrId.id : currRow.id,
                change24hour: curr.CHANGE24HOUR,
                changepct24hour: curr.CHANGEPCT24HOUR,
                open24hour: curr.OPEN24HOUR,
                volume24hour: curr.OPEN24HOUR,
                volume24hourto: curr.VOLUME24HOURTO,
                low24hour: curr.LOW24HOUR,
                high24hour: curr.HIGH24HOUR,
                price: curr.PRICE,
                lastupdate: curr.LASTUPDATE,
                supply: curr.SUPPLY,
                mktcap: curr.MKTCAP,
              });
              const currDis = coin.currenciesDisplay[i];
              await sequelize.display_detail.create({
                coin_id: foundCoinId.id,
                currency_id: foundCurrId ? foundCurrId.id : currRow.id,
                tosymbol: currDis.TOSYMBOL,
                fromsymbol: currDis.FROMSYMBOL,
                change24hour: currDis.CHANGE24HOUR,
                changepct24hour: currDis.CHANGEPCT24HOUR,
                open24hour: currDis.OPEN24HOUR,
                volume24hour: currDis.OPEN24HOUR,
                volume24hourto: currDis.VOLUME24HOURTO,
                low24hour: currDis.LOW24HOUR,
                high24hour: currDis.HIGH24HOUR,
                price: currDis.PRICE,
                lastupdate: currDis.LASTUPDATE,
                supply: currDis.SUPPLY,
                mktcap: currDis.MKTCAP,
              });
            });
          });
        } catch (err) {
          logger.error(err);
        }
      }
    });
  } catch (err) {
    logger.error("Unable to connect to the db: \n%O", err);
  }
})();

logger.info("App is running with the configuration below: \n%O", config);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(
  // logger middleware for api
  morgan("combined", {
    stream: fs.createWriteStream(config.webLogs, { flags: "a" }),
  })
);

// serve static files
app.use(express.static(config.static));

// serve home page
app.get("/", function (req, res) {
  res.sendFile(`${config.static}/home.html`);
});
let interval;
const allClients = [];
io.on("connection", (socket) => {
  // socket handshake
  logger.info("User connected");
  socket.send("Handshake");
  allClients.push(socket);
  if (!interval) {
    interval = startSocket();
  }


  socket.on("disconnect", function () {
    console.info("disconnect!");

    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);

    if (allClients.length === 0) {
      clearInterval(interval);
      interval = undefined;
    }
  });
});

function startSocket() {
  const id = setInterval(async () => {
    let result = {
      RAW: {},
      DISPLAY: {},
    };

    const list_coins = await sequelize.list_coins.findAll({
      where: {
        [Op.or]: config.fsymsParsed.map((f) => ({ coin_name: f })),
      },
    });
    const currencies = await sequelize.currencies.findAll({
      where: {
        [Op.or]: config.tsymsParsed.map((f) => ({ currency_name: f })),
      },
    });
    for (let coin of list_coins) {
      result.RAW[coin.coin_name] = {};
      result.DISPLAY[coin.coin_name] = {};

      for (let curr of currencies) {
        const currDetail = await sequelize.raw_detail.findOne({
          limit: config.fsymsParsed.length * config.tsymsParsed.length,
          order: [["createdAt", "DESC"]],
          where: {
            coin_id: coin.id,
            currency_id: curr.id,
          },
          raw: true,
        });
        const currDis = await sequelize.display_detail.findOne({
          limit: config.fsymsParsed.length * config.tsymsParsed.length,
          order: [["createdAt", "DESC"]],
          where: {
            coin_id: coin.id,
            currency_id: curr.id,
          },
          raw: true,
        });
        result.RAW[coin.coin_name][curr.currency_name] = currDetail;
        result.DISPLAY[coin.coin_name][curr.currency_name] = currDis;
      }
    }
    io.emit("data", result);
  }, config.socketMs);
  return id;
}
// listen
server.listen(config.port, config.hostname, () => {
  logger.info(
    `App is listening on container ${config.hostname}:${config.port}`
  );
  logger.info(
    `App is listening locally ${config.hostname}:${config.localPort}`
  );
});
