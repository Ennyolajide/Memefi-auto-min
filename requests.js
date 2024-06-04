const chalk = require('chalk');
const axios = require('axios');
const crypto = require('crypto');
const { url, getHeaders } = require('./config');
const { attackQuery, refillQuery, turboQuery } = require('./queries');


function setToken(token) {  
    return `Bearer ${token}`
}


function buildAttachData(taps) {
    return {
        operationName: "MutationGameProcessTapsBatch",
        variables: {
            payload: {
                nonce: crypto.randomBytes(32).toString('hex'),
                tapsCount: taps
            }
        },
        ...attackQuery
    };
}

async function attack(token, taps) {
    const _headers = getHeaders({ 'Authorization': setToken(token) });
    return await axios.post(url, buildAttachData(taps), { headers: _headers }).then((res) => {
        const { data } = res.data;
        data ? logAttack(taps, data) : false;
        const result = data?.telegramGameProcessTapsBatch;
        const _refill = result?.freeBoosts?.currentRefillEnergyAmount || 0;
        if(result.currentEnergy <= taps){
            (_refill > 0) ? refill(token) : exitProcess();
        }
    }).catch((error) => {
        logError(error);
    });
}

async function refill(token) {
    const _headers = getHeaders({ 'Authorization': setToken(token) });
    return await axios.post(url, refillQuery, { headers: _headers }).then((res) => {
        const { data } = res.data;
        data ? logRefill(data) : exitProcess();
        const { telegramGameActivateBooster } = data;
        const freeBoosts = (telegramGameActivateBooster?.freeBoosts || 0);
        //(freeBoosts?.currentTurboAmount > 0) ? activateTurbo(token) : false;
    }).catch((error) => {
        logError(error);
    });
}

function activateTurbo(token) {
    const _headers = getHeaders({ 'Authorization': setToken(token) });
    return axios.post(url, turboQuery, { headers: _headers }).then((res) => {
        const { data } = res.data;
        data ? logTurbo(data) : false;
    }).catch((error) => {
        logError(error);
    });
}

function logInfo(data) {
    const me = data?.telegramUserMe;
    const config = data?.telegramGameGetConfig;
    console.log(
        'Username:', chalk.blue(me.username.toUpperCase()),
        '| Coins:', chalk.yellow(config?.coinsAmount),
        '| Energy:', `${chalk.magenta(config?.currentEnergy)} / ${chalk.green(config?.maxEnergy)}`,
        '| Boss Level:', chalk.blue(config?.currentBoss.level),
        '| Boss Health:', `${chalk.magenta(config?.currentBoss.currentHealth)} / ${chalk.green(config?.currentBoss.maxHealth)}`
    );
}

function logAttack(taps, data) {
    console.log(
        'Attacking ...',
        chalk.blue('->'),
        chalk.magenta(taps),
        chalk.green('\u2714'),
        '| Coins:', chalk.yellow(data?.telegramGameProcessTapsBatch?.coinsAmount),
        '| Energy:', `${chalk.magenta(data?.telegramGameProcessTapsBatch?.currentEnergy)} / ${chalk.green(data?.telegramGameProcessTapsBatch?.maxEnergy)}`,
        '| Boss Health:', `${chalk.magenta(data?.telegramGameProcessTapsBatch?.currentBoss?.currentHealth)} / ${chalk.green(data?.telegramGameProcessTapsBatch?.currentBoss?.maxHealth)}`
    );
}

function logRefill(data) {
    console.log(
        'Refilling ...', chalk.blue('->'), chalk.green('\u2714'),
        '| Coins:', chalk.yellow(data?.telegramGameActivateBooster?.coinsAmount),
        '| Energy:', `${chalk.magenta(data?.telegramGameActivateBooster?.currentEnergy)} / ${chalk.green(data?.telegramGameActivateBooster?.maxEnergy)}`,
        '| Boss Health:', `${chalk.magenta(data?.telegramGameActivateBooster?.currentBoss?.currentHealth)} / ${chalk.green(data?.telegramGameActivateBooster?.currentBoss?.maxHealth)}`
    );
}

function logTurbo(data) {
    console.log(
        'Turbo Activated ...', chalk.blue('->'), chalk.green('\u2714'),
        '| Coins:', chalk.yellow(data?.telegramGameActivateBooster?.coinsAmount),
        '| Energy:', `${chalk.magenta(data?.telegramGameActivateBooster?.currentEnergy)} / ${chalk.green(data?.telegramGameActivateBooster?.maxEnergy)}`,
        '| Boss Health:', `${chalk.magenta(data?.telegramGameActivateBooster?.currentBoss?.currentHealth)} / ${chalk.green(data?.telegramGameActivateBooster?.currentBoss?.maxHealth)}`
    );
}

function logError(error) {
    console.log(error.response ? error.response.data : error.request ? error.request : 'Error', error.message);
    process.exit();
}

function exitProcess() {
    console.log(chalk.red('Error or coin mining completed. Exiting...'));
    process.exit(); //end the process
}

module.exports = { setToken, logInfo, attack, refill, logError, exitProcess }
