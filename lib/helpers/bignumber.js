"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasLowMarketValue = exports.hasHighMarketValue = exports.formatInputDecimals = exports.formatFixedDecimals = exports.convertAmountToAssetAmount = exports.convertAssetAmountFromNativeAmount = exports.convertAssetAmountToNativeAmount = exports.convertAssetAmountFromNativeValue = exports.convertAssetAmountToNativeValue = exports.convertAssetAmountFromBigNumber = exports.convertAssetAmountToBigNumber = exports.convertAssetAmountToDisplaySpecific = exports.convertAmountToDisplaySpecific = exports.convertAmountToDisplay = exports.handleSignificantDecimals = exports.convertAmountFromBigNumber = exports.convertAmountToBigNumber = exports.subtract = exports.add = exports.mod = exports.floorDivide = exports.divide = exports.multiply = exports.smallerThanOrEqual = exports.smallerThan = exports.greaterThanOrEqual = exports.greaterThan = exports.convertStringToHex = exports.convertHexToString = exports.convertStringToNumber = exports.convertNumberToString = exports.countDecimalPlaces = exports.fromWei = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _ethereumUnits = _interopRequireDefault(require("../references/ethereum-units.json"));

var _nativeCurrencies = _interopRequireDefault(require("../references/native-currencies.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fromWei = function fromWei(number) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 18;
  return new _bignumber.default(number.toString(10), 10).dividedBy((0, _bignumber.default)(10).pow(decimals)).toString(10);
};
/**
 * @desc count value's number of decimals places
 * @param  {String}   value
 * @return {String}
 */


exports.fromWei = fromWei;

var countDecimalPlaces = function countDecimalPlaces(value) {
  return (0, _bignumber.default)("".concat(value)).dp();
};
/**
 * @desc convert from number to string
 * @param  {Number}  value
 * @return {String}
 */


exports.countDecimalPlaces = countDecimalPlaces;

var convertNumberToString = function convertNumberToString(value) {
  return (0, _bignumber.default)("".concat(value)).toString();
};
/**
 * @desc convert from string to number
 * @param  {String}  value
 * @return {Number}
 */


exports.convertNumberToString = convertNumberToString;

var convertStringToNumber = function convertStringToNumber(value) {
  return (0, _bignumber.default)("".concat(value)).toNumber();
};
/**
 * @desc convert hex to number string
 * @param  {String} hex
 * @return {String}
 */


exports.convertStringToNumber = convertStringToNumber;

var convertHexToString = function convertHexToString(hex) {
  return (0, _bignumber.default)("".concat(hex)).toString();
};
/**
 * @desc convert number to string to hex
 * @param  {String} string
 * @return {String}
 */


exports.convertHexToString = convertHexToString;

var convertStringToHex = function convertStringToHex(string) {
  return (0, _bignumber.default)("".concat(string)).toString(16);
};
/**
 * @desc compares if numberOne is greater than numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.convertStringToHex = convertStringToHex;

var greaterThan = function greaterThan(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).comparedTo((0, _bignumber.default)("".concat(numberTwo))) === 1;
};
/**
 * @desc compares if numberOne is greater than or equal to numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.greaterThan = greaterThan;

var greaterThanOrEqual = function greaterThanOrEqual(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).comparedTo((0, _bignumber.default)("".concat(numberTwo))) >= 0;
};
/**
 * @desc compares if numberOne is smaller than numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.greaterThanOrEqual = greaterThanOrEqual;

var smallerThan = function smallerThan(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).comparedTo((0, _bignumber.default)("".concat(numberTwo))) === -1;
};
/**
 * @desc compares if numberOne is smaller than or equal to numberTwo
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.smallerThan = smallerThan;

var smallerThanOrEqual = function smallerThanOrEqual(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).comparedTo((0, _bignumber.default)("".concat(numberTwo))) <= 0;
};
/**
 * @desc multiplies two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.smallerThanOrEqual = smallerThanOrEqual;

var multiply = function multiply(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).times((0, _bignumber.default)("".concat(numberTwo))).toString();
};
/**
 * @desc divides two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.multiply = multiply;

var divide = function divide(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).dividedBy((0, _bignumber.default)("".concat(numberTwo))).toString();
};
/**
 * @desc real floor divides two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.divide = divide;

var floorDivide = function floorDivide(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).dividedToIntegerBy((0, _bignumber.default)("".concat(numberTwo))).toString();
};
/**
 * @desc modulos of two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.floorDivide = floorDivide;

var mod = function mod(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).mod((0, _bignumber.default)("".concat(numberTwo))).toString();
};
/**
 * @desc adds two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.mod = mod;

var add = function add(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).plus((0, _bignumber.default)("".concat(numberTwo))).toString();
};
/**
 * @desc subtracts two numbers
 * @param  {Number}   numberOne
 * @param  {Number}   numberTwo
 * @return {String}
 */


exports.add = add;

var subtract = function subtract(numberOne, numberTwo) {
  return (0, _bignumber.default)("".concat(numberOne)).minus((0, _bignumber.default)("".concat(numberTwo))).toString();
};
/**
 * @desc convert from amount value to BigNumber format
 * @param  {String|Number}  value
 * @return {BigNumber}
 */


exports.subtract = subtract;

var convertAmountToBigNumber = function convertAmountToBigNumber(value) {
  return (0, _bignumber.default)("".concat(value)).times(_ethereumUnits.default.ether).toString();
};
/**
 * @desc convert to amount value from BigNumber format
 * @param  {BigNumber}  value
 * @return {String}
 */


exports.convertAmountToBigNumber = convertAmountToBigNumber;

var convertAmountFromBigNumber = function convertAmountFromBigNumber(value) {
  return (0, _bignumber.default)("".concat(value)).dividedBy(_ethereumUnits.default.ether).toString();
};
/**
 * @desc handle signficant decimals in display format
 * @param  {String}   value
 * @param  {Number}   decimals
 * @param  {Number}   buffer
 * @return {String}
 */


exports.convertAmountFromBigNumber = convertAmountFromBigNumber;

var handleSignificantDecimals = function handleSignificantDecimals(value, decimals, buffer) {
  if (!(0, _bignumber.default)("".concat(decimals)).isInteger() || buffer && !(0, _bignumber.default)("".concat(buffer)).isInteger()) return null;
  buffer = buffer ? convertStringToNumber(buffer) : 3;
  decimals = convertStringToNumber(decimals);

  if (smallerThan((0, _bignumber.default)("".concat(value)).abs(), 1)) {
    decimals = value.slice(2).slice('').search(/[^0]/g) + buffer;
    decimals = decimals < 8 ? decimals : 8;
  } else {
    decimals = decimals < buffer ? decimals : buffer;
  }

  var result = (0, _bignumber.default)("".concat(value)).toFixed(decimals);
  result = (0, _bignumber.default)("".concat(result)).toString();
  return (0, _bignumber.default)("".concat(result)).dp() <= 2 ? (0, _bignumber.default)("".concat(result)).toFormat(2) : (0, _bignumber.default)("".concat(result)).toFormat();
};
/**
 * @desc convert from amount value to display formatted string
 * @param  {BigNumber}  value
 * @param  {Object}     nativePrices
 * @param  {Object}     asset
 * @param  {Number}     buffer
 * @return {String}
 */


exports.handleSignificantDecimals = handleSignificantDecimals;

var convertAmountToDisplay = function convertAmountToDisplay(value, nativePrices, asset, buffer) {
  value = convertAmountFromBigNumber(value);

  if (!nativePrices && !asset) {
    var decimals = 2;
    var display = handleSignificantDecimals(value, decimals, buffer);
    return "".concat(display, "%");
  } else if (!nativePrices && asset) {
    var _decimals2 = asset.decimals || 18;

    var _display = handleSignificantDecimals(value, _decimals2, buffer);

    return "".concat(_display, " ").concat(asset.symbol);
  } else if (nativePrices) {
    var _decimals3 = nativePrices.selected.decimals;

    var _display2 = handleSignificantDecimals(value, _decimals3, buffer);

    if (nativePrices.selected.alignment === 'left') {
      return "".concat(nativePrices.selected.symbol).concat(_display2);
    }

    return "".concat(_display2, " ").concat(nativePrices.selected.currency);
  }

  return value;
};
/**
 * @desc convert from amount value to display formatted string for specific currency
 * @param  {BigNumber}  value
 * @param  {Object}     nativePrices
 * @param  {Object}     asset
 * @return {String}
 */


exports.convertAmountToDisplay = convertAmountToDisplay;

var convertAmountToDisplaySpecific = function convertAmountToDisplaySpecific(value, nativePrices, selected, buffer) {
  if (!nativePrices) return null;
  value = convertAmountFromBigNumber(value);
  var nativeSelected = _nativeCurrencies.default[selected];
  var decimals = nativeSelected.decimals;
  var display = handleSignificantDecimals(value, decimals, buffer);

  if (nativeSelected.alignment === 'left') {
    return "".concat(nativeSelected.symbol).concat(display);
  }

  return "".concat(display, " ").concat(nativeSelected.currency);
};
/**
 * @desc convert from asset amount value to display formatted string for specific currency
 * @param  {BigNumber}  value
 * @param  {Object}     nativePrices
 * @param  {Object}     asset
 * @return {String}
 */


exports.convertAmountToDisplaySpecific = convertAmountToDisplaySpecific;

var convertAssetAmountToDisplaySpecific = function convertAssetAmountToDisplaySpecific(value, nativePrices, selected, buffer) {
  if (!nativePrices) return null;
  var nativeSelected = _nativeCurrencies.default[selected];
  var decimals = nativeSelected.decimals;
  var display = handleSignificantDecimals(value, decimals, buffer);

  if (nativeSelected.alignment === 'left') {
    return "".concat(nativeSelected.symbol).concat(display);
  }

  return "".concat(display, " ").concat(nativeSelected.currency);
};
/**
 * @desc convert from asset amount value to BigNumber format
 * @param  {String|Number}  value
 * @param  {Number}     decimals
 * @return {BigNumber}
 */


exports.convertAssetAmountToDisplaySpecific = convertAssetAmountToDisplaySpecific;

var convertAssetAmountToBigNumber = function convertAssetAmountToBigNumber(value, decimals) {
  if (!(0, _bignumber.default)("".concat(decimals)).isInteger()) return null;
  decimals = convertStringToNumber(decimals);
  value = (0, _bignumber.default)("".concat(value)).dividedBy((0, _bignumber.default)(10).pow(decimals)).toString();
  value = convertAmountToBigNumber(value);
  return value;
};
/**
 * @desc convert to asset amount value from BigNumber format
 * @param  {BigNumber}  value
 * @param  {Number}     decimals
 * @return {String}
 */


exports.convertAssetAmountToBigNumber = convertAssetAmountToBigNumber;

var convertAssetAmountFromBigNumber = function convertAssetAmountFromBigNumber(value, decimals) {
  if (!(0, _bignumber.default)("".concat(decimals)).isInteger()) return null;
  decimals = convertStringToNumber(decimals);
  value = convertAmountFromBigNumber(value);
  value = (0, _bignumber.default)("".concat(value)).times((0, _bignumber.default)(10).pow(decimals)).toString();
  return value;
};
/**
 * @desc convert from asset amount units to native price value units
 * @param  {String}   value
 * @param  {Object}   asset
 * @param  {Object}   nativePrices
 * @return {String}
 */


exports.convertAssetAmountFromBigNumber = convertAssetAmountFromBigNumber;

var convertAssetAmountToNativeValue = function convertAssetAmountToNativeValue(value, asset, nativePrices) {
  var nativeSelected = nativePrices.selected.currency;
  var assetPriceUnit = convertAmountFromBigNumber(nativePrices[nativeSelected][asset.symbol].price.amount);
  var assetNativePrice = (0, _bignumber.default)(value).times((0, _bignumber.default)(assetPriceUnit)).toString();
  return assetNativePrice;
};
/**
 * @desc convert to asset amount units from native price value units
 * @param  {String}   value
 * @param  {Object}   asset
 * @param  {Object}   nativePrices
 * @return {String}
 */


exports.convertAssetAmountToNativeValue = convertAssetAmountToNativeValue;

var convertAssetAmountFromNativeValue = function convertAssetAmountFromNativeValue(value, asset, nativePrices) {
  var nativeSelected = nativePrices.selected.currency;
  var assetPriceUnit = convertAmountFromBigNumber(nativePrices[nativeSelected][asset.symbol].price.amount);
  var assetAmountUnit = (0, _bignumber.default)(value).dividedBy((0, _bignumber.default)(assetPriceUnit)).toString();
  return assetAmountUnit;
};
/**
 * @desc convert from asset BigNumber amount to native price BigNumber amount
 * @param  {BigNumber}   value
 * @param  {Object}   asset
 * @param  {Object}   nativePrices
 * @return {BigNumber}
 */


exports.convertAssetAmountFromNativeValue = convertAssetAmountFromNativeValue;

var convertAssetAmountToNativeAmount = function convertAssetAmountToNativeAmount(value, asset, nativePrices) {
  var nativeSelected = nativePrices.selected.currency;

  var _value = convertAmountFromBigNumber("".concat(value));

  var assetPriceUnit = convertAmountFromBigNumber(nativePrices[nativeSelected][asset.symbol].price.amount);
  var assetNativePrice = (0, _bignumber.default)(_value).times((0, _bignumber.default)(assetPriceUnit)).toString();
  return convertAmountToBigNumber(assetNativePrice);
};
/**
 * @desc convert to asset BigNumber amount from native price BigNumber amount
 * @param  {BigNumber}   value
 * @param  {Object}   asset
 * @param  {Object}   nativePrices
 * @return {BigNumber}
 */


exports.convertAssetAmountToNativeAmount = convertAssetAmountToNativeAmount;

var convertAssetAmountFromNativeAmount = function convertAssetAmountFromNativeAmount(value, asset, nativePrices) {
  var nativeSelected = nativePrices.selected.currency;

  var _value = convertAmountFromBigNumber("".concat(value));

  var assetPriceUnit = convertAmountFromBigNumber(nativePrices[nativeSelected][asset.symbol].price.amount);
  var assetAmountUnit = (0, _bignumber.default)(_value).dividedBy((0, _bignumber.default)(assetPriceUnit)).toString();
  return convertAmountToBigNumber(assetAmountUnit);
};
/**
 * @desc convert amount to asset amount
 * @param  {String}   value
 * @param  {Number}   decimals
 * @return {String}
 */


exports.convertAssetAmountFromNativeAmount = convertAssetAmountFromNativeAmount;

var convertAmountToAssetAmount = function convertAmountToAssetAmount(value, decimals) {
  return (0, _bignumber.default)(value).times((0, _bignumber.default)(10).pow(decimals));
};
/**
 * @desc format fixed number of decimals
 * @param  {String}   value
 * @param  {Number}   decimals
 * @return {String}
 */


exports.convertAmountToAssetAmount = convertAmountToAssetAmount;

var formatFixedDecimals = function formatFixedDecimals(value, decimals) {
  var _value = convertNumberToString(value);

  var _decimals = convertStringToNumber(decimals);

  var result = (0, _bignumber.default)((0, _bignumber.default)(_value).toFixed(_decimals)).toString();
  return result;
};
/**
 * @desc format inputOne value to signficant decimals given inputTwo
 * @param  {String}   inputOne
 * @param  {String}   inputTwo
 * @return {String}
 */


exports.formatFixedDecimals = formatFixedDecimals;

var formatInputDecimals = function formatInputDecimals(inputOne, inputTwo) {
  var _nativeAmountDecimalPlaces = countDecimalPlaces(inputTwo);

  var decimals = _nativeAmountDecimalPlaces > 8 ? _nativeAmountDecimalPlaces : 8;
  var result = (0, _bignumber.default)(formatFixedDecimals(inputOne, decimals)).toFormat().replace(/,/g, '');
  return result;
};
/**
 * @desc checks if asset has a high market value
 * @param  {Object}   asset
 * @return {Boolean}
 */


exports.formatInputDecimals = formatInputDecimals;

var hasHighMarketValue = function hasHighMarketValue(asset) {
  return asset.native && greaterThan(convertAmountFromBigNumber(asset.native.balance.amount), asset.native.selected.assetLimit);
};
/**
 * @desc checks if asset has a low market value
 * @param  {Object}   asset
 * @return {Boolean}
 */


exports.hasHighMarketValue = hasHighMarketValue;

var hasLowMarketValue = function hasLowMarketValue(asset) {
  return asset.native && smallerThan(convertAmountFromBigNumber(asset.native.balance.amount), asset.native.selected.assetLimit);
};

exports.hasLowMarketValue = hasLowMarketValue;