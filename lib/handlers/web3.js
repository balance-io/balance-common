"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.estimateGasLimit = exports.createSignableTransaction = exports.web3SendSignedTransaction = exports.getTransferTokenTransaction = exports.getTxDetails = exports.getTokenBalanceOf = exports.getAccountBalance = exports.getBlockByHash = exports.getTransactionByHash = exports.getTransactionCount = exports.sha3 = exports.toWei = exports.fromWei = exports.toChecksumAddress = exports.web3SetHttpProvider = exports.web3Instance = void 0;

var _web = _interopRequireDefault(require("web3"));

var _validators = require("../helpers/validators");

var _utilities = require("../helpers/utilities");

var _bignumber = require("../helpers/bignumber");

var _ethereumUnits = _interopRequireDefault(require("../references/ethereum-units.json"));

var _smartcontractMethods = _interopRequireDefault(require("../references/smartcontract-methods.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * @desc web3 http instance
 */
var web3Instance = new _web.default(new _web.default.providers.HttpProvider("https://mainnet.infura.io/"));
/**
 * @desc set a different web3 provider
 * @param {String}
 */

exports.web3Instance = web3Instance;

var web3SetHttpProvider = function web3SetHttpProvider(provider) {
  var providerObj = null;

  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new _web.default.providers.HttpProvider(provider);
  }

  if (!providerObj) {
    throw new Error('function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint');
  }

  return web3Instance.setProvider(providerObj);
};
/**
 * @desc convert to checksum address
 * @param  {String} address
 * @return {String}
 */


exports.web3SetHttpProvider = web3SetHttpProvider;

var toChecksumAddress = function toChecksumAddress(address) {
  if (typeof address === 'undefined') return '';
  address = address.toLowerCase().replace('0x', '');
  var addressHash = web3Instance.utils.sha3(address).replace('0x', '');
  var checksumAddress = '0x';

  for (var i = 0; i < address.length; i++) {
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }

  return checksumAddress;
};
/**
 * @desc convert from wei to ether
 * @param  {Number} wei
 * @return {BigNumber}
 */


exports.toChecksumAddress = toChecksumAddress;

var fromWei = function fromWei(wei) {
  return web3Instance.utils.fromWei(wei);
};
/**
 * @desc convert from ether to wei
 * @param  {Number} ether
 * @return {BigNumber}
 */


exports.fromWei = fromWei;

var toWei = function toWei(ether) {
  return web3Instance.utils.toWei(ether);
};
/**
 * @desc hash string with sha3
 * @param  {String} string
 * @return {String}
 */


exports.toWei = toWei;

var sha3 = function sha3(string) {
  return web3Instance.utils.sha3(string);
};
/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */


exports.sha3 = sha3;

var getTransactionCount = function getTransactionCount(address) {
  return web3Instance.eth.getTransactionCount(address, 'pending');
};
/**
 * @desc get transaction by hash
 * @param   {String}  hash
 * @return  {Promise}
 */


exports.getTransactionCount = getTransactionCount;

var getTransactionByHash = function getTransactionByHash(hash) {
  return web3Instance.eth.getTransaction(hash);
};
/**
 * @desc get block by hash
 * @param   {String}  hash
 * @return  {Promise}
 */


exports.getTransactionByHash = getTransactionByHash;

var getBlockByHash = function getBlockByHash(hash) {
  return web3Instance.eth.getBlock(hash);
};
/**
 * @desc get account ether balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */


exports.getBlockByHash = getBlockByHash;

var getAccountBalance =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(address) {
    var wei, ether, balance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return web3Instance.eth.getBalance(address);

          case 2:
            wei = _context.sent;
            ether = fromWei(wei);
            balance = (0, _bignumber.convertStringToNumber)(ether) !== 0 ? (0, _bignumber.convertNumberToString)(ether) : 0;
            return _context.abrupt("return", balance);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getAccountBalance(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @desc get account token balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */


exports.getAccountBalance = getAccountBalance;

var getTokenBalanceOf = function getTokenBalanceOf(accountAddress, tokenAddress) {
  return new Promise(function (resolve, reject) {
    var balanceMethodHash = _smartcontractMethods.default.token_balance.hash;
    var dataString = (0, _utilities.getDataString)(balanceMethodHash, [(0, _utilities.removeHexPrefix)(accountAddress)]);
    web3Instance.eth.call({
      to: tokenAddress,
      data: dataString
    }).then(function (balanceHexResult) {
      var balance = (0, _bignumber.convertHexToString)(balanceHexResult);
      resolve(balance);
    }).catch(function (error) {
      return reject(error);
    });
  });
};
/**
 * @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */


exports.getTokenBalanceOf = getTokenBalanceOf;

var getTxDetails =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref2) {
    var from, to, data, value, gasPrice, gasLimit, _gasPrice, estimateGasData, _gasLimit, nonce, tx;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            from = _ref2.from, to = _ref2.to, data = _ref2.data, value = _ref2.value, gasPrice = _ref2.gasPrice, gasLimit = _ref2.gasLimit;
            _context2.t0 = gasPrice;

            if (_context2.t0) {
              _context2.next = 6;
              break;
            }

            _context2.next = 5;
            return web3Instance.eth.getGasPrice();

          case 5:
            _context2.t0 = _context2.sent;

          case 6:
            _gasPrice = _context2.t0;
            estimateGasData = value === '0x00' ? {
              from: from,
              to: to,
              data: data
            } : {
              to: to,
              data: data
            };
            _context2.t1 = gasLimit;

            if (_context2.t1) {
              _context2.next = 13;
              break;
            }

            _context2.next = 12;
            return web3Instance.eth.estimateGas(estimateGasData);

          case 12:
            _context2.t1 = _context2.sent;

          case 13:
            _gasLimit = _context2.t1;
            _context2.next = 16;
            return getTransactionCount(from);

          case 16:
            nonce = _context2.sent;
            tx = {
              from: from,
              to: to,
              nonce: web3Instance.utils.toHex(nonce),
              gasPrice: web3Instance.utils.toHex(_gasPrice),
              gasLimit: web3Instance.utils.toHex(_gasLimit),
              gas: web3Instance.utils.toHex(_gasLimit),
              value: web3Instance.utils.toHex(value),
              data: data
            };
            return _context2.abrupt("return", tx);

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getTxDetails(_x2) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @desc get transfer token transaction
 * @param  {Object}  transaction { asset, from, to, amount, gasPrice }
 * @return {Object}
 */


exports.getTxDetails = getTxDetails;

var getTransferTokenTransaction = function getTransferTokenTransaction(transaction) {
  var transferMethodHash = _smartcontractMethods.default.token_transfer.hash;
  var value = (0, _bignumber.convertStringToHex)((0, _bignumber.convertAmountToAssetAmount)(transaction.amount, transaction.asset.decimals));
  var recipient = (0, _utilities.removeHexPrefix)(transaction.to);
  var dataString = (0, _utilities.getDataString)(transferMethodHash, [recipient, value]);
  return {
    from: transaction.from,
    to: transaction.asset.address,
    data: dataString,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit
  };
};
/**
 * @desc send signed transaction
 * @param  {String}  signedTx
 * @return {Promise}
 */


exports.getTransferTokenTransaction = getTransferTokenTransaction;

var web3SendSignedTransaction = function web3SendSignedTransaction(signedTx) {
  return new Promise(function (resolve, reject) {
    var serializedTx = typeof signedTx === 'string' ? signedTx : signedTx.raw;
    web3Instance.eth.sendSignedTransaction(serializedTx).once('transactionHash', function (txHash) {
      return resolve(txHash);
    }).catch(function (error) {
      return reject(error);
    });
  });
};
/**
 * @desc transform into signable transaction
 * @param {Object} transaction { asset, from, to, amount, gasPrice }
 * @return {Promise}
 */


exports.web3SendSignedTransaction = web3SendSignedTransaction;

var createSignableTransaction = function createSignableTransaction(transaction) {
  transaction.value = transaction.amount;

  if (transaction.asset.symbol !== 'ETH') {
    transaction = getTransferTokenTransaction(transaction);
  }

  var from = transaction.from.substr(0, 2) === '0x' ? transaction.from : "0x".concat(transaction.from);
  var to = transaction.to.substr(0, 2) === '0x' ? transaction.to : "0x".concat(transaction.to);
  var value = transaction.value ? toWei(transaction.value) : '0x00';
  var data = transaction.data ? transaction.data : '0x';
  return getTxDetails({
    from: from,
    to: to,
    data: data,
    value: value,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit
  });
};
/**
 * @desc estimate gas limit
 * @param {Object} [{selected, address, recipient, amount, gasPrice}]
 * @return {String}
 */


exports.createSignableTransaction = createSignableTransaction;

var estimateGasLimit =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref4) {
    var asset, address, recipient, amount, gasLimit, data, _amount, _recipient, estimateGasData, transferMethodHash, value;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            asset = _ref4.asset, address = _ref4.address, recipient = _ref4.recipient, amount = _ref4.amount;
            gasLimit = _ethereumUnits.default.basic_tx;
            data = '0x';
            _amount = amount && Number(amount) ? (0, _bignumber.convertAmountToBigNumber)(amount) : asset.balance.amount * 0.1;
            _recipient = recipient && (0, _validators.isValidAddress)(recipient) ? recipient : '0x737e583620f4ac1842d4e354789ca0c5e0651fbb';
            estimateGasData = {
              to: _recipient,
              data: data
            };

            if (!(asset.symbol !== 'ETH')) {
              _context3.next = 15;
              break;
            }

            transferMethodHash = _smartcontractMethods.default.token_transfer.hash;
            value = (0, _bignumber.convertAssetAmountFromBigNumber)(_amount, asset.decimals);
            value = (0, _bignumber.convertStringToHex)(value);
            data = (0, _utilities.getDataString)(transferMethodHash, [(0, _utilities.removeHexPrefix)(_recipient), value]);
            estimateGasData = {
              from: address,
              to: asset.address,
              data: data,
              value: '0x0'
            };
            _context3.next = 14;
            return web3Instance.eth.estimateGas(estimateGasData);

          case 14:
            gasLimit = _context3.sent;

          case 15:
            return _context3.abrupt("return", gasLimit);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function estimateGasLimit(_x3) {
    return _ref5.apply(this, arguments);
  };
}();

exports.estimateGasLimit = estimateGasLimit;