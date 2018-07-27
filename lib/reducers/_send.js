"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.sendClearFields = exports.sendMaxBalance = exports.sendUpdateSelected = exports.sendUpdateNativeAmount = exports.sendUpdateAssetAmount = exports.sendUpdateRecipient = exports.sendToggleConfirmationView = exports.sendTransaction = exports.sendUpdateGasPrice = exports.sendModalInit = void 0;

var _api = require("../handlers/api");

var _languages = _interopRequireDefault(require("../languages"));

var _ethereumUnits = _interopRequireDefault(require("../references/ethereum-units.json"));

var _bignumber = require("../helpers/bignumber");

var _parsers = require("../handlers/parsers");

var _web = require("../handlers/web3");

var _notification = require("./_notification");

var _account = require("./_account");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// -- Constants ------------------------------------------------------------- //
var SEND_GET_GAS_PRICES_REQUEST = 'send/SEND_GET_GAS_PRICES_REQUEST';
var SEND_GET_GAS_PRICES_SUCCESS = 'send/SEND_GET_GAS_PRICES_SUCCESS';
var SEND_GET_GAS_PRICES_FAILURE = 'send/SEND_GET_GAS_PRICES_FAILURE';
var SEND_UPDATE_GAS_PRICE_REQUEST = 'send/SEND_UPDATE_GAS_PRICE_REQUEST';
var SEND_UPDATE_GAS_PRICE_SUCCESS = 'send/SEND_UPDATE_GAS_PRICE_SUCCESS';
var SEND_UPDATE_GAS_PRICE_FAILURE = 'send/SEND_UPDATE_GAS_PRICE_FAILURE';
var SEND_TRANSACTION_REQUEST = 'send/SEND_TRANSACTION_REQUEST';
var SEND_TRANSACTION_SUCCESS = 'send/SEND_TRANSACTION_SUCCESS';
var SEND_TRANSACTION_FAILURE = 'send/SEND_TRANSACTION_FAILURE';
var SEND_TOGGLE_CONFIRMATION_VIEW = 'send/SEND_TOGGLE_CONFIRMATION_VIEW';
var SEND_UPDATE_NATIVE_AMOUNT = 'send/SEND_UPDATE_NATIVE_AMOUNT';
var SEND_UPDATE_RECIPIENT = 'send/SEND_UPDATE_RECIPIENT';
var SEND_UPDATE_ASSET_AMOUNT = 'send/SEND_UPDATE_ASSET_AMOUNT';
var SEND_UPDATE_SELECTED = 'send/SEND_UPDATE_SELECTED';
var SEND_UPDATE_HAS_PENDING_TRANSACTION = 'send/SEND_UPDATE_HAS_PENDING_TRANSACTION';
var SEND_CLEAR_FIELDS = 'send/SEND_CLEAR_FIELDS'; // -- Actions --------------------------------------------------------------- //

var sendModalInit = function sendModalInit() {
  return function (dispatch, getState) {
    var _getState$account = getState().account,
        accountAddress = _getState$account.accountAddress,
        accountInfo = _getState$account.accountInfo,
        prices = _getState$account.prices;
    var gasLimit = getState().send.gasLimit;
    var selected = accountInfo.assets.filter(function (asset) {
      return asset.symbol === 'ETH';
    })[0];
    var fallbackGasPrices = (0, _parsers.parseGasPrices)(null, prices, gasLimit);
    dispatch({
      type: SEND_GET_GAS_PRICES_REQUEST,
      payload: {
        address: accountAddress,
        selected: selected,
        gasPrices: fallbackGasPrices
      }
    });
    (0, _api.apiGetGasPrices)().then(function (_ref) {
      var data = _ref.data;
      var gasPrices = (0, _parsers.parseGasPrices)(data, prices, gasLimit);
      dispatch({
        type: SEND_GET_GAS_PRICES_SUCCESS,
        payload: gasPrices
      });
    }).catch(function (error) {
      console.error(error);
      dispatch({
        type: SEND_GET_GAS_PRICES_FAILURE,
        payload: fallbackGasPrices
      });
    });
  };
};

exports.sendModalInit = sendModalInit;

