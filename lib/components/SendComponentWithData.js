"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withSendComponentWithData = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRedux = require("react-redux");

var _languages = _interopRequireDefault(require("../../languages"));

var _send = require("../../reducers/_send");

var _notification = require("../../reducers/_notification");

var _validators = require("../../helpers/validators");

var _bignumber = require("../../helpers/bignumber");

var _utilities = require("../../helpers/utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var reduxProps = function reduxProps(_ref) {
  var send = _ref.send,
      account = _ref.account;
  return {
    fetching: send.fetching,
    recipient: send.recipient,
    nativeAmount: send.nativeAmount,
    assetAmount: send.assetAmount,
    txHash: send.txHash,
    address: send.address,
    selected: send.selected,
    gasPrices: send.gasPrices,
    gasPrice: send.gasPrice,
    gasLimit: send.gasLimit,
    gasPriceOption: send.gasPriceOption,
    confirm: send.confirm,
    accountInfo: account.accountInfo,
    accountType: account.accountType,
    network: account.network,
    nativeCurrency: account.nativeCurrency,
    prices: account.prices
  };
};

var withSendComponentWithData = function withSendComponentWithData(SendComponent) {
  var SendComponentWithData =
  /*#__PURE__*/
  function (_Component) {
    _inherits(SendComponentWithData, _Component);

    function SendComponentWithData() {
      var _getPrototypeOf2;

      var _temp, _this;

      _classCallCheck(this, SendComponentWithData);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SendComponentWithData)).call.apply(_getPrototypeOf2, [this].concat(args))), _this.state = {
        isValidAddress: true,
        showQRCodeReader: false
      }, _this.onAddressInputFocus = function () {
        return _this.setState({
          isValidAddress: true
        });
      }, _this.onAddressInputBlur = function () {
        return _this.setState({
          isValidAddress: (0, _validators.isValidAddress)(_this.props.recipient)
        });
      }, _this.onGoBack = function () {
        return _this.props.sendToggleConfirmationView(false);
      }, _this.onSendMaxBalance = function () {
        return _this.props.sendMaxBalance();
      }, _this.onSendAnother = function () {
        _this.props.sendToggleConfirmationView(false);

        _this.props.sendClearFields();

        _this.props.sendModalInit();
      }, _this.onSubmit = function (e) {
        e.preventDefault();

        if (!_this.props.gasPrice.txFee) {
          _this.props.notificationShow(_languages.default.t('notification.error.generic_error'), true);

          return;
        }

        if (!_this.props.confirm) {
          if (!(0, _validators.isValidAddress)(_this.props.recipient)) {
            _this.props.notificationShow(_languages.default.t('notification.error.invalid_address'), true);

            return;
          } else if (_this.props.selected.symbol === 'ETH') {
            var _transactionData = (0, _utilities.transactionData)(_this.props.accountInfo, _this.props.assetAmount, _this.props.gasPrice),
                requestedAmount = _transactionData.requestedAmount,
                balance = _transactionData.balance,
                amountWithFees = _transactionData.amountWithFees;

            if ((0, _bignumber.greaterThan)(requestedAmount, balance)) {
              _this.props.notificationShow(_languages.default.t('notification.error.insufficient_balance'), true);

              return;
            } else if ((0, _bignumber.greaterThan)(amountWithFees, balance)) {
              _this.props.notificationShow(_languages.default.t('notification.error.insufficient_for_fees'), true);

              return;
            }
          } else {
            var _transactionData2 = (0, _utilities.transactionData)(_this.props.accountInfo, _this.props.assetAmount, _this.props.gasPrice),
                _requestedAmount = _transactionData2.requestedAmount,
                _balance = _transactionData2.balance,
                txFee = _transactionData2.txFee;

            var tokenBalanceAmount = _this.props.selected.balance.amount;
            var tokenBalance = (0, _bignumber.convertAmountFromBigNumber)(tokenBalanceAmount);

            if ((0, _bignumber.greaterThan)(_requestedAmount, tokenBalance)) {
              _this.props.notificationShow(_languages.default.t('notification.error.insufficient_balance'), true);

              return;
            } else if ((0, _bignumber.greaterThan)(txFee, _balance)) {
              _this.props.notificationShow(_languages.default.t('notification.error.insufficient_for_fees'), true);

              return;
            }
          }

          _this.props.sendTransaction({
            address: _this.props.accountInfo.address,
            recipient: _this.props.recipient,
            amount: _this.props.assetAmount,
            asset: _this.props.selected,
            gasPrice: _this.props.gasPrice,
            gasLimit: _this.props.gasLimit
          });
        }

        _this.props.sendToggleConfirmationView(true);
      }, _this.updateGasPrice = function (gasPrice) {
        _this.props.sendUpdateGasPrice(gasPrice);
      }, _this.onClose = function () {
        _this.props.sendClearFields(); // TODO: close function ?? (previously was to hit modal reducer)

      }, _this.updateGasPrice = function (gasPrice) {
        _this.props.sendUpdateGasPrice(gasPrice);
      }, _this.toggleQRCodeReader = function () {
        return _this.setState({
          showQRCodeReader: !_this.state.showQRCodeReader
        });
      }, _this.onQRCodeValidate = function (rawData) {
        var data = rawData.match(/0x\w{40}/g) ? rawData.match(/0x\w{40}/g)[0] : null;
        var result = data ? (0, _validators.isValidAddress)(data) : false;

        var onError = function onError() {
          return _this.props.notificationShow(_languages.default.t('notification.error.invalid_address_scanned'), true);
        };

        return {
          data: data,
          result: result,
          onError: onError
        };
      }, _this.onQRCodeScan = function (data) {
        _this.props.sendUpdateRecipient(data);

        _this.setState({
          showQRCodeReader: false
        });
      }, _this.onQRCodeError = function () {
        _this.props.notificationShow(_languages.default.t('notification.error.failed_scanning_qr_code'), true);
      }, _this.render = function () {
        return _react.default.createElement(SendComponent, _this.props);
      }, _temp));
    }

    _createClass(SendComponentWithData, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.props.sendModalInit();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (this.props.recipient.length >= 42) {
          if (this.props.selected.symbol !== prevProps.selected.symbol) {
            this.props.sendUpdateGasPrice();
          } else if (this.props.recipient !== prevProps.recipient) {
            this.props.sendUpdateGasPrice();
          } else if (this.props.assetAmount !== prevProps.assetAmount) {
            this.props.sendUpdateGasPrice();
          }
        }
      }
    }]);

    return SendComponentWithData;
  }(_react.Component);

  SendComponentWithData.propTypes = {
    sendModalInit: _propTypes.default.func.isRequired,
    sendUpdateGasPrice: _propTypes.default.func.isRequired,
    sendTransaction: _propTypes.default.func.isRequired,
    sendClearFields: _propTypes.default.func.isRequired,
    sendUpdateRecipient: _propTypes.default.func.isRequired,
    sendUpdateNativeAmount: _propTypes.default.func.isRequired,
    sendUpdateAssetAmount: _propTypes.default.func.isRequired,
    sendUpdateSelected: _propTypes.default.func.isRequired,
    sendMaxBalance: _propTypes.default.func.isRequired,
    sendToggleConfirmationView: _propTypes.default.func.isRequired,
    notificationShow: _propTypes.default.func.isRequired,
    fetching: _propTypes.default.bool.isRequired,
    recipient: _propTypes.default.string.isRequired,
    nativeAmount: _propTypes.default.string.isRequired,
    assetAmount: _propTypes.default.string.isRequired,
    txHash: _propTypes.default.string.isRequired,
    // address: PropTypes.string.isRequired,
    selected: _propTypes.default.object.isRequired,
    gasPrice: _propTypes.default.object.isRequired,
    gasPrices: _propTypes.default.object.isRequired,
    gasLimit: _propTypes.default.number.isRequired,
    gasPriceOption: _propTypes.default.string.isRequired,
    confirm: _propTypes.default.bool.isRequired,
    accountInfo: _propTypes.default.object.isRequired,
    accountType: _propTypes.default.string.isRequired,
    network: _propTypes.default.string.isRequired,
    nativeCurrency: _propTypes.default.string.isRequired,
    prices: _propTypes.default.object.isRequired
  };
  return (0, _reactRedux.connect)(reduxProps, {
    sendModalInit: _send.sendModalInit,
    sendUpdateGasPrice: _send.sendUpdateGasPrice,
    sendTransaction: _send.sendTransaction,
    sendClearFields: _send.sendClearFields,
    sendUpdateRecipient: _send.sendUpdateRecipient,
    sendUpdateNativeAmount: _send.sendUpdateNativeAmount,
    sendUpdateAssetAmount: _send.sendUpdateAssetAmount,
    sendUpdateSelected: _send.sendUpdateSelected,
    sendMaxBalance: _send.sendMaxBalance,
    sendToggleConfirmationView: _send.sendToggleConfirmationView,
    notificationShow: _notification.notificationShow
  })(SendComponentWithData);
};

exports.withSendComponentWithData = withSendComponentWithData;