"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHistoricalTransactions = exports.parseTransaction = exports.parseAccountTransactions = exports.parseNewTransaction = exports.parseConfirmedTransactions = exports.parseHistoricalNativePrice = exports.parseAccountUniqueTokens = exports.parseAccountBalancesPrices = exports.parseAccountAssets = exports.parsePricesObject = exports.parseGasPricesTxFee = exports.getNativeGasPrice = exports.convertGasPricesToNative = exports.parseGasPrices = exports.defaultGasPriceFormat = exports.getTxFee = exports.parseError = void 0;

var _languages = _interopRequireDefault(require("../languages"));

var _bignumber = require("../helpers/bignumber");

var _ethereumUnits = _interopRequireDefault(require("../references/ethereum-units.json"));

var _nativeCurrencies = _interopRequireDefault(require("../references/native-currencies.json"));

var _timeUnits = _interopRequireDefault(require("../references/time-units.json"));

var _utilities = require("../helpers/utilities");

var _web = require("./web3");

var _time = require("../helpers/time");

var _api = require("./api");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @desc parse error code message
 * @param  {Error} error
 * @return {String}
 */
var parseError = function parseError(error) {
  if (error) {
    var msgEnd = error.message.indexOf('\n') !== -1 ? error.message.indexOf('\n') : error.message.length;
    var message = error.message.slice(0, msgEnd);

    if (error.message.includes('MetaMask') || error.message.includes('Returned error:')) {
      message = message.replace('Error: ', '').replace('MetaMask ', '').replace('Returned error: ', '');
      message = message.slice(0, 1).toUpperCase() + message.slice(1).toLowerCase();
      console.error(new Error(message));
      return message;
    } else if (message.indexOf('0x6801') !== -1) {
      message = _languages.default.t('notification.error.generic_error');
    }

    console.error(error);
    return message;
  }

  return _languages.default.t('notification.error.generic_error');
};

exports.parseError = parseError;

var getTxFee = function getTxFee(gasPrice, gasLimit) {
  var amount = (0, _bignumber.multiply)(gasPrice, gasLimit);
  return {
    value: {
      amount: amount,
      display: (0, _bignumber.convertAmountToDisplay)(amount, null, {
        symbol: 'ETH',
        decimals: 18
      })
    },
    native: null
  };
};

exports.getTxFee = getTxFee;

var defaultGasPriceFormat = function defaultGasPriceFormat(option, timeAmount, valueAmount, valueDisplay) {
  return {
    option: option,
    estimatedTime: {
      amount: timeAmount,
      display: (0, _time.getTimeString)(timeAmount, 'ms')
    },
    value: {
      amount: valueAmount,
      display: valueDisplay
    }
  };
};
/**
 * @desc parse ether gas prices
 * @param {Object} data
 * @param {Object} prices
 * @param {Number} gasLimit
 */


exports.defaultGasPriceFormat = defaultGasPriceFormat;

var parseGasPrices = function parseGasPrices(data, prices, gasLimit) {
  var gasPrices = {
    slow: null,
    average: null,
    fast: null
  };

  if (!data) {
    gasPrices.fast = defaultGasPriceFormat('fast', '30000', '5000000000', '5 Gwei');
    gasPrices.average = defaultGasPriceFormat('average', '360000', '2000000000', '2 Gwei');
    gasPrices.slow = defaultGasPriceFormat('slow', '1800000', '1000000000', '1 Gwei');
  } else {
    var fastTimeAmount = (0, _bignumber.multiply)(data.fastWait, _timeUnits.default.ms.minute);
    var fastValueAmount = (0, _bignumber.divide)(data.fast, 10);
    gasPrices.fast = defaultGasPriceFormat('fast', fastTimeAmount, (0, _bignumber.multiply)(fastValueAmount, _ethereumUnits.default.gwei), "".concat(fastValueAmount, " Gwei"));
    var avgTimeAmount = (0, _bignumber.multiply)(data.avgWait, _timeUnits.default.ms.minute);
    var avgValueAmount = (0, _bignumber.divide)(data.avg, 10);
    gasPrices.average = defaultGasPriceFormat('average', avgTimeAmount, (0, _bignumber.multiply)(avgValueAmount, _ethereumUnits.default.gwei), "".concat(avgValueAmount, " Gwei"));
    var slowTimeAmount = (0, _bignumber.multiply)(data.safeLowWait, _timeUnits.default.ms.minute);
    var slowValueAmount = (0, _bignumber.divide)(data.safeLow, 10);
    gasPrices.slow = defaultGasPriceFormat('slow', slowTimeAmount, (0, _bignumber.multiply)(slowValueAmount, _ethereumUnits.default.gwei), "".concat(slowValueAmount, " Gwei"));
  }

  return parseGasPricesTxFee(gasPrices, prices, gasLimit);
};

exports.parseGasPrices = parseGasPrices;

var convertGasPricesToNative = function convertGasPricesToNative(prices, gasPrices) {
  var nativeGases = _objectSpread({}, gasPrices);

  if (prices && prices.selected) {
    gasPrices.fast.txFee.native = getNativeGasPrice(prices, gasPrices.fast.txFee.value.amount);
    gasPrices.average.txFee.native = getNativeGasPrice(prices, gasPrices.average.txFee.value.amount);
    gasPrices.slow.txFee.native = getNativeGasPrice(prices, gasPrices.slow.txFee.value.amount);
  }

  return nativeGases;
};

exports.convertGasPricesToNative = convertGasPricesToNative;

var getNativeGasPrice = function getNativeGasPrice(prices, feeAmount) {
  var amount = (0, _bignumber.convertAssetAmountToNativeAmount)(feeAmount, {
    symbol: 'ETH'
  }, prices);
  return {
    selected: prices.selected,
    value: {
      amount: amount,
      display: (0, _bignumber.convertAmountToDisplay)(amount, prices, null, 2)
    }
  };
};
/**
 * @desc parse ether gas prices with updated gas limit
 * @param {Object} data
 * @param {Object} prices
 * @param {Number} gasLimit
 */


exports.getNativeGasPrice = getNativeGasPrice;

var parseGasPricesTxFee = function parseGasPricesTxFee(gasPrices, prices, gasLimit) {
  gasPrices.fast.txFee = getTxFee(gasPrices.fast.value.amount, gasLimit);
  gasPrices.average.txFee = getTxFee(gasPrices.average.value.amount, gasLimit);
  gasPrices.slow.txFee = getTxFee(gasPrices.slow.value.amount, gasLimit);
  return convertGasPricesToNative(prices, gasPrices);
};
/**
 * @desc parse prices object from api response
 * @param  {Object} [data=null]
 * @param  {Array} [assets=[]]
 * @param  {String} [native='USD']
 * @return {Object}
 */


exports.parseGasPricesTxFee = parseGasPricesTxFee;

var parsePricesObject = function parsePricesObject() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var assets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var nativeSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'USD';
  var prices = {
    selected: _nativeCurrencies.default[nativeSelected]
  };
  Object.keys(_nativeCurrencies.default).forEach(function (nativeCurrency) {
    prices[nativeCurrency] = {};
    assets.forEach(function (asset) {
      var assetPrice = null;

      if (data.RAW[asset]) {
        assetPrice = {
          price: {
            amount: (0, _bignumber.convertAmountToBigNumber)(data.RAW[asset][nativeCurrency].PRICE),
            display: (0, _bignumber.convertAmountToDisplaySpecific)((0, _bignumber.convertAmountToBigNumber)(data.RAW[asset][nativeCurrency].PRICE), prices, nativeCurrency)
          },
          change: {
            amount: (0, _bignumber.convertAmountToBigNumber)(data.RAW[asset][nativeCurrency].CHANGEPCT24HOUR),
            display: (0, _bignumber.convertAmountToDisplay)((0, _bignumber.convertAmountToBigNumber)(data.RAW[asset][nativeCurrency].CHANGEPCT24HOUR))
          }
        };
      }

      if (asset !== 'WETH') {
        prices[nativeCurrency][asset] = assetPrice;
      }

      if (asset === 'ETH') {
        prices[nativeCurrency]['WETH'] = assetPrice;
      }
    });
  });
  return prices;
};
/**
 * @desc parse account assets
 * @param  {Object} [data=null]
 * @param  {String} [address=null]
 * @return {Object}
 */


exports.parsePricesObject = parsePricesObject;

var parseAccountAssets = function parseAccountAssets() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  try {
    var assets = _toConsumableArray(data);

    assets = assets.map(function (assetData) {
      var name = assetData.contract.name !== assetData.contract.address ? assetData.contract.name : assetData.contract.symbol || 'Unknown Token';
      var asset = {
        name: name,
        symbol: assetData.contract.symbol || '———',
        address: assetData.contract.address || null,
        decimals: (0, _bignumber.convertStringToNumber)(assetData.contract.decimals)
      };
      var assetBalance = (0, _bignumber.convertAssetAmountToBigNumber)(assetData.balance, asset.decimals);
      return _objectSpread({}, asset, {
        balance: {
          amount: assetBalance,
          display: (0, _bignumber.convertAmountToDisplay)(assetBalance, null, {
            symbol: asset.symbol,
            decimals: asset.decimals
          })
        },
        native: null
      });
    });
    assets = assets.filter(function (asset) {
      return !!Number(asset.balance.amount) || asset.symbol === 'ETH';
    });
    return {
      address: address,
      type: '',
      assets: assets,
      total: null
    };
  } catch (error) {
    throw error;
  }
};
/**
 * @desc parse account balances from native prices
 * @param  {Object} [account=null]
 * @param  {Object} [prices=null]
 * @param  {String} [network='']
 * @return {Object}
 */


exports.parseAccountAssets = parseAccountAssets;

var parseAccountBalancesPrices = function parseAccountBalancesPrices() {
  var account = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var nativePrices = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var network = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var totalAmount = 0;

  var newAccount = _objectSpread({}, account);

  var nativeSelected = nativePrices.selected.currency;

  if (account) {
    var newAssets = account.assets.map(function (asset) {
      if (!nativePrices || nativePrices && !nativePrices[nativeSelected][asset.symbol]) return asset;
      var balanceAmountUnit = (0, _bignumber.convertAmountFromBigNumber)(asset.balance.amount, asset.decimals);
      var balancePriceUnit = (0, _bignumber.convertAmountFromBigNumber)(nativePrices[nativeSelected][asset.symbol].price.amount);
      var balanceRaw = (0, _bignumber.multiply)(balanceAmountUnit, balancePriceUnit);
      var balanceAmount = (0, _bignumber.convertAmountToBigNumber)(balanceRaw);
      var balanceDisplay = (0, _bignumber.convertAmountToDisplay)(balanceAmount, nativePrices);
      var assetPrice = nativePrices[nativeSelected][asset.symbol].price;
      return _objectSpread({}, asset, {
        native: {
          selected: nativePrices.selected,
          balance: {
            amount: balanceAmount,
            display: balanceDisplay
          },
          price: assetPrice,
          change: asset.symbol === nativePrices.selected.currency ? {
            amount: '0',
            display: '———'
          } : nativePrices[nativeSelected][asset.symbol].change
        }
      });
    });
    totalAmount = newAssets.reduce(function (total, asset) {
      return (0, _bignumber.add)(total, asset.native ? asset.native.balance.amount : 0);
    }, 0);
    var totalDisplay = (0, _bignumber.convertAmountToDisplay)(totalAmount, nativePrices);
    var total = {
      amount: totalAmount,
      display: totalDisplay
    };
    newAccount = _objectSpread({}, newAccount, {
      assets: newAssets,
      total: total
    });
  }

  return newAccount;
};
/**
 * @desc parse unique tokens from opensea
 * @param  {Object}
 * @return {Array}
 */


exports.parseAccountBalancesPrices = parseAccountBalancesPrices;

var parseAccountUniqueTokens = function parseAccountUniqueTokens(data) {
  if (!data.data.assets.length) return [];
  var uniqueTokens = data.data.assets.map(function (el) {
    return {
      background: "#".concat(el.background_color),
      name: el.name,
      imageUrl: el.image_url,
      id: el.token_id,
      lastPrice: el.last_sale && Number((0, _bignumber.convertAmountFromBigNumber)(el.last_sale.total_price)),
      contractAddress: el.asset_contract.address
    };
  });
  return uniqueTokens;
};

exports.parseAccountUniqueTokens = parseAccountUniqueTokens;
var ethFeeAsset = {
  name: 'Ethereum',
  symbol: 'ETH',
  address: null,
  decimals: 18
};
/**
 * @desc get historical native prices for transaction
 * @param  {Object} tx
 * @return {Object}
 */

var parseHistoricalNativePrice =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(transaction) {
    var tx, timestamp, asset, priceAssets, promises, historicalPriceResponses, response, feeResponse;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            tx = _objectSpread({}, transaction);
            timestamp = tx.timestamp ? tx.timestamp.secs : Date.now();
            asset = _objectSpread({}, tx.asset);
            asset.symbol = tx.asset.symbol === 'WETH' ? 'ETH' : tx.asset.symbol;
            priceAssets = [asset.symbol, 'ETH'];
            promises = priceAssets.map(function (x) {
              return (0, _api.apiGetHistoricalPrices)(x, timestamp);
            });
            _context.next = 8;
            return Promise.all(promises);

          case 8:
            historicalPriceResponses = _context.sent;
            response = historicalPriceResponses[0];
            feeResponse = historicalPriceResponses[1];
            Object.keys(_nativeCurrencies.default).forEach(function (nativeCurrency) {
              var prices = {
                selected: _nativeCurrencies.default[nativeCurrency]
              };
              prices[nativeCurrency] = {};

              if (response.data.response !== 'Error' && response.data[asset.symbol]) {
                var assetPriceAmount = (0, _bignumber.convertAmountToBigNumber)(response.data[asset.symbol][nativeCurrency]);
                prices[nativeCurrency][asset.symbol] = {
                  price: {
                    amount: assetPriceAmount,
                    display: null
                  }
                };
                var assetPriceDisplay = (0, _bignumber.convertAmountToDisplay)(assetPriceAmount, prices);
                prices[nativeCurrency][asset.symbol].price.display = assetPriceDisplay;
                var assetPrice = prices[nativeCurrency][asset.symbol].price;
                var valuePriceAmount = (0, _bignumber.convertAssetAmountToNativeValue)(tx.value.amount, asset, prices);
                var valuePriceDisplay = (0, _bignumber.convertAmountToDisplay)(valuePriceAmount, prices);
                var valuePrice = !tx.error ? {
                  amount: valuePriceAmount,
                  display: valuePriceDisplay
                } : {
                  amount: '',
                  display: ''
                };
                tx.native[nativeCurrency] = {
                  price: assetPrice,
                  value: valuePrice
                };
              }

              if (tx.txFee && feeResponse.data.response !== 'Error' && feeResponse.data['ETH']) {
                var feePriceAmount = (0, _bignumber.convertAmountToBigNumber)(feeResponse.data['ETH'][nativeCurrency]);
                prices[nativeCurrency]['ETH'] = {
                  price: {
                    amount: feePriceAmount,
                    display: null
                  }
                };
                var feePriceDisplay = (0, _bignumber.convertAmountToDisplay)(feePriceAmount, prices);
                prices[nativeCurrency]['ETH'].price.display = feePriceDisplay;
                var txFeePriceAmount = (0, _bignumber.convertAssetAmountToNativeValue)(tx.txFee.amount, ethFeeAsset, prices);
                var txFeePriceDisplay = (0, _bignumber.convertAmountToDisplay)(txFeePriceAmount, prices);
                var txFeePrice = {
                  amount: txFeePriceAmount,
                  display: txFeePriceDisplay
                };
                tx.native[nativeCurrency] = _objectSpread({}, tx.native[nativeCurrency], {
                  txFee: txFeePrice
                });
              }
            });
            return _context.abrupt("return", tx);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function parseHistoricalNativePrice(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @desc parse confirmed transactions
 * @param  {Object} [data=null]
 * @return {Array}
 */


exports.parseHistoricalNativePrice = parseHistoricalNativePrice;

var parseConfirmedTransactions =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var data,
        transactions,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            data = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';
            _context3.next = 3;
            return parseTransaction(data);

          case 3:
            transactions = _context3.sent;
            _context3.next = 6;
            return Promise.all(transactions.map(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(tx) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return parseHistoricalNativePrice(tx);

                      case 2:
                        return _context2.abrupt("return", _context2.sent);

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 6:
            return _context3.abrupt("return", _context3.sent);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function parseConfirmedTransactions() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @desc parse transactions from native prices
 * @param  {Object} [txDetails=null]
 * @param  {Object} [transactions=null]
 * @param  {Object} [nativeCurrency='']
 * @return {String}
 */


exports.parseConfirmedTransactions = parseConfirmedTransactions;

var parseNewTransaction =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    var txDetails,
        nativeCurrency,
        totalGas,
        txFee,
        amount,
        value,
        nonce,
        tx,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            txDetails = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : null;
            nativeCurrency = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : '';
            totalGas = txDetails.gasLimit && txDetails.gasPrice ? (0, _bignumber.multiply)(txDetails.gasLimit, txDetails.gasPrice) : null;
            txFee = totalGas ? {
              amount: totalGas,
              display: (0, _bignumber.convertAmountToDisplay)(totalGas, null, {
                symbol: 'ETH',
                decimals: 18
              })
            } : null;
            amount = (0, _bignumber.convertAmountToBigNumber)(txDetails.value, txDetails.asset.decimals);
            value = {
              amount: amount,
              display: (0, _bignumber.convertAmountToDisplay)(amount, null, txDetails.asset)
            };
            _context4.t0 = txDetails.nonce;

            if (_context4.t0) {
              _context4.next = 16;
              break;
            }

            if (!txDetails.from) {
              _context4.next = 14;
              break;
            }

            _context4.next = 11;
            return (0, _web.getTransactionCount)(txDetails.from);

          case 11:
            _context4.t1 = _context4.sent;
            _context4.next = 15;
            break;

          case 14:
            _context4.t1 = '';

          case 15:
            _context4.t0 = _context4.t1;

          case 16:
            nonce = _context4.t0;
            tx = {
              hash: txDetails.hash,
              timestamp: null,
              from: txDetails.from,
              to: txDetails.to,
              error: false,
              nonce: nonce,
              value: value,
              txFee: txFee,
              native: {
                selected: _nativeCurrencies.default[nativeCurrency]
              },
              pending: true,
              asset: txDetails.asset
            };
            _context4.next = 20;
            return parseHistoricalNativePrice(tx);

          case 20:
            return _context4.abrupt("return", _context4.sent);

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function parseNewTransaction() {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @desc parse account transactions
 * @param  {Object} [data=null]
 * @param  {String} [address='']
 * @param  {String} [networks='']
 * @return {Array}
 */


exports.parseNewTransaction = parseNewTransaction;

var parseAccountTransactions =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6() {
    var data,
        address,
        network,
        transactions,
        _transactions,
        newPageResponse,
        newPageTransations,
        _args6 = arguments;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            data = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : null;
            address = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : '';
            network = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : '';

            if (!(!data || !data.docs)) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt("return", []);

          case 5:
            _context6.next = 7;
            return Promise.all(data.docs.map(
            /*#__PURE__*/
            function () {
              var _ref6 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee5(tx) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return parseTransaction(tx);

                      case 2:
                        return _context5.abrupt("return", _context5.sent);

                      case 3:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              }));

              return function (_x3) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 7:
            transactions = _context6.sent;
            _transactions = [];
            transactions.forEach(function (tx) {
              tx.forEach(function (subTx) {
                _transactions.push(subTx);
              });
            });

            if (!(data.pages > data.page)) {
              _context6.next = 24;
              break;
            }

            _context6.prev = 11;
            _context6.next = 14;
            return (0, _api.apiGetTransactionData)(address, network, data.page + 1);

          case 14:
            newPageResponse = _context6.sent;
            _context6.next = 17;
            return parseAccountTransactions(newPageResponse.data, address, network);

          case 17:
            newPageTransations = _context6.sent;
            _transactions = _toConsumableArray(_transactions).concat(_toConsumableArray(newPageTransations));
            _context6.next = 24;
            break;

          case 21:
            _context6.prev = 21;
            _context6.t0 = _context6["catch"](11);
            throw _context6.t0;

          case 24:
            return _context6.abrupt("return", _transactions);

          case 25:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[11, 21]]);
  }));

  return function parseAccountTransactions() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @desc parse transaction
 * @param  {Object} [data=null]
 * @return {Array}
 */


exports.parseAccountTransactions = parseAccountTransactions;

var parseTransaction =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(tx) {
    var hash, timestamp, error, from, to, asset, value, totalGas, txFee, includesTokenTransfer, result, results, tokenTransfers;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            hash = tx._id;
            timestamp = {
              secs: "".concat(tx.timeStamp),
              ms: "".concat(tx.timeStamp, "000")
            };
            error = !!tx.error;
            from = tx.from;
            to = tx.to;
            asset = {
              name: 'Ethereum',
              symbol: 'ETH',
              address: null,
              decimals: 18
            };
            value = {
              amount: tx.value,
              display: (0, _bignumber.convertAmountToDisplay)(tx.value, null, {
                symbol: 'ETH',
                decimals: 18
              })
            };
            totalGas = (0, _bignumber.multiply)(tx.gasUsed, tx.gasPrice);
            txFee = {
              amount: totalGas,
              display: (0, _bignumber.convertAmountToDisplay)(totalGas, null, {
                symbol: 'ETH',
                decimals: 18
              })
            };

            includesTokenTransfer = function () {
              if (tx.input !== '0x' && tx.operations && tx.operations.length) {
                var tokenTransfers = tx.operations.filter(function (operation) {
                  return operation.type === 'token_transfer';
                });

                if (tokenTransfers.length) {
                  return true;
                }
              }

              return false;
            }();

            result = {
              hash: hash,
              timestamp: timestamp,
              from: from,
              to: to,
              error: error,
              value: value,
              txFee: txFee,
              native: {},
              pending: false,
              asset: asset
            };
            results = [result];

            if (includesTokenTransfer) {
              tokenTransfers = [];

              if (tx.operations.length) {
                tx.operations.forEach(function (transferData, idx) {
                  var transferTx = {
                    hash: "".concat(result.hash, "-").concat(idx + 1),
                    timestamp: timestamp,
                    from: from,
                    to: to,
                    error: error,
                    value: value,
                    txFee: txFee,
                    native: {},
                    pending: false,
                    asset: asset
                  };
                  var name = !transferData.contract.name.startsWith('0x') ? transferData.contract.name : transferData.contract.symbol || 'Unknown Token';
                  transferTx.asset = {
                    name: name,
                    symbol: transferData.contract.symbol || '———',
                    address: transferData.contract.address || '',
                    decimals: transferData.contract.decimals || 18
                  };
                  transferTx.from = transferData.from;
                  transferTx.to = transferData.to;
                  var amount = (0, _bignumber.convertAssetAmountToBigNumber)(transferData.value, transferTx.asset.decimals);
                  transferTx.value = {
                    amount: amount,
                    display: (0, _bignumber.convertAmountToDisplay)(amount, null, transferTx.asset)
                  };
                  tokenTransfers.push(transferTx);
                });

                if (!Number(tx.value)) {
                  results = tokenTransfers.concat();
                } else {
                  result.hash = "".concat(result.hash, "-0");
                  results = tokenTransfers.concat([result]);
                }
              }
            }

            return _context7.abrupt("return", results);

          case 14:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function parseTransaction(_x4) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @desc parse transaction historical prices
 * @param  {Array} [transactions=null]
 * @return {Array}
 */


exports.parseTransaction = parseTransaction;

var parseHistoricalTransactions =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9() {
    var transactions,
        _transactions,
        _args9 = arguments;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            transactions = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : null;

            if (transactions.length) {
              _context9.next = 3;
              break;
            }

            return _context9.abrupt("return", transactions);

          case 3:
            _context9.next = 5;
            return Promise.all(transactions.map(
            /*#__PURE__*/
            function () {
              var _ref9 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8(tx, idx) {
                var parsedTxn;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        if (!(!tx.native || tx.native && Object.keys(tx.native).length < 1)) {
                          _context8.next = 5;
                          break;
                        }

                        _context8.next = 3;
                        return (0, _utilities.debounceRequest)(parseHistoricalNativePrice, [tx], 50 * idx);

                      case 3:
                        parsedTxn = _context8.sent;
                        return _context8.abrupt("return", parsedTxn);

                      case 5:
                        return _context8.abrupt("return", tx);

                      case 6:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, this);
              }));

              return function (_x5, _x6) {
                return _ref9.apply(this, arguments);
              };
            }()));

          case 5:
            _transactions = _context9.sent;
            return _context9.abrupt("return", _transactions);

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function parseHistoricalTransactions() {
    return _ref8.apply(this, arguments);
  };
}();

exports.parseHistoricalTransactions = parseHistoricalTransactions;