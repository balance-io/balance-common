"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "account", {
  enumerable: true,
  get: function get() {
    return _reducers.account;
  }
});
Object.defineProperty(exports, "accountChangeLanguage", {
  enumerable: true,
  get: function get() {
    return _reducers.accountChangeLanguage;
  }
});
Object.defineProperty(exports, "accountChangeNativeCurrency", {
  enumerable: true,
  get: function get() {
    return _reducers.accountChangeNativeCurrency;
  }
});
Object.defineProperty(exports, "accountUpdateNetwork", {
  enumerable: true,
  get: function get() {
    return _reducers.accountUpdateNetwork;
  }
});
Object.defineProperty(exports, "accountClearState", {
  enumerable: true,
  get: function get() {
    return _reducers.accountClearState;
  }
});
Object.defineProperty(exports, "accountUpdateAccountAddress", {
  enumerable: true,
  get: function get() {
    return _reducers.accountUpdateAccountAddress;
  }
});
Object.defineProperty(exports, "accountUpdateExchange", {
  enumerable: true,
  get: function get() {
    return _reducers.accountUpdateExchange;
  }
});
Object.defineProperty(exports, "accountUpdateHasPendingTransaction", {
  enumerable: true,
  get: function get() {
    return _reducers.accountUpdateHasPendingTransaction;
  }
});
Object.defineProperty(exports, "accountUpdateTransactions", {
  enumerable: true,
  get: function get() {
    return _reducers.accountUpdateTransactions;
  }
});
Object.defineProperty(exports, "send", {
  enumerable: true,
  get: function get() {
    return _reducers.send;
  }
});
exports.bignumber = exports.commonStorage = void 0;

var _reducers = require("./reducers");

var commonStorage = _interopRequireWildcard(require("./handlers/commonStorage"));

exports.commonStorage = commonStorage;

var bignumber = _interopRequireWildcard(require("./helpers/bignumber"));

exports.bignumber = bignumber;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }