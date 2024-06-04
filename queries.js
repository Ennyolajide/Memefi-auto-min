require('dotenv').config();

const env = process.env;

const authQuery = {
  operationName: "MutationTelegramUserLogin",
  variables: {
    webAppData: {
      auth_date: parseInt(env.AUTH_DATE),
      hash: env.HASH,
      query_id: env.QUERY_ID,
      checkDataString: `auth_date=${env.AUTH_DATE}\nquery_id=${env.QUERY_ID}\nuser={\"id\":${env.USER_ID},\"first_name\":\"${env.FIRST_NAME}\",\"last_name\":\"${env.LAST_NAME}\",\"username\":\"${env.USERNAME}\",\"language_code\":\"${env.LANGUAGE_CODE}\",\"allows_write_to_pm\":true}`,
      user: {
        id: parseInt(env.USER_ID),
        allows_write_to_pm: true,
        first_name: env.FIRST_NAME,
        last_name: env.LAST_NAME,
        username: env.USERNAME,
        language_code: env.LANGUAGE_CODE,
        version: "7.4",
        platform: "ios"
      }
    }
  },
  query: `mutation MutationTelegramUserLogin($webAppData: TelegramWebAppDataInput!) {
    telegramUserLogin(webAppData: $webAppData) {
      access_token
      __typename
    }
  }`
};

const infoQuery = {
  query: `
      query {
        telegramUserMe {
          username
          isDailyRewardClaimed
        }
        telegramGameGetConfig {
          coinsAmount
          currentEnergy
          maxEnergy
          tapBotLevel
          currentBoss {
            _id
            level
            currentHealth
            maxHealth
          }
        }
      }
    `
};

const attackQuery = {
  query: `
    mutation MutationGameProcessTapsBatch($payload: TelegramGameTapsBatchInput!) {
      telegramGameProcessTapsBatch(payload: $payload) {
        ...FragmentBossFightConfig
        __typename
    }
    }

    fragment FragmentBossFightConfig on TelegramGameConfigOutput {
      _id
      coinsAmount
      currentEnergy
      maxEnergy
      weaponLevel
      energyLimitLevel
      energyRechargeLevel
      tapBotLevel
      currentBoss {
        _id
        level
        currentHealth
        maxHealth
      }
      freeBoosts {
        _id
        currentTurboAmount
        maxTurboAmount
        turboLastActivatedAt
        turboAmountLastRechargeDate
        currentRefillEnergyAmount
        maxRefillEnergyAmount
        refillEnergyLastActivatedAt
        refillEnergyAmountLastRechargeDate
      }
      bonusLeaderDamageEndAt
      bonusLeaderDamageStartAt
      bonusLeaderDamageMultiplier
      nonce
    }`
};

const refillQuery = {
  "operationName": "telegramGameActivateBooster",
  "variables": {
    "boosterType": "Recharge"
  },
  query: `
    mutation telegramGameActivateBooster($boosterType: BoosterType!) {
      telegramGameActivateBooster(boosterType: $boosterType) {
        ...FragmentBossFightConfig
        __typename
      }
    }
    
    fragment FragmentBossFightConfig on TelegramGameConfigOutput {
      _id
      coinsAmount
      currentEnergy
      maxEnergy
      weaponLevel
      energyLimitLevel
      energyRechargeLevel
      tapBotLevel
      currentBoss {
        _id
        level
        currentHealth
        maxHealth
        __typename
      }
      freeBoosts {
        _id
        currentTurboAmount
        maxTurboAmount
        turboLastActivatedAt
        turboAmountLastRechargeDate
        currentRefillEnergyAmount
        maxRefillEnergyAmount
        refillEnergyLastActivatedAt
        refillEnergyAmountLastRechargeDate
        __typename
      }
      bonusLeaderDamageEndAt
      bonusLeaderDamageStartAt
      bonusLeaderDamageMultiplier
      nonce
      __typename
    }`
};

const turboQuery = {
  "operationName": "telegramGameActivateBooster",
  "variables": {
    "boosterType": "Turbo"
  },
  query: `
    mutation telegramGameActivateBooster($boosterType: BoosterType!) {
      telegramGameActivateBooster(boosterType: $boosterType) {
        ...FragmentBossFightConfig
        __typename
      }
    }

    fragment FragmentBossFightConfig on TelegramGameConfigOutput {
      _id
      coinsAmount
      currentEnergy
      maxEnergy
      weaponLevel
      energyLimitLevel
      energyRechargeLevel
      tapBotLevel
      currentBoss {
        _id
        level
        currentHealth
        maxHealth
        __typename
      }
      freeBoosts {
        _id
        currentTurboAmount
        maxTurboAmount
        turboLastActivatedAt
        turboAmountLastRechargeDate
        currentRefillEnergyAmount
        maxRefillEnergyAmount
        refillEnergyLastActivatedAt
        refillEnergyAmountLastRechargeDate
        __typename
      }
      bonusLeaderDamageEndAt
      bonusLeaderDamageStartAt
      bonusLeaderDamageMultiplier
      nonce
      __typename
    }`
};

module.exports = { authQuery, infoQuery, attackQuery, refillQuery, turboQuery }

