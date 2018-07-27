"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveLanguage = exports.getLanguage = exports.saveWalletConnectAccount = exports.getWalletConnectAccount = exports.updateLocalTransactions = exports.updateLocalBalances = exports.saveNativeCurrency = exports.getNativeCurrency = exports.saveNativePrices = exports.getNativePrices = exports.getAccountLocal = exports.removeLocal = exports.getLocal = exports.saveLocal = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var defaultVersion = '0.1.0';
var accountLocalVersion = '0.1.0';
var globalSettingsVersion = '0.1.0';
var walletConnectVersion = '0.1.0';
/**
 * @desc save to storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @param  {String} [version=defaultVersion]
 */

var saveLocal =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var key,
        data,
        version,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            key = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
            data = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            version = _args.length > 2 && _args[2] !== undefined ? _args[2] : defaultVersion;
            _context.prev = 3;
            data['storageVersion'] = version;
            _context.next = 7;
            return storage.save({
              key: key,
              data: data,
              expires: null
            });

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            console.log('Storage: error saving to local for key', key);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 9]]);
  }));

  return function saveLocal() {
    return _ref.apply(this, arguments);
  };
}();
/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */


exports.saveLocal = saveLocal;

var getLocal =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var key,
        version,
        result,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            key = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : '';
            version = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : defaultVersion;
            _context2.prev = 2;
            _context2.next = 5;
            return storage.load({
              key: key,
              autoSync: false,
              syncInBackground: false
            });

          case 5:
            result = _context2.sent;

            if (!(result && result.storageVersion === version)) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", result);

          case 10:
            if (!result) {
              _context2.next = 14;
              break;
            }

            _context2.next = 13;
            return removeLocal(key);

          case 13:
            return _context2.abrupt("return", null);

          case 14:
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](2);
            console.log('Storage: error getting from local for key', key);
            return _context2.abrupt("return", null);

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 16]]);
  }));

  return function getLocal() {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */


exports.getLocal = getLocal;

var removeLocal =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var key,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            key = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : '';
            _context3.prev = 1;
            _context3.next = 4;
            return storage.removeItem({
              key: key
            });

          case 4:
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](1);
            console.log('error removing local with key', key);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 6]]);
  }));

  return function removeLocal() {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * @desc get account local
 * @param  {String}   [address]
 * @return {Object}
 */


exports.removeLocal = removeLocal;

var getAccountLocal =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(accountAddress) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getLocal(accountAddress, accountLocalVersion);

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getAccountLocal(_x) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * @desc get native prices
 * @return {Object}
 */


exports.getAccountLocal = getAccountLocal;

var getNativePrices =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5() {
    var nativePrices;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getLocal('nativePrices', accountLocalVersion);

          case 2:
            nativePrices = _context5.sent;
            return _context5.abrupt("return", nativePrices ? nativePrices.data : null);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getNativePrices() {
    return _ref5.apply(this, arguments);
  };
}();
/**
 * @desc save native prices
 * @param  {String}   [address]
 */


exports.getNativePrices = getNativePrices;

var saveNativePrices =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(nativePrices) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return saveLocal('nativePrices', {
              data: nativePrices
            }, accountLocalVersion);

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function saveNativePrices(_x2) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * @desc get native currency
 * @return {Object}
 */


exports.saveNativePrices = saveNativePrices;

var getNativeCurrency =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7() {
    var nativeCurrency;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getLocal('nativeCurrency', globalSettingsVersion);

          case 2:
            nativeCurrency = _context7.sent;
            return _context7.abrupt("return", nativeCurrency ? nativeCurrency.data : null);

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function getNativeCurrency() {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * @desc save native currency
 * @param  {String}   [currency]
 */


exports.getNativeCurrency = getNativeCurrency;

var saveNativeCurrency =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(nativeCurrency) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return saveLocal('nativeCurrency', {
              data: nativeCurrency
            }, globalSettingsVersion);

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function saveNativeCurrency(_x3) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * @desc update local balances
 * @param  {String}   [address]
 * @param  {Object}   [account]
 * @param  {String}   [network]
 * @return {Void}
 */


exports.saveNativeCurrency = saveNativeCurrency;

var updateLocalBalances =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(address, account, network) {
    var accountLocal;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (address) {
              _context9.next = 2;
              break;
            }

            return _context9.abrupt("return");

          case 2:
            _context9.next = 4;
            return getLocal(address);

          case 4:
            _context9.t0 = _context9.sent;

            if (_context9.t0) {
              _context9.next = 7;
              break;
            }

            _context9.t0 = {};

          case 7:
            accountLocal = _context9.t0;

            if (!accountLocal[network]) {
              accountLocal[network] = {};
            }

            accountLocal[network].type = account.type;
            accountLocal[network].balances = {
              assets: account.assets,
              total: account.total || '———'
            };
            _context9.next = 13;
            return saveLocal(address, accountLocal, accountLocalVersion);

          case 13:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function updateLocalBalances(_x4, _x5, _x6) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * @desc update local transactions
 * @param  {String}   [address]
 * @param  {Array}    [transactions]
 * @param  {String}   [network]
 * @return {Void}
 */


exports.updateLocalBalances = updateLocalBalances;

var updateLocalTransactions =
/*#__PURE__*/
function () {
  var _ref10 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee10(address, transactions, network) {
    var accountLocal, pending, _transactions;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (address) {
              _context10.next = 2;
              break;
            }

            return _context10.abrupt("return");

          case 2:
            _context10.next = 4;
            return getLocal(address);

          case 4:
            _context10.t0 = _context10.sent;

            if (_context10.t0) {
              _context10.next = 7;
              break;
            }

            _context10.t0 = {};

          case 7:
            accountLocal = _context10.t0;
            pending = [];
            _transactions = [];
            transactions.forEach(function (tx) {
              if (tx.pending) {
                pending.push(tx);
              } else {
                _transactions.push(tx);
              }
            });

            if (!accountLocal[network]) {
              accountLocal[network] = {};
            }

            accountLocal[network].transactions = _transactions;
            accountLocal[network].pending = pending;
            _context10.next = 16;
            return saveLocal(address, accountLocal, accountLocalVersion);

          case 16:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function updateLocalTransactions(_x7, _x8, _x9) {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * @desc get wallet connect account
 * @return {Object}
 */


exports.updateLocalTransactions = updateLocalTransactions;

var getWalletConnectAccount =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11() {
    var walletConnectAccount;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return getLocal('walletconnect', walletConnectVersion);

          case 2:
            walletConnectAccount = _context11.sent;
            return _context11.abrupt("return", walletConnectAccount ? walletConnectAccount.data : null);

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function getWalletConnectAccount() {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * @desc save wallet connect account
 * @param  {String}   [address]
 */


exports.getWalletConnectAccount = getWalletConnectAccount;

var saveWalletConnectAccount =
/*#__PURE__*/
function () {
  var _ref12 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(account) {
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return saveLocal('walletconnect', {
              data: account
            }, walletConnectVersion);

          case 2:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function saveWalletConnectAccount(_x10) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * @desc get language
 * @return {Object}
 */


exports.saveWalletConnectAccount = saveWalletConnectAccount;

var getLanguage =
/*#__PURE__*/
function () {
  var _ref13 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13() {
    var language;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return getLocal('language', globalSettingsVersion);

          case 2:
            language = _context13.sent;
            return _context13.abrupt("return", language ? language.data : null);

          case 4:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function getLanguage() {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * @desc save language
 * @param  {String}   [language]
 */


exports.getLanguage = getLanguage;

var saveLanguage =
/*#__PURE__*/
function () {
  var _ref14 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(language) {
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return saveLocal('language', {
              data: language
            }, globalSettingsVersion);

          case 2:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function saveLanguage(_x11) {
    return _ref14.apply(this, arguments);
  };
}();

exports.saveLanguage = saveLanguage;