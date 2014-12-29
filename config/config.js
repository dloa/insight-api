'use strict';

var network = process.env.INSIGHT_NETWORK || 'testnet';
var currency = process.env.INSIGHT_CURRENCY || 'btc';
var apiPrefix = process.env.INSIGHT_APIPREFIX || '/api';
var frontendPrefix = process.env.INSIGHT_FRONTENDPREFIX || '/';
var socketioPath = process.env.INSIGHT_SOCKETIOPATH || '/socket.io';

var config_currency = {
    btc:{
      db:'.insight',
      name:'bitoin',
      nameCamel:'Bitcoin',
      livenet: {
        port:3001,
        rpc_port:8332,
        p2p_port:8333
      },
      testnet:{
        port:3001,
        rpc_port:18332,
        p2p_port:18333
      }
    },
    ltc:{
      db:'.insight_litecoin',
      name:'litecoin',
      nameCamel:'Litecoin',
      livenet: {
        port:3003,
        rpc_port:9332,
        p2p_port:9333
      },
      testnet:{
        port:3003,
        rpc_port:19332,
        p2p_port:19333
      }
    },
    doge:{
      db:'.insight_dogecoin',
      name:'dogecoin',
      nameCamel:'Dogecoin',
      livenet: {
        port:3005,
        rpc_port:22555,
        p2p_port:22556
      },
      testnet:{
        port:3005,
        rpc_port:44555,
        p2p_port:44556
      }
    },
    drk:{
        db:'.insight_darkcoin',
        name:'darkcoin',
        nameCamel:'Darkcoin',
        livenet: {
          port:3007,
          rpc_port:9998,
          p2p_port:9999
        },
        testnet:{
          port:3007,
          rpc_port:19998,
          p2p_port:19999
        }
      },
      cann:{
        db:'.insight_cannabiscoin',
        name:'cannabiscoin',
        nameCamel:'CannabisCoin',
        livenet: {
          port:3007,
          rpc_port:39347,
          p2p_port:39348
        },
        testnet:{
          port:3007,
          rpc_port:19998,
          p2p_port:19999
        }
      },
      dgb:{
        db:'.insight_digibyte',
        name:'digibyte',
        nameCamel:'Digibyte',
        livenet: {
          port:3008,
          rpc_port:14022,
          p2p_port:12024
        },
        testnet:{
          port:3008,
          rpc_port:19998,
          p2p_port:19999
        }
      },
      meow:{
        db:'.insight_kittehcoin',
        name:'kittehcoin',
        nameCamel:'Kittehcoin',
        livenet: {
          port:3009,
          rpc_port:22565,
          p2p_port:22566
        },
        testnet:{
          port:3009,
          rpc_port:44565,
          p2p_port:44566
        }
      }	  
}

var path = require('path'),
  fs = require('fs'),
  rootPath = path.normalize(__dirname + '/..'),
  env,
  db;

var packageStr = fs.readFileSync('package.json');
var version = JSON.parse(packageStr).version;


function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

var home = process.env.INSIGHT_DB || (getUserHome() + '/' + config_currency[currency].db);

if (!fs.existsSync(home)) {
    var err = fs.mkdirSync(home);
    if (err) {
      console.log(err);
      console.log("## ERROR! Can't create insight directory! \n");
      console.log('\tPlease create it manually: ', db);
      process.exit(-1);
    }
  }

if (network === 'livenet') {
  env = 'livenet';
  db = home;
} else {
  env = 'testnet';
  db = home + '/testnet';
}

if (!fs.existsSync(db)) {
    var err = fs.mkdirSync(db);
    if (err) {
      console.log(err);
      console.log("## ERROR! Can't create testnet insight directory! \n");
      console.log('\tPlease create it manually: ', db);
      process.exit(-1);
    }
  }

switch (process.env.NODE_ENV) {
  case 'production':
    env += '';
    break;
  case 'test':
    env += ' - test environment';
    break;
  default:
    env += ' - development';
    break;
}


