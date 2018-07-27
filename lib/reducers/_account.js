"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.accountClearState = exports.accountChangeNativeCurrency = exports.accountChangeLanguage = exports.accountUpdateNetwork = exports.accountUpdateAccountAddress = exports.accountUpdateExchange = exports.accountUpdateTransactions = exports.accountUpdateHasPendingTransaction = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _languages = _interopRequireWildcard(require("../languages"));

var _api = require("../handlers/api");

var _openseaApi = require("../handlers/opensea-api.js");

var _parsers = require("../handlers/parsers");

var _commonStorage = require("../handlers/commonStorage");

var _web = require("../handlers/web3");

var _notification = require("./_notification");

var _nativeCurrencies = _interopRequireDefault(require("../references/native-currencies.json"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// -- Constants ------------------------------------------------------------- //
var ACCOUNT_GET_ACCOUNT_TRANSACTIONS_REQUEST = 'account/ACCOUNT_GET_ACCOUNT_TRANSACTIONS_REQUEST';
var ACCOUNT_GET_ACCOUNT_TRANSACTIONS_SUCCESS = 'account/ACCOUNT_GET_ACCOUNT_TRANSACTIONS_SUCCESS';
var ACCOUNT_GET_ACCOUNT_TRANSACTIONS_FAILURE = 'account/ACCOUNT_GET_ACCOUNT_TRANSACTIONS_FAILURE';
var ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST = 'account/ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST';
var ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS = 'account/ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS';
var ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE = 'account/ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE';
var ACCOUNT_UPDATE_TRANSACTIONS_REQUEST = 'account/ACCOUNT_UPDATE_TRANSACTIONS_REQUEST';
var ACCOUNT_UPDATE_TRANSACTIONS_SUCCESS = 'account/ACCOUNT_UPDATE_TRANSACTIONS_SUCCESS';
var ACCOUNT_UPDATE_TRANSACTIONS_FAILURE = 'account/ACCOUNT_UPDATE_TRANSACTIONS_FAILURE';
var ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST = 'account/ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST';
var ACCOUNT_UPDATE_BALANCES_REQUEST = 'account/ACCOUNT_UPDATE_BALANCES_REQUEST';
var ACCOUNT_UPDATE_BALANCES_SUCCESS = 'account/ACCOUNT_UPDATE_BALANCES_SUCCESS';
var ACCOUNT_UPDATE_BALANCES_FAILURE = 'account/ACCOUNT_UPDATE_BALANCES_FAILURE';
var ACCOUNT_GET_NATIVE_PRICES_REQUEST = 'account/ACCOUNT_GET_NATIVE_PRICES_REQUEST';
var ACCOUNT_GET_NATIVE_PRICES_SUCCESS = 'account/ACCOUNT_GET_NATIVE_PRICES_SUCCESS';
var ACCOUNT_GET_NATIVE_PRICES_FAILURE = 'account/ACCOUNT_GET_NATIVE_PRICES_FAILURE';
var ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST = 'account/ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST';
var ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS = 'account/ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS';
var ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE = 'account/ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE';
var ACCOUNT_SHAPESHIFT_VERIFY_REQUEST = 'account/ACCOUNT_SHAPESHIFT_VERIFY_REQUEST';
var ACCOUNT_SHAPESHIFT_VERIFY_SUCCESS = 'account/ACCOUNT_SHAPESHIFT_VERIFY_SUCCESS';
var ACCOUNT_SHAPESHIFT_VERIFY_FAILURE = 'account/ACCOUNT_SHAPESHIFT_VERIFY_FAILURE';
var ACCOUNT_INITIALIZE_PRICES_REQUEST = 'account/ACCOUNT_INITIALIZE_PRICES_REQUEST';
var ACCOUNT_INITIALIZE_PRICES_SUCCESS = 'account/ACCOUNT_INITIALIZE_PRICES_SUCCESS';
var ACCOUNT_INITIALIZE_PRICES_FAILURE = 'account/ACCOUNT_INITIALIZE_PRICES_FAILURE';
var ACCOUNT_UPDATE_NETWORK = 'account/ACCOUNT_UPDATE_NETWORK';
var ACCOUNT_UPDATE_ACCOUNT_ADDRESS = 'account/ACCOUNT_UPDATE_ACCOUNT_ADDRESS';
var ACCOUNT_UPDATE_HAS_PENDING_TRANSACTION = 'account/ACCOUNT_UPDATE_HAS_PENDING_TRANSACTION';
var ACCOUNT_CHANGE_NATIVE_CURRENCY = 'account/ACCOUNT_CHANGE_NATIVE_CURRENCY';
var ACCOUNT_CLEAR_STATE = 'account/ACCOUNT_CLEAR_STATE';
var ACCOUNT_CHANGE_LANGUAGE = 'account/ACCOUNT_CHANGE_LANGUAGE'; // -- Actions --------------------------------------------------------------- //

var getPricesInterval = null;
var getAccountBalancesInterval = null;

var accountUpdateHasPendingTransaction = function accountUpdateHasPendingTransaction() {
  var hasPending = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return function (dispatch) {
    return dispatch({
      type: ACCOUNT_UPDATE_HAS_PENDING_TRANSACTION,
      payload: hasPending
    });
  };
};

exports.accountUpdateHasPendingTransaction = accountUpdateHasPendingTransaction;

var accountUpdateTransactions = function accountUpdateTransactions(txDetails) {
  return function (dispatch, getState) {
    dispatch({
      type: ACCOUNT_UPDATE_TRANSACTIONS_REQUEST
    });
    var currentTransactions = getState().account.transactions;
    var network = getState().account.network;
    var address = getState().account.accountInfo.address;
    var nativeCurrency = getState().account.nativeCurrency;
    (0, _parsers.parseNewTransaction)(txDetails, nativeCurrency).then(function (parsedTransaction) {
      var _transactions = _toConsumableArray(currentTransactions);

      _transactions = [parsedTransaction].concat(_toConsumableArray(_transactions));
      (0, _commonStorage.updateLocalTransactions)(address, _transactions, network);
      dispatch({
        type: ACCOUNT_UPDATE_TRANSACTIONS_SUCCESS,
        payload: _transactions
      });
      dispatch(accountCheckTransactionStatus(txDetails.hash));
    }).catch(function (error) {
      dispatch({
        type: ACCOUNT_UPDATE_TRANSACTIONS_FAILURE
      });
      var message = (0, _parsers.parseError)(error);
      dispatch((0, _notification.notificationShow)(message, true));
    });
  };
};

exports.accountUpdateTransactions = accountUpdateTransactions;

var accountUpdateExchange = function accountUpdateExchange(txns) {
  return function (dispatch, getState) {
    dispatch({
      type: ACCOUNT_UPDATE_TRANSACTIONS_REQUEST
    });
    var currentTransactions = getState().account.transactions;
    var network = getState().account.network;
    var address = getState().account.accountInfo.address;
    var nativeCurrency = getState().account.nativeCurrency;
    Promise.all(txns.map(function (txDetails) {
      return (0, _parsers.parseNewTransaction)(txDetails, nativeCurrency, address, network);
    })).then(function (parsedTransactions) {
      var _transactions = _toConsumableArray(parsedTransactions.reverse()).concat(_toConsumableArray(currentTransactions));

      (0, _commonStorage.updateLocalTransactions)(address, _transactions, network);
      dispatch({
        type: ACCOUNT_UPDATE_TRANSACTIONS_SUCCESS,
        payload: _transactions
      });
      txns.forEach(function (txn) {
        return dispatch(accountCheckTransactionStatus(txn.hash));
      });
    }).catch(function (error) {
      dispatch({
        type: ACCOUNT_UPDATE_TRANSACTIONS_FAILURE
      });
      var message = (0, _parsers.parseError)(error);
      dispatch((0, _notification.notificationShow)(message, true));
    });
  };
};

exports.accountUpdateExchange = accountUpdateExchange;

var accountUpdateAccountAddress = function accountUpdateAccountAddress(accountAddress, accountType) {
  return function (dispatch, getState) {
    if (!accountAddress || !accountType) return;
    var network = getState().account.network;
    if (getState().account.accountType !== accountType) dispatch(accountClearState());
    dispatch({
      type: ACCOUNT_UPDATE_ACCOUNT_ADDRESS,
      payload: {
        accountAddress: accountAddress,
        accountType: accountType
      }
    });
    dispatch(accountShapeshiftVerify());
    dispatch(accountUpdateNetwork(network));
    dispatch(accountGetAccountTransactions());
    dispatch(accountGetAccountBalances());
    dispatch(accountGetUniqueTokens());
  };
};

exports.accountUpdateAccountAddress = accountUpdateAccountAddress;

var accountUpdateNetwork = function accountUpdateNetwork(network) {
  return function (dispatch) {
    (0, _web.web3SetHttpProvider)("https://".concat(network, ".infura.io/"));
    dispatch({
      type: ACCOUNT_UPDATE_NETWORK,
      payload: network
    });
  };
};

exports.accountUpdateNetwork = accountUpdateNetwork;

var accountChangeLanguage = function accountChangeLanguage(language) {
  return function (dispatch) {
    //TODO: needs to trigger render after change
    (0, _languages.updateLanguage)(language);
    (0, _commonStorage.saveLanguage)(language);
    dispatch({
      type: ACCOUNT_CHANGE_LANGUAGE,
      payload: {
        language: language
      }
    });
  };
};

exports.accountChangeLanguage = accountChangeLanguage;

var accountChangeNativeCurrency = function accountChangeNativeCurrency(nativeCurrency) {
  return function (dispatch, getState) {
    (0, _commonStorage.saveNativeCurrency)(nativeCurrency);
    var prices = getState().account.prices || (0, _commonStorage.getNativePrices)();
    var accountAddress = getState().account.accountAddress;
    var network = getState().account.network;
    var selected = _nativeCurrencies.default[nativeCurrency];

    var newPrices = _objectSpread({}, prices, {
      selected: selected
    });

    var oldAccountInfo = getState().account.accountInfo;
    var newAccountInfo = (0, _parsers.parseAccountBalancesPrices)(oldAccountInfo, newPrices);

    var accountInfo = _objectSpread({}, oldAccountInfo, newAccountInfo);

    (0, _commonStorage.updateLocalBalances)(accountAddress, accountInfo, network);
    dispatch({
      type: ACCOUNT_CHANGE_NATIVE_CURRENCY,
      payload: {
        nativeCurrency: nativeCurrency,
        prices: newPrices,
        accountInfo: accountInfo
      }
    });
  };
};

exports.accountChangeNativeCurrency = accountChangeNativeCurrency;

var accountClearState = function accountClearState() {
  return function (dispatch) {
    clearInterval(getPricesInterval);
    clearInterval(getAccountBalancesInterval);
    dispatch({
      type: ACCOUNT_CLEAR_STATE
    });
  };
};

exports.accountClearState = accountClearState;

var accountGetNativePrices = function accountGetNativePrices(accountInfo) {
  return function (dispatch, getState) {
    var assetSymbols = accountInfo.assets.map(function (asset) {
      return asset.symbol;
    });

    var getPrices = function getPrices() {
      dispatch({
        type: ACCOUNT_GET_NATIVE_PRICES_REQUEST,
        payload: getState().account.nativeCurrency
      });
      (0, _api.apiGetPrices)(assetSymbols).then(function (_ref) {
        var data = _ref.data;
        var nativePriceRequest = getState().account.nativePriceRequest;
        var nativeCurrency = getState().account.nativeCurrency;
        var network = getState().account.network;

        if (nativeCurrency === nativePriceRequest) {
          var prices = (0, _parsers.parsePricesObject)(data, assetSymbols, nativeCurrency);
          var parsedAccountInfo = (0, _parsers.parseAccountBalancesPrices)(accountInfo, prices, network);
          (0, _commonStorage.updateLocalBalances)(parsedAccountInfo.address, parsedAccountInfo, network);
          (0, _commonStorage.saveNativePrices)(prices);
          dispatch({
            type: ACCOUNT_GET_NATIVE_PRICES_SUCCESS,
            payload: {
              accountInfo: parsedAccountInfo,
              prices: prices
            }
          });
        }
      }).catch(function (error) {
        dispatch({
          type: ACCOUNT_GET_NATIVE_PRICES_FAILURE
        });
        var message = (0, _parsers.parseError)(error);
        dispatch((0, _notification.notificationShow)(message, true));
      });
    };

    getPrices();
    clearInterval(getPricesInterval);
    getPricesInterval = setInterval(getPrices, 15000); // 15secs
  };
};

var accountShapeshiftVerify = function accountShapeshiftVerify() {
  return function (dispatch) {
    dispatch({
      type: ACCOUNT_SHAPESHIFT_VERIFY_REQUEST
    });
    (0, _api.apiShapeshiftGetCoins)().then(function (_ref2) {
      var data = _ref2.data;
      dispatch({
        type: ACCOUNT_SHAPESHIFT_VERIFY_SUCCESS
      });
    }).catch(function () {
      return dispatch({
        type: ACCOUNT_SHAPESHIFT_VERIFY_FAILURE
      });
    });
  };
};

var accountGetAccountBalances = function accountGetAccountBalances() {
  return function (dispatch, getState) {
    var _getState$account = getState().account,
        network = _getState$account.network,
        accountInfo = _getState$account.accountInfo,
        accountAddress = _getState$account.accountAddress,
        accountType = _getState$account.accountType;

    var cachedAccount = _objectSpread({}, accountInfo);

    var cachedTransactions = [];
    (0, _commonStorage.getAccountLocal)(accountAddress).then(function (accountLocal) {
      if (accountLocal && accountLocal[network]) {
        if (accountLocal[network].balances) {
          cachedAccount = _objectSpread({}, cachedAccount, {
            assets: accountLocal[network].balances.assets,
            total: accountLocal[network].balances.total
          });
        }

        if (accountLocal[network].type && !cachedAccount.type) {
          cachedAccount.type = accountLocal[network].type;
        }

        if (accountLocal[network].pending) {
          cachedTransactions = _toConsumableArray(accountLocal[network].pending);
        }

        if (accountLocal[network].transactions) {
          cachedTransactions = _lodash.default.unionBy(cachedTransactions, accountLocal[network].transactions, 'hash');
          (0, _commonStorage.updateLocalTransactions)(accountAddress, cachedTransactions, network);
        }
      }

      dispatch({
        type: ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST,
        payload: {
          accountType: cachedAccount.type || accountType,
          accountInfo: cachedAccount,
          transactions: cachedTransactions,
          fetching: accountLocal && !accountLocal[network] || !accountLocal
        }
      });
      dispatch(accountUpdateBalances());
    }).catch(function (error) {
      var message = (0, _parsers.parseError)(error);
      dispatch((0, _notification.notificationShow)(message, true));
    });
  };
};

var accountUpdateBalances = function accountUpdateBalances() {
  return function (dispatch, getState) {
    var _getState$account2 = getState().account,
        network = _getState$account2.network,
        accountAddress = _getState$account2.accountAddress,
        accountType = _getState$account2.accountType;

    var getAccountBalances = function getAccountBalances() {
      dispatch({
        type: ACCOUNT_UPDATE_BALANCES_REQUEST
      });
      (0, _api.apiGetAccountBalances)(accountAddress, network).then(function (_ref3) {
        var data = _ref3.data;

        var accountInfo = _objectSpread({}, data, {
          type: accountType
        });

        var prices = getState().account.prices;

        if (prices && prices.selected) {
          var parsedAccountInfo = (0, _parsers.parseAccountBalancesPrices)(accountInfo, prices, network);
          dispatch({
            type: ACCOUNT_UPDATE_BALANCES_SUCCESS,
            payload: parsedAccountInfo
          });
        }

        dispatch(accountGetNativePrices(accountInfo));
      }).catch(function (error) {
        var message = (0, _parsers.parseError)(error);
        dispatch((0, _notification.notificationShow)(message, true));
        dispatch({
          type: ACCOUNT_UPDATE_BALANCES_FAILURE
        });
      });
    };

    getAccountBalances();
    clearInterval(getAccountBalancesInterval);
    getAccountBalancesInterval = setInterval(getAccountBalances, 15000); // 15secs
  };
};

var accountGetAccountTransactions = function accountGetAccountTransactions() {
  return function (dispatch, getState) {
    var _getState$account3 = getState().account,
        accountAddress = _getState$account3.accountAddress,
        network = _getState$account3.network;
    var cachedTransactions = [];
    var confirmedTransactions = [];
    var accountLocal = (0, _commonStorage.getAccountLocal)(accountAddress) || null;

    if (accountLocal && accountLocal[network]) {
      if (accountLocal[network].pending) {
        cachedTransactions = _toConsumableArray(accountLocal[network].pending);
        accountLocal[network].pending.forEach(function (pendingTx) {
          return dispatch(accountCheckTransactionStatus(pendingTx.hash));
        });
      }

      if (accountLocal[network].transactions) {
        confirmedTransactions = accountLocal[network].transactions;
        cachedTransactions = _lodash.default.unionBy(cachedTransactions, accountLocal[network].transactions, 'hash');
        (0, _commonStorage.updateLocalTransactions)(accountAddress, cachedTransactions, network);
      }
    }

    dispatch({
      type: ACCOUNT_GET_ACCOUNT_TRANSACTIONS_REQUEST,
      payload: {
        transactions: cachedTransactions,
        fetchingTransactions: accountLocal && !accountLocal[network] || !accountLocal || !accountLocal[network].transactions || !accountLocal[network].transactions.length
      }
    });
    var lastTxHash = confirmedTransactions.length ? confirmedTransactions[0].hash : '';
    (0, _api.apiGetAccountTransactions)(accountAddress, network, lastTxHash).then(function (_ref4) {
      var data = _ref4.data;
      var transactions = data;
      var address = getState().account.accountAddress;
      var currentTransactions = getState().account.transactions;

      var _transactions = _lodash.default.unionBy(transactions, currentTransactions, 'hash');

      (0, _commonStorage.updateLocalTransactions)(address, _transactions, network);
      dispatch({
        type: ACCOUNT_GET_ACCOUNT_TRANSACTIONS_SUCCESS,
        payload: _transactions
      });
    }).catch(function (error) {
      dispatch((0, _notification.notificationShow)(_languages.default.t('notification.error.failed_get_account_tx'), true));
      dispatch({
        type: ACCOUNT_GET_ACCOUNT_TRANSACTIONS_FAILURE
      });
    });
  };
};

var accountCheckTransactionStatus = function accountCheckTransactionStatus(txHash) {
  return function (dispatch, getState) {
    dispatch({
      type: ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST
    });
    var network = getState().account.network;
    dispatch(accountGetTransactionStatus(txHash, network)); // NOTE: removed shapeshift logic here
  };
};

var accountGetUniqueTokens = function accountGetUniqueTokens() {
  return function (dispatch, getState) {
    var accountAddress = getState().account.accountAddress;
    dispatch({
      type: ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST
    });
    (0, _openseaApi.apiGetAccountUniqueTokens)(accountAddress).then(function (data) {
      dispatch({
        type: ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS,
        payload: data
      });
    }).catch(function (error) {
      var message = (0, _parsers.parseError)(error);
      dispatch((0, _notification.notificationShow)(message, true));
      dispatch({
        type: ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE
      });
    });
  };
};

var accountGetTransactionStatus = function accountGetTransactionStatus(txHash, network) {
  return function (dispatch, getState) {
    (0, _api.apiGetTransaction)(txHash, network).then(function (response) {
      var data = response.data;

      if (data && !data.error && (data.input === '0x' || data.input !== '0x' && data.operations && data.operations.length)) {
        var address = getState().account.accountInfo.address;
        var transactions = getState().account.transactions;
        var promises = transactions.map(
        /*#__PURE__*/
        function () {
          var _ref5 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(tx) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(tx.hash.toLowerCase() === txHash.toLowerCase())) {
                      _context.next = 6;
                      break;
                    }

                    _context.next = 3;
                    return (0, _parsers.parseConfirmedTransactions)(data);

                  case 3:
                    return _context.abrupt("return", _context.sent);

                  case 6:
                    return _context.abrupt("return", tx);

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function (_x) {
            return _ref5.apply(this, arguments);
          };
        }());
        Promise.all(promises).then(function (parsedTransactions) {
          var _ref6;

          var _transactions = (_ref6 = []).concat.apply(_ref6, _toConsumableArray(parsedTransactions));

          (0, _commonStorage.updateLocalTransactions)(address, _transactions, network);
          dispatch({
            type: ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS,
            payload: _transactions
          });
          dispatch(accountUpdateBalances());
        });
      } else {
        setTimeout(function () {
          return dispatch(accountGetTransactionStatus(txHash, network));
        }, 1000);
      }
    }).catch(function (error) {
      setTimeout(function () {
        return dispatch(accountGetTransactionStatus(txHash, network));
      }, 1000);
    });
  };
};

var accountGetShiftStatus = function accountGetShiftStatus(txHash, depositAddress) {
  return function (dispatch, getState) {
    dispatch({
      type: ACCOUNT_CHECK_TRANSACTION_STATUS_REQUEST
    });
    (0, _api.apiShapeshiftGetDepositStatus)(depositAddress).then(function (_ref7) {
      var data = _ref7.data;

      if (data) {
        var transactions = getState().account.transactions;
        var address = getState().account.accountInfo.address;
        var network = getState().account.network;

        if (data['status'] === 'complete') {
          var updatedTxHash = data['transaction'].toLowerCase();

          var _transactions = (0, _parsers.parseConfirmedDeposit)(transactions, txHash, updatedTxHash);

          (0, _commonStorage.updateLocalTransactions)(address, _transactions, network);
          dispatch({
            type: ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS,
            payload: _transactions
          });
          dispatch(accountGetTransactionStatus(updatedTxHash));
        } else if (data['status'] === 'failed') {
          var _transactions2 = (0, _parsers.parseFailedDeposit)(transactions, txHash);

          dispatch({
            type: ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS,
            payload: _transactions2
          });
          (0, _commonStorage.updateLocalTransactions)(address, _transactions2, network);
        } else {
          setTimeout(function () {
            return dispatch(accountGetShiftStatus(txHash, depositAddress));
          }, 1000);
        }
      } else {
        setTimeout(function () {
          return dispatch(accountGetShiftStatus(txHash, depositAddress));
        }, 1000);
      }
    }).catch(function (error) {
      dispatch({
        type: ACCOUNT_CHECK_TRANSACTION_STATUS_FAILURE
      });
      var message = (0, _parsers.parseError)(error);
      dispatch((0, _notification.notificationShow)(message, true));
    });
  };
}; // -- Reducer --------------------------------------------------------------- //


var INITIAL_STATE = {
  accountType: '',
  accountAddress: '',
  accountInfo: {
    address: '',
    accountType: '',
    assets: [{
      name: 'Ethereum',
      symbol: 'ETH',
      address: null,
      decimals: 18,
      balance: {
        amount: '',
        display: '0.00 ETH'
      },
      native: null
    }],
    total: '———'
  },
  fetching: false,
  fetchingShapeshift: false,
  fetchingTransactions: false,
  fetchingUniqueTokens: false,
  hasPendingTransaction: false,
  language: (0, _commonStorage.getLanguage)() || 'en',
  nativePriceRequest: (0, _commonStorage.getNativeCurrency)() || 'USD',
  nativeCurrency: (0, _commonStorage.getNativeCurrency)() || 'USD',
  network: 'mainnet',
  prices: {},
  shapeshiftAvailable: true,
  transactions: [],
  uniqueTokens: []
};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ACCOUNT_UPDATE_ACCOUNT_ADDRESS:
      return _objectSpread({}, state, {
        accountType: action.payload.accountType,
        accountAddress: action.payload.accountAddress,
        transactions: []
      });

    case ACCOUNT_GET_ACCOUNT_TRANSACTIONS_REQUEST:
      return _objectSpread({}, state, {
        fetchingTransactions: action.payload.fetchingTransactions,
        transactions: action.payload.transactions
      });

    case ACCOUNT_GET_ACCOUNT_TRANSACTIONS_SUCCESS:
      return _objectSpread({}, state, {
        fetchingTransactions: false,
        transactions: action.payload
      });

    case ACCOUNT_GET_ACCOUNT_TRANSACTIONS_FAILURE:
      return _objectSpread({}, state, {
        fetchingTransactions: false
      });

    case ACCOUNT_CHECK_TRANSACTION_STATUS_SUCCESS:
      return _objectSpread({}, state, {
        transactions: action.payload
      });

    case ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST:
      return _objectSpread({}, state, {
        fetchingUniqueTokens: true
      });

    case ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS:
      return _objectSpread({}, state, {
        fetchingUniqueTokens: false,
        uniqueTokens: action.payload
      });

    case ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE:
      return _objectSpread({}, state, {
        fetchingUniqueTokens: false
      });

    case ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST:
      return _objectSpread({}, state, {
        fetching: action.payload.fetching,
        accountType: action.payload.accountType,
        accountInfo: action.payload.accountInfo,
        transactions: action.payload.transactions
      });

    case ACCOUNT_UPDATE_BALANCES_REQUEST:
      return _objectSpread({}, state, {
        fetching: true
      });

    case ACCOUNT_UPDATE_BALANCES_SUCCESS:
      return _objectSpread({}, state, {
        accountInfo: action.payload,
        fetching: false
      });

    case ACCOUNT_UPDATE_BALANCES_FAILURE:
      return _objectSpread({}, state, {
        fetching: false
      });

    case ACCOUNT_GET_NATIVE_PRICES_REQUEST:
      return _objectSpread({}, state, {
        fetchingNativePrices: true,
        nativePriceRequest: action.payload
      });

    case ACCOUNT_GET_NATIVE_PRICES_SUCCESS:
      return _objectSpread({}, state, {
        fetchingNativePrices: false,
        nativePriceRequest: '',
        prices: action.payload.prices,
        accountInfo: action.payload.accountInfo
      });

    case ACCOUNT_GET_NATIVE_PRICES_FAILURE:
      return _objectSpread({}, state, {
        fetchingNativePrices: false,
        nativePriceRequest: 'USD'
      });

    case ACCOUNT_INITIALIZE_PRICES_REQUEST:
      return _objectSpread({}, state, {
        nativePriceRequest: 'USD',
        nativeCurrency: 'USD',
        prices: {}
      });

    case ACCOUNT_INITIALIZE_PRICES_SUCCESS:
      return _objectSpread({}, state, {
        nativePriceRequest: action.payload.nativeCurrency,
        nativeCurrency: action.payload.nativeCurrency,
        prices: action.payload.prices
      });

    case ACCOUNT_INITIALIZE_PRICES_FAILURE:
      return _objectSpread({}, state, {
        nativePriceRequest: 'USD',
        nativeCurrency: 'USD',
        prices: {}
      });

    case ACCOUNT_UPDATE_HAS_PENDING_TRANSACTION:
      return _objectSpread({}, state, {
        hasPendingTransaction: action.payload
      });

    case ACCOUNT_SHAPESHIFT_VERIFY_REQUEST:
      return _objectSpread({}, state, {
        fetchingShapeshift: true
      });

    case ACCOUNT_SHAPESHIFT_VERIFY_SUCCESS:
      return _objectSpread({}, state, {
        fetchingShapeshift: false,
        shapeshiftAvailable: true
      });

    case ACCOUNT_SHAPESHIFT_VERIFY_FAILURE:
      return _objectSpread({}, state, {
        fetchingShapeshift: false,
        shapeshiftAvailable: false
      });

    case ACCOUNT_CHANGE_NATIVE_CURRENCY:
      return _objectSpread({}, state, {
        nativeCurrency: action.payload.nativeCurrency,
        prices: action.payload.prices,
        accountInfo: action.payload.accountInfo
      });

    case ACCOUNT_CHANGE_LANGUAGE:
      return _objectSpread({}, state, {
        language: action.payload.language
      });

    case ACCOUNT_CLEAR_STATE:
      return _objectSpread({}, state, INITIAL_STATE);

    default:
      return state;
  }
};

exports.default = _default;