"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.notificationShow = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// -- Constants ------------------------------------------------------------- //
var NOTIFICATION_SHOW = 'notification/NOTIFICATION_SHOW';
var NOTIFICATION_HIDE = 'notification/NOTIFICATION_HIDE'; // -- Actions --------------------------------------------------------------- //

var timeoutHide;

var notificationShow = function notificationShow(message) {
  var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (dispatch) {
    clearTimeout(timeoutHide);
    dispatch({
      type: NOTIFICATION_SHOW,
      payload: {
        message: message,
        error: error
      }
    });
    timeoutHide = setTimeout(function () {
      return dispatch({
        type: NOTIFICATION_HIDE
      });
    }, 15000);
  };
}; // -- Reducer --------------------------------------------------------------- //


exports.notificationShow = notificationShow;
var INITIAL_STATE = {
  show: false,
  error: false,
  message: ''
};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case NOTIFICATION_SHOW:
      return _objectSpread({}, state, {
        show: true,
        message: action.payload.message,
        error: action.payload.error
      });

    case NOTIFICATION_HIDE:
      return _objectSpread({}, state, {
        show: false,
        message: '',
        error: false
      });

    default:
      return state;
  }
};

exports.default = _default;