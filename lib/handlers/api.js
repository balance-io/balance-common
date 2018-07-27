"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiGetGasPrices = exports.apiGetAccountTransactions = exports.apiGetTransaction = exports.apiGetTransactionData = exports.apiGetAccountBalances = exports.apiGetHistoricalPrices = exports.apiGetPrices = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _parsers = require("./parsers");

var _nativeCurrencies = _interopRequireDefault(require("../references/native-currencies.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var cryptocompareApiKey = process.env.REACT_APP_CRYPTOCOMPARE_API_KEY || '';
/**
 * Configuration for cryptocompare api
 * @type axios instance
 */

var cryptocompare = _axios.default.create({
  baseURL: 'https://min-api.cryptocompare.com/data/',
  timeout: 30000,
  // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});
/**
 * @desc get all assets prices
 * @param  {Array}   [asset=[]]
 * @return {Promise}
 */


var apiGetPrices = function apiGetPrices() {
  var assets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var assetsQuery = JSON.stringify(assets).replace(/[[\]"]/gi, '');
  var nativeQuery = JSON.stringify(Object.keys(_nativeCurrencies.default)).replace(/[[\]"]/gi, '');
  return cryptocompare.get("/pricemultifull?fsyms=".concat(assetsQuery, "&tsyms=").concat(nativeQuery, "&apiKey=").concat(cryptocompareApiKey));
};
/**
 * @desc get historical prices
 * @param  {String}  [assetSymbol='']
 * @param  {Number}  [timestamp=Date.now()]
 * @return {Promise}
 */


exports.apiGetPrices = apiGetPrices;

var apiGetHistoricalPrices = function apiGetHistoricalPrices() {
  var assetSymbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
  var nativeQuery = JSON.stringify(Object.keys(_nativeCurrencies.default)).replace(/[[\]"]/gi, '');
  return cryptocompare.get("/pricehistorical?fsym=".concat(assetSymbol, "&tsyms=").concat(nativeQuery, "&ts=").concat(timestamp, "&apiKey=").concat(cryptocompareApiKey));
};
/**
 * Configuration for balance api
 * @type axios instance
 */


exports.apiGetHistoricalPrices = apiGetHistoricalPrices;

var api = _axios.default.create({
  baseURL: 'https://indexer.balance.io',
  timeout: 30000,
  // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});
/**
 * @desc get account balances
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */


var apiGetAccountBalances =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var address,
        network,
        _ref2,
        data,
        accountInfo,
        result,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            address = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
            network = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'mainnet';
            _context.prev = 2;
            _context.next = 5;
            return api.get("/get_balances/".concat(network, "/").concat(address));

          case 5:
            _ref2 = _context.sent;
            data = _ref2.data;
            accountInfo = (0, _parsers.parseAccountAssets)(data, address);
            result = {
              data: accountInfo
            };
            return _context.abrupt("return", result);

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](2);
            throw _context.t0;

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 12]]);
  }));

  return function apiGetAccountBalances() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @desc get transaction data
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @param  {Number}   [page = 1]
 * @return {Promise}
 */


exports.apiGetAccountBalances = apiGetAccountBalances;

var apiGetTransactionData = function apiGetTransactionData() {
  var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'mainnet';
  var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return api.get("/get_transactions/".concat(network, "/").concat(address, "/").concat(page));
};
/**
 * @desc get transaction
 * @param  {String}   [txnHash = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */


exports.apiGetTransactionData = apiGetTransactionData;

var apiGetTransaction = function apiGetTransaction() {
  var txnHash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'mainnet';
  return api.get("/get_transaction/".concat(network, "/").concat(txnHash));
};
/**
 * @desc get account transactions
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */


exports.apiGetTransaction = apiGetTransaction;

var apiGetAccountTransactions =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var address,
        network,
        lastTxHash,
        _ref4,
        data,
        transactions,
        newTxs,
        result,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            address = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : '';
            network = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 'mainnet';
            lastTxHash = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : '';
            _context2.prev = 3;
            _context2.next = 6;
            return apiGetTransactionData(address, network, 1);

          case 6:
            _ref4 = _context2.sent;
            data = _ref4.data;
            _context2.next = 10;
            return (0, _parsers.parseAccountTransactions)(data, address, network);

          case 10:
            transactions = _context2.sent;

            if (transactions.length && lastTxHash) {
              newTxs = true;
              transactions = transactions.filter(function (tx) {
                if (tx.hash === lastTxHash && newTxs) {
                  newTxs = false;
                  return false;
                } else if (tx.hash !== lastTxHash && newTxs) {
                  return true;
                } else {
                  return false;
                }
              });
            }

            _context2.next = 14;
            return (0, _parsers.parseHistoricalTransactions)(transactions);

          case 14:
            transactions = _context2.sent;
            result = {
              data: transactions
            };
            return _context2.abrupt("return", result);

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](3);
            throw _context2.t0;

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[3, 19]]);
  }));

  return function apiGetAccountTransactions() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @desc get ethereum gas prices
 * @return {Promise}
 */


exports.apiGetAccountTransactions = apiGetAccountTransactions;

var apiGetGasPrices = function apiGetGasPrices() {
  return api.get("/get_eth_gas_prices");
};

exports.apiGetGasPrices = apiGetGasPrices;