var dataDir = process.env.BITCOIND_DATADIR;
var isWin = /^win/.test(process.platform);
var isMac = /^darwin/.test(process.platform);
var isLinux = /^linux/.test(process.platform);
if (!dataDir) {
  if (isWin) dataDir = '%APPDATA%\\' + config_currency[currency].nameCamel + '\\';
  if (isMac) dataDir = process.env.HOME + '/Library/Application Support/' + config_currency[currency].nameCamel + '/';
  if (isLinux) dataDir = process.env.HOME + '/.' + config_currency[currency].name + '/';
}
dataDir += network === 'testnet' ? 'testnet3' : '';


var safeConfirmations = process.env.INSIGHT_SAFE_CONFIRMATIONS || 6;
var ignoreCache = process.env.INSIGHT_IGNORE_CACHE || 0;


var bitcoindConf = {
  protocol: process.env.BITCOIND_PROTO || 'http',
  user: process.env.BITCOIND_USER || 'user',
  pass: process.env.BITCOIND_PASS || 'pass',
  host: process.env.BITCOIND_HOST || '127.0.0.1',
  port: process.env.BITCOIND_PORT || config_currency[currency][network].rpc_port,
  p2pPort: process.env.BITCOIND_P2P_PORT || config_currency[currency][network].p2p_port,
  p2pHost: process.env.BITCOIND_P2P_HOST || process.env.BITCOIND_HOST || '127.0.0.1',
  dataDir: dataDir,
  // DO NOT CHANGE THIS!
  disableAgent: true
};

var enableMonitor = process.env.ENABLE_MONITOR === 'true';
var enableCleaner = process.env.ENABLE_CLEANER === 'true';
var enableMailbox = process.env.ENABLE_MAILBOX === 'true';
var enableRatelimiter = process.env.ENABLE_RATELIMITER === 'true';
var enableCredentialstore = process.env.ENABLE_CREDSTORE === 'true';
var enableEmailstore = process.env.ENABLE_EMAILSTORE === 'true';
var enablePublicInfo = process.env.ENABLE_PUBLICINFO === 'true';
var loggerLevel = process.env.LOGGER_LEVEL || 'info';
var enableHTTPS = process.env.ENABLE_HTTPS === 'true';
var enableCurrencyRates = process.env.ENABLE_CURRENCYRATES === 'true';

module.exports = {
  enableMonitor: enableMonitor,
  monitor: require('../plugins/config-monitor.js'),
  enableCleaner: enableCleaner,
  cleaner: require('../plugins/config-cleaner.js'),
  enableMailbox: enableMailbox,
  mailbox: require('../plugins/config-mailbox.js'),
  enableRatelimiter: enableRatelimiter,
  ratelimiter: require('../plugins/config-ratelimiter.js'),
  enableCredentialstore: enableCredentialstore,
  credentialstore: require('../plugins/config-credentialstore'),
  enableEmailstore: enableEmailstore,
  emailstore: require('../plugins/config-emailstore'),
  enableCurrencyRates: enableCurrencyRates,
  currencyrates: require('../plugins/config-currencyrates'),
  enablePublicInfo: enablePublicInfo,
  publicInfo: require('../plugins/publicInfo/config'),
  loggerLevel: loggerLevel,
  enableHTTPS: enableHTTPS,
  version: version,
  root: rootPath,
  publicPath: process.env.INSIGHT_PUBLIC_PATH || false,
  appName: 'Insight ' + config_currency[currency].nameCamel + " " + env,
  apiPrefix: apiPrefix,
  frontendPrefix: frontendPrefix,
  socketioPath: socketioPath,
  port: config_currency[currency][network].port,
  leveldb: db,
  bitcoind: bitcoindConf,
  network: network,
  disableP2pSync: false,
  disableHistoricSync: false,
  poolMatchFile: rootPath + '/etc/minersPoolStrings.json',

  // Time to refresh the currency rate. In minutes
  currencyRefresh: 10,
  keys: {
    segmentio: process.env.INSIGHT_SEGMENTIO_KEY
  },
  safeConfirmations: safeConfirmations, // PLEASE NOTE THAT *FULL RESYNC* IS NEEDED TO CHANGE safeConfirmations
  ignoreCache: ignoreCache,
  currency: currency
};