var sendUpdateGasPrice = function sendUpdateGasPrice(newGasPriceOption) {
  return function (dispatch, getState) {
    var _getState$send = getState().send,
        selected = _getState$send.selected,
        address = _getState$send.address,
        recipient = _getState$send.recipient,
        assetAmount = _getState$send.assetAmount,
        gasPrice = _getState$send.gasPrice,
        gasPriceOption = _getState$send.gasPriceOption,
        fetchingGasPrices = _getState$send.fetchingGasPrices;
    if (fetchingGasPrices) return;
    var gasPrices = getState().send.gasPrices;
    if (!Object.keys(gasPrices).length) return null;

    var _gasPriceOption = newGasPriceOption || gasPriceOption;

    var _gasPrice = gasPriceOption ? gasPrices[_gasPriceOption] : gasPrice;

    dispatch({
      type: SEND_UPDATE_GAS_PRICE_REQUEST
    });
    (0, _web.estimateGasLimit)({
      asset: selected,
      address: address,
      recipient: recipient,
      amount: assetAmount
    }).then(function (gasLimit) {
      var prices = getState().account.prices;
      gasPrices = (0, _parsers.parseGasPricesTxFee)(gasPrices, prices, gasLimit);
      dispatch({
        type: SEND_UPDATE_GAS_PRICE_SUCCESS,
        payload: {
          gasLimit: gasLimit,
          gasPrice: _gasPrice,
          gasPriceOption: _gasPriceOption,
          gasPrices: gasPrices
        }
      });
    }).catch(function (error) {
      var message = (0, _parsers.parseError)(error);

      if (assetAmount) {
        var requestedAmount = (0, _bignumber.convertAmountToBigNumber)("".concat(assetAmount));
        var availableBalance = selected.balance.amount;

        if ((0, _bignumber.greaterThan)(requestedAmount, availableBalance)) {
          dispatch((0, _notification.notificationShow)(_languages.default.t('notification.error.insufficient_balance'), true));
        }
      } else {
        dispatch((0, _notification.notificationShow)(message || _languages.default.t('notification.error.failed_get_tx_fee'), true));
      }

      dispatch({
        type: SEND_UPDATE_GAS_PRICE_FAILURE,
        payload: {
          gasPrice: _gasPrice,
          gasPriceOption: _gasPriceOption,
          gasPrices: gasPrices
        }
      });
    });
  };
};

exports.sendUpdateGasPrice = sendUpdateGasPrice;

var sendTransaction = function sendTransaction(transactionDetails, signAndSendTransactionCb) {
  return function (dispatch, getState) {
    dispatch({
      type: SEND_TRANSACTION_REQUEST
    });
    var address = transactionDetails.address,
        recipient = transactionDetails.recipient,
        amount = transactionDetails.amount,
        asset = transactionDetails.asset,
        gasPrice = transactionDetails.gasPrice,
        gasLimit = transactionDetails.gasLimit;
    var txDetails = {
      asset: asset,
      from: address,
      to: recipient,
      nonce: null,
      amount: amount,
      gasPrice: gasPrice.value.amount,
      gasLimit: gasLimit
    };
    (0, _web.createSignableTransaction)(txDetails).then(function (signableTransactionDetails) {
      signAndSendTransactionCb(signableTransactionDetails).then(function (txHash) {
        // has pending transactions set to true for redirect to Transactions route
        dispatch((0, _account.accountUpdateHasPendingTransaction)());
        txDetails.hash = txHash;
        dispatch((0, _account.accountUpdateTransactions)(txDetails));
        dispatch({
          type: SEND_TRANSACTION_SUCCESS,
          payload: txHash
        });
      }).catch(function (error) {
        var message = (0, _parsers.parseError)(error);
        dispatch((0, _notification.notificationShow)(message, true));
        dispatch({
          type: SEND_TRANSACTION_FAILURE
        });
      });
    }).catch(function (error) {
      var message = (0, _parsers.parseError)(error);
      dispatch((0, _notification.notificationShow)(message, true));
      dispatch({
        type: SEND_TRANSACTION_FAILURE
      });
    });
  };
};

exports.sendTransaction = sendTransaction;

