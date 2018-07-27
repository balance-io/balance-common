"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.updateLanguage = exports.resources = void 0;

var _i18next = _interopRequireDefault(require("i18next"));

var _brazilian = _interopRequireDefault(require("./_brazilian.json"));

var _english = _interopRequireDefault(require("./_english.json"));

var _french = _interopRequireDefault(require("./_french.json"));

var _german = _interopRequireDefault(require("./_german.json"));

var _czech = _interopRequireDefault(require("./_czech.json"));

var _italian = _interopRequireDefault(require("./_italian.json"));

var _portuguese = _interopRequireDefault(require("./_portuguese.json"));

var _russian = _interopRequireDefault(require("./_russian.json"));

var _spanish = _interopRequireDefault(require("./_spanish.json"));

var _polish = _interopRequireDefault(require("./_polish.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resources = {
  en: _english.default,
  br: _brazilian.default,
  de: _german.default,
  es: _spanish.default,
  fr: _french.default,
  it: _italian.default,
  cz: _czech.default,
  pt: _portuguese.default,
  ru: _russian.default,
  pl: _polish.default
};
exports.resources = resources;

var updateLanguage = function updateLanguage(code) {
  return _i18next.default.changeLanguage(code);
};

exports.updateLanguage = updateLanguage;

_i18next.default.on('languageChanged', function () {});

var _default = _i18next.default;
exports.default = _default;