require('dotenv').config();
const axios = require('axios');
const { getRandom } = require('./utils.js');
const { url, getHeaders } = require('./config');
const { setToken, logInfo, attack, logError, exitProcess } = require('./requests');
const { infoQuery, authQuery } = require('./queries');

const env = process.env;
const minClick = parseInt(env.MIN_CLICK);
const maxClick = parseInt(env.MAX_CLICK);
const minInterval = parseInt(env.MIN_INTERVAL);
const maxInterval = parseInt(env.MAX_INTERVAL);

async function main () {
  await axios.post(url, authQuery, { headers: getHeaders() })
    .then((res) => {
      const { data } = res.data;
      const token = data ? data.telegramUserLogin.access_token : null;
      axios.post(url, infoQuery, { headers: getHeaders({ 'Authorization' : setToken(token) }) })
        .then((res) => {
          const { data } = res.data;
          data ? logInfo(data) : false;

          async function handleTap() {
            await data ? attack(token, getRandom(minClick, maxClick)) : exitProcess;
          }

          handleTap();

          setInterval(handleTap, (getRandom(minInterval, maxInterval) * 1000));
        })
        .catch(error => {
          logError(error)
        });
    }).catch((error) => {
      console.log(error);
    });

  }

main();