var sendToggleConfirmationView = function sendToggleConfirmationView(boolean) {
  return function (dispatch, getState) {
    var confirm = boolean;

    if (!confirm) {
      confirm = !getState().send.confirm;
    }

    dispatch({
      type: SEND_TOGGLE_CONFIRMATION_VIEW,
      payload: confirm
    });
  };
};

exports.sendToggleConfirmationView = sendToggleConfirmationView;

var sendUpdateRecipient = function sendUpdateRecipient(recipient) {
  return function (dispatch) {
    var input = recipient.replace(/[^\w.]/g, '');

    if (input.length <= 42) {
      dispatch({
        type: SEND_UPDATE_RECIPIENT,
        payload: input
      });
    }
  };
};

exports.sendUpdateRecipient = sendUpdateRecipient;

var sendUpdateAssetAmount = function sendUpdateAssetAmount(assetAmount) {
  return function (dispatch, getState) {
    var _getState$account2 = getState().account,
        prices = _getState$account2.prices,
        nativeCurrency = _getState$account2.nativeCurrency;
    var selected = getState().send.selected;

    var _assetAmount = assetAmount.replace(/[^0-9.]/g, '');

    var _nativeAmount = '';

    if (_assetAmount.length && prices[nativeCurrency][selected.symbol]) {
      var nativeAmount = (0, _bignumber.convertAssetAmountToNativeValue)(_assetAmount, selected, prices);
      _nativeAmount = (0, _bignumber.formatInputDecimals)(nativeAmount, _assetAmount);
    }

    dispatch({
      type: SEND_UPDATE_ASSET_AMOUNT,
      payload: {
        assetAmount: _assetAmount,
        nativeAmount: _nativeAmount
      }
    });
  };
};

exports.sendUpdateAssetAmount = sendUpdateAssetAmount;

var sendUpdateNativeAmount = function sendUpdateNativeAmount(nativeAmount) {
  return function (dispatch, getState) {
    var _getState$account3 = getState().account,
        prices = _getState$account3.prices,
        nativeCurrency = _getState$account3.nativeCurrency;
    var selected = getState().send.selected;

    var _nativeAmount = nativeAmount.replace(/[^0-9.]/g, '');

    var _assetAmount = '';

    if (_nativeAmount.length && prices[nativeCurrency][selected.symbol]) {
      var assetAmount = (0, _bignumber.convertAssetAmountFromNativeValue)(_nativeAmount, selected, prices);
      _assetAmount = (0, _bignumber.formatInputDecimals)(assetAmount, _nativeAmount);
    }

    dispatch({
      type: SEND_UPDATE_ASSET_AMOUNT,
      payload: {
        assetAmount: _assetAmount,
        nativeAmount: _nativeAmount
      }
    });
  };
};

exports.sendUpdateNativeAmount = sendUpdateNativeAmount;

var sendUpdateSelected = function sendUpdateSelected(value) {
  return function (dispatch, getState) {
    var _getState$account4 = getState().account,
        prices = _getState$account4.prices,
        nativeCurrency = _getState$account4.nativeCurrency,
        accountInfo = _getState$account4.accountInfo;
    var assetAmount = getState().send.assetAmount;
    var selected = accountInfo.assets.filter(function (asset) {
      return asset.symbol === 'ETH';
    })[0];

    if (value !== 'ETH') {
      selected = accountInfo.assets.filter(function (asset) {
        return asset.symbol === value;
      })[0];
    }

    dispatch({
      type: SEND_UPDATE_SELECTED,
      payload: selected
    });
    dispatch(sendUpdateGasPrice());

    if (prices[nativeCurrency] && prices[nativeCurrency][selected.symbol]) {
      dispatch(sendUpdateAssetAmount(assetAmount));
    }
  };
};

exports.sendUpdateSelected = sendUpdateSelected;

var sendMaxBalance = function sendMaxBalance() {
  return function (dispatch, getState) {
    var _getState$send2 = getState().send,
        selected = _getState$send2.selected,
        gasPrice = _getState$send2.gasPrice;
    var accountInfo = getState().account.accountInfo;
    var amount = '';

    if (selected.symbol === 'ETH') {
      var ethereum = accountInfo.assets.filter(function (asset) {
        return asset.symbol === 'ETH';
      })[0];
      var balanceAmount = ethereum.balance.amount;
      var txFeeAmount = gasPrice.txFee.value.amount;
      var remaining = (0, _bignumber.convertStringToNumber)((0, _bignumber.subtract)(balanceAmount, txFeeAmount));
      amount = (0, _bignumber.convertAmountFromBigNumber)(remaining < 0 ? '0' : remaining);
    } else {
      amount = (0, _bignumber.convertAmountFromBigNumber)(selected.balance.amount);
    }

    dispatch(sendUpdateAssetAmount(amount));
  };
};

