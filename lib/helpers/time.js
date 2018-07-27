"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeString = exports.getLocalTimeDate = void 0;

var _bignumber = require("./bignumber");

var _timeUnits = _interopRequireDefault(require("../references/time-units.json"));

var _languages = _interopRequireDefault(require("../languages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @desc get local time & date string
 * @param  {Number} [timestamp=null]
 * @return {String}
 */
var getLocalTimeDate = function getLocalTimeDate() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  timestamp = Number(timestamp) || Date.now();
  var date = new Date(timestamp);
  return "".concat(date.toLocaleDateString(), " ").concat(date.toLocaleTimeString());
};
/**
 * @desc get time string for minimal unit
 * @param {String} [value='']
 * @param {String} [unit='ms']
 * @param {Boolean} [short=false]
 * @return {String}
 */


exports.getLocalTimeDate = getLocalTimeDate;

var getTimeString = function getTimeString() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ms';
  var short = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (!value) return null;

  var _value = (0, _bignumber.convertStringToNumber)(value);

  var _unit = '';
  var _unitShort = '';

  if (_value) {
    if (unit === 'miliseconds' || unit === 'ms') {
      if (_value === 1) {
        _unit = _languages.default.t('time.milisecond');
        _unitShort = _languages.default.t('time.ms');
      } else if (_value >= _timeUnits.default.ms.second && _value < _timeUnits.default.ms.minute) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.ms.second), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.second');
          _unitShort = _languages.default.t('time.sec');
        } else {
          _unit = _languages.default.t('time.seconds');
          _unitShort = _languages.default.t('time.secs');
        }
      } else if (_value >= _timeUnits.default.ms.minute && _value < _timeUnits.default.ms.hour) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.ms.minute), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.minute');
          _unitShort = _languages.default.t('time.min');
        } else {
          _unit = _languages.default.t('time.minutes');
          _unitShort = _languages.default.t('time.mins');
        }
      } else if (_value >= _timeUnits.default.ms.hour && _value < _timeUnits.default.ms.day) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.ms.hour), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.hour');
          _unitShort = _languages.default.t('time.hr');
        } else {
          _unit = _languages.default.t('time.hours');
          _unitShort = _languages.default.t('time.hrs');
        }
      } else if (_value >= _timeUnits.default.ms.day) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.ms.day), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.day');
          _unitShort = _languages.default.t('time.day');
        } else {
          _unit = _languages.default.t('time.days');
          _unitShort = _languages.default.t('time.days');
        }
      } else {
        _unit = _languages.default.t('time.miliseconds');
        _unitShort = _languages.default.t('time.ms');
      }
    } else if (unit === 'seconds' || unit === 'secs') {
      if (_value === 1) {
        _unit = _languages.default.t('time.second');
        _unitShort = _languages.default.t('time.sec');
      } else if (_value < 1) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.multiply)(_value, _timeUnits.default.ms.second));

        if (_value === 1) {
          _unit = _languages.default.t('time.milisecond');
          _unitShort = _languages.default.t('time.ms');
        } else {
          _unit = _languages.default.t('time.miliseconds');
          _unitShort = _languages.default.t('time.ms');
        }
      } else if (_value >= _timeUnits.default.secs.minute && _value < _timeUnits.default.secs.hour) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.secs.minute), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.minute');
          _unitShort = _languages.default.t('time.min');
        } else {
          _unit = _languages.default.t('time.minutes');
          _unitShort = _languages.default.t('time.mins');
        }
      } else if (_value >= _timeUnits.default.secs.hour && _value < _timeUnits.default.secs.day) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.secs.hour), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.hour');
          _unitShort = _languages.default.t('time.hr');
        } else {
          _unit = _languages.default.t('time.hours');
          _unitShort = _languages.default.t('time.hrs');
        }
      } else if (_value >= _timeUnits.default.secs.day) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.secs.day), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.day');
          _unitShort = _languages.default.t('time.day');
        } else {
          _unit = _languages.default.t('time.days');
          _unitShort = _languages.default.t('time.days');
        }
      } else {
        _unit = _languages.default.t('time.seconds');
        _unitShort = _languages.default.t('time.secs');
      }
    } else if (unit === 'minutes' || unit === 'mins') {
      if (_value === 1) {
        _unit = _languages.default.t('time.minute');
        _unitShort = _languages.default.t('time.min');
      } else if (_value < 1) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.multiply)(_value, _timeUnits.default.secs.minute));

        if (_value === 1) {
          _unit = _languages.default.t('time.second');
          _unitShort = _languages.default.t('time.sec');
        } else {
          _unit = _languages.default.t('time.seconds');
          _unitShort = _languages.default.t('time.secs');
        }
      } else if (_value > _timeUnits.default.mins.hour && _value < _timeUnits.default.mins.day) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.mins.hour), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.hour');
          _unitShort = _languages.default.t('time.hr');
        } else {
          _unit = _languages.default.t('time.hours');
          _unitShort = _languages.default.t('time.hrs');
        }
      } else if (_value >= _timeUnits.default.mins.day) {
        _value = (0, _bignumber.formatFixedDecimals)((0, _bignumber.divide)(_value, _timeUnits.default.mins.day), 2);

        if (_value === 1) {
          _unit = _languages.default.t('time.day');
          _unitShort = _languages.default.t('time.day');
        } else {
          _unit = _languages.default.t('time.days');
          _unitShort = _languages.default.t('time.days');
        }
      } else {
        _unit = _languages.default.t('time.minutes');
        _unitShort = _languages.default.t('time.mins');
      }
    }
  }

  if (short) {
    return "".concat(_value, " ").concat(_unitShort);
  } else {
    return "".concat(_value, " ").concat(_unit);
  }
};

exports.getTimeString = getTimeString;