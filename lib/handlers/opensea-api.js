"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiGetAccountUniqueTokens = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _parsers = require("./parsers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var openseaApiKey = process.env.REACT_APP_OPENSEA_API_KEY || '';
/**
 * Configuration for opensea api
 * @type axios instance
 */

var api = _axios.default.create({
  baseURL: 'https://api.opensea.io/api/v1',
  timeout: 30000,
  // 30 secs
  headers: {
    Accept: 'application/json',
    'X-API-KEY': openseaApiKey
  }
});
/**
 * @desc get opensea unique tokens
 * @param  {String}   [address='']
 * @return {Promise}
 */


var apiGetAccountUniqueTokens =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var address,
        data,
        result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            address = _args.length > 0 && _args[0] !== undefined ? _args[0] : '';
            _context.next = 3;
            return api.get("/assets?owner=".concat(address));

          case 3:
            data = _context.sent;
            result = (0, _parsers.parseAccountUniqueTokens)(data);
            return _context.abrupt("return", result);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function apiGetAccountUniqueTokens() {
    return _ref.apply(this, arguments);
  };
}();

exports.apiGetAccountUniqueTokens = apiGetAccountUniqueTokens;