exports.sendMaxBalance = sendMaxBalance;

var sendClearFields = function sendClearFields() {
  return {
    type: SEND_CLEAR_FIELDS
  };
}; // -- Reducer --------------------------------------------------------------- //


exports.sendClearFields = sendClearFields;
var INITIAL_STATE = {
  fetchingGasPrices: false,
  gasPrice: {},
  gasPrices: {},
  gasLimit: _ethereumUnits.default.basic_tx,
  gasPriceOption: 'average',
  fetching: false,
  address: '',
  recipient: '',
  nativeAmount: '',
  assetAmount: '',
  txHash: '',
  confirm: false,
  selected: {
    symbol: 'ETH'
  }
};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case SEND_GET_GAS_PRICES_REQUEST:
      return _objectSpread({}, state, {
        fetchingGasPrices: true,
        address: action.payload.address,
        selected: action.payload.selected,
        gasPrice: action.payload.gasPrices.average,
        gasPrices: action.payload.gasPrices,
        gasPriceOption: action.payload.gasPrices.average.option
      });

    case SEND_GET_GAS_PRICES_SUCCESS:
      return _objectSpread({}, state, {
        fetchingGasPrices: false,
        gasPrice: action.payload.average,
        gasPrices: action.payload,
        gasPriceOption: action.payload.average.option
      });

    case SEND_GET_GAS_PRICES_FAILURE:
      return _objectSpread({}, state, {
        fetchingGasPrices: false,
        gasPrice: action.payload.average,
        gasPrices: action.payload,
        gasPriceOption: action.payload.average.option
      });

    case SEND_UPDATE_GAS_PRICE_REQUEST:
      return _objectSpread({}, state, {
        fetchingGasPrices: true
      });

    case SEND_UPDATE_GAS_PRICE_SUCCESS:
      return _objectSpread({}, state, {
        fetchingGasPrices: false,
        gasLimit: action.payload.gasLimit,
        gasPrice: action.payload.gasPrice,
        gasPrices: action.payload.gasPrices,
        gasPriceOption: action.payload.gasPriceOption
      });

    case SEND_UPDATE_GAS_PRICE_FAILURE:
      return _objectSpread({}, state, {
        fetchingGasPrices: false,
        gasPrice: action.payload.gasPrice,
        gasPrices: action.payload.gasPrices,
        gasPriceOption: action.payload.gasPriceOption
      });

    case SEND_TRANSACTION_REQUEST:
      return _objectSpread({}, state, {
        fetching: true
      });

    case SEND_TRANSACTION_SUCCESS:
      return _objectSpread({}, state, {
        fetching: false,
        gasPrices: {},
        txHash: action.payload
      });

    case SEND_TRANSACTION_FAILURE:
      return _objectSpread({}, state, {
        fetching: false,
        txHash: '',
        confirm: false
      });

    case SEND_UPDATE_HAS_PENDING_TRANSACTION:
      return _objectSpread({}, state, {
        hasPendingTransaction: action.payload
      });

    case SEND_TOGGLE_CONFIRMATION_VIEW:
      return _objectSpread({}, state, {
        confirm: action.payload
      });

    case SEND_UPDATE_RECIPIENT:
      return _objectSpread({}, state, {
        recipient: action.payload
      });

    case SEND_UPDATE_NATIVE_AMOUNT:
    case SEND_UPDATE_ASSET_AMOUNT:
      return _objectSpread({}, state, {
        assetAmount: action.payload.assetAmount,
        nativeAmount: action.payload.nativeAmount
      });

    case SEND_UPDATE_SELECTED:
      return _objectSpread({}, state, {
        selected: action.payload
      });

    case SEND_CLEAR_FIELDS:
      return _objectSpread({}, state, INITIAL_STATE);

    default:
      return state;
  }
};

exports.default = _default;