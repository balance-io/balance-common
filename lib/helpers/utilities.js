"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcTxFee = exports.transactionData = exports.getEth = exports.getUrlParameter = exports.getDerivationPathComponents = exports.getDataString = exports.removeHexPrefix = exports.sanitizeHex = exports.padLeft = exports.ellipseText = exports.capitalize = exports.debounceRequest = void 0;

var _bignumber = require("./bignumber");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * @desc debounce api request
 * @param  {Function}  request
 * @param  {Array}     params
 * @param  {Number}    timeout
 * @return {Promise}
 */
var debounceRequest = function debounceRequest(request, params, timeout) {
  return new Promise(function (resolve, reject) {
    return setTimeout(function () {
      return request.apply(void 0, _toConsumableArray(params)).then(function (res) {
        resolve(res);
      }).catch(function (err) {
        return reject(err);
      });
    }, timeout);
  });
};
/**
 * @desc capitalize string
 * @param  {String} [string]
 * @return {String}
 */


exports.debounceRequest = debounceRequest;

var capitalize = function capitalize(string) {
  return string.split(' ').map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};
/**
 * @desc ellipse text to max maxLength
 * @param  {String}  [text = '']
 * @param  {Number}  [maxLength = 9999]
 * @return {Intercom}
 */


exports.capitalize = capitalize;

var ellipseText = function ellipseText() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9999;
  if (text.length <= maxLength) return text;

  var _maxLength = maxLength - 3;

  var ellipse = false;
  var currentLength = 0;
  var result = text.split(' ').filter(function (word) {
    currentLength += word.length;

    if (ellipse || currentLength >= _maxLength) {
      ellipse = true;
      return false;
    } else {
      return true;
    }
  }).join(' ') + '...';
  return result;
};
/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */


exports.ellipseText = ellipseText;

var padLeft = function padLeft(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
/**
 * @desc sanitize hexadecimal string
 * @param  {String} address
 * @return {String}
 */


exports.padLeft = padLeft;

var sanitizeHex = function sanitizeHex(hex) {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') return '';
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return '0x' + hex;
};
/**
 * @desc remove hex prefix
 * @param  {String} hex
 * @return {String}
 */


exports.sanitizeHex = sanitizeHex;

var removeHexPrefix = function removeHexPrefix(hex) {
  return hex.toLowerCase().replace('0x', '');
};
/**
 * @desc get ethereum contract call data string
 * @param  {String} func
 * @param  {Array}  arrVals
 * @return {String}
 */


exports.removeHexPrefix = removeHexPrefix;

var getDataString = function getDataString(func, arrVals) {
  var val = '';

  for (var i = 0; i < arrVals.length; i++) {
    val += padLeft(arrVals[i], 64);
  }

  var data = func + val;
  return data;
};
/**
 * @desc get derivation path components
 * @param  {String}  [derivationPath = '']
 * @return {Object}
 */


exports.getDataString = getDataString;

var getDerivationPathComponents = function getDerivationPathComponents() {
  var derivationPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var regExp = /^(44'\/6[0|1]'\/\d+'?\/)(\d+)$/;
  var matchResult = regExp.exec(derivationPath);

  if (matchResult === null) {
    throw new Error("To get multiple accounts your derivation path must follow pattern 44'/60|61'/x'/n ");
  }

  return {
    basePath: matchResult[1],
    index: parseInt(matchResult[2], 10)
  };
};
/**
 * @desc returns url parameter value
 * @param  {String} parameter
 * @param  {String} url
 * @return {String}
 */


exports.getDerivationPathComponents = getDerivationPathComponents;

var getUrlParameter = function getUrlParameter(parameter) {
  var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : typeof window !== 'undefined' ? window.location.href : '';
  var name = parameter.replace(/[[]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
/**
 * @desc returns an eth asset object
 * @param  {Array} assets
 * @return {Object}
 */


exports.getUrlParameter = getUrlParameter;

var getEth = function getEth(assets) {
  return assets.filter(function (asset) {
    return asset.symbol === 'ETH';
  })[0];
};
/**
 * @desc returns an object
 * @param  {String} accountInfo
 * @param  {String} assetAmount
 * @param  {String} gasPrice
 * @return {Object} ethereum, balanceAmount, balance, requestedAmount, txFeeAmount, txFee, amountWithFees
 */


exports.getEth = getEth;

var transactionData = function transactionData(accountInfo, assetAmount, gasPrice) {
  var ethereum = getEth(accountInfo.assets);
  var balanceAmount = ethereum.balance.amount;
  var balance = (0, _bignumber.convertAmountFromBigNumber)(balanceAmount);
  var requestedAmount = (0, _bignumber.convertNumberToString)(assetAmount);
  var txFeeAmount = gasPrice.txFee.value.amount;
  var txFee = (0, _bignumber.convertAmountFromBigNumber)(txFeeAmount);
  var amountWithFees = (0, _bignumber.add)(requestedAmount, txFee);
  return {
    ethereum: ethereum,
    balanceAmount: balanceAmount,
    balance: balance,
    requestedAmount: requestedAmount,
    txFeeAmount: txFeeAmount,
    txFee: txFee,
    amountWithFees: amountWithFees
  };
};
/**
 * @desc calculates the native and tx fee for a transaction
 * @param  {Array} gasPrices
 * @param  {Object} gasPriceOption
 * @param  {Object} nativeCurrency
 * @return {String} native and txFee
 */


exports.transactionData = transactionData;

var calcTxFee = function calcTxFee(gasPrices, gasPriceOption, nativeCurrency) {
  var option = gasPrices[gasPriceOption];
  var txFeeNative = option && option.txFee.native ? option.txFee.native.value.display : '$0.00';
  var txFee = nativeCurrency !== 'ETH' ? " (".concat(option && option.txFee ? option.txFee.value.display : '0.000 ETH', ")") : '';
  return "".concat(txFeeNative).concat(txFee);
};

exports.calcTxFee = calcTxFee;