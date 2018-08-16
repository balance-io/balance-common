import "@babel/polyfill";
import lang, { resources } from './languages';
import { getLanguage } from './handlers/commonStorage';

// Languages (i18n)
lang.init({
  lng: getLanguage() || 'en',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  resources,
});

import {
  account,
  accountChangeLanguage,
  accountChangeNativeCurrency,
  accountUpdateNetwork,
  accountClearState,
  accountUpdateAccountAddress,
  accountUpdateExchange,
  accountUpdateHasPendingTransaction,
  accountUpdateTransactions,
  send,
  sendClearFields,
  sendMaxBalance,
  sendModalInit,
  sendToggleConfirmationView,
  sendTransaction,
  sendUpdateAssetAmount,
  sendUpdateGasPrice,
  sendUpdateNativeAmount,
  sendUpdateRecipient,
  sendUpdateSelected,
} from './reducers';
import { getCountdown, getLocalTimeDate } from './helpers';
import {
  apiGetGasPrices,
  apiGetSinglePrice,
  apiShapeshiftGetMarketInfo,
  apiShapeshiftGetCurrencies,
  apiShapeshiftSendAmount,
  apiShapeshiftGetExchangeDetails,
  estimateGasLimit,
  parseError,
  parseGasPrices,
  toChecksumAddress,
} from './handlers';
import * as commonStorage from './handlers/commonStorage';
import * as bignumber from './helpers/bignumber';
export {
  account,
  accountChangeLanguage,
  accountChangeNativeCurrency,
  accountUpdateNetwork,
  accountClearState,
  accountUpdateAccountAddress,
  accountUpdateExchange,
  accountUpdateHasPendingTransaction,
  accountUpdateTransactions,
  apiGetGasPrices,
  apiGetSinglePrice,
  apiShapeshiftGetMarketInfo,
  apiShapeshiftGetCurrencies,
  apiShapeshiftSendAmount,
  apiShapeshiftGetExchangeDetails,
  bignumber,
  commonStorage,
  estimateGasLimit,
  getCountdown,
  getLocalTimeDate,
  lang,
  parseError,
  parseGasPrices,
  send,
  sendClearFields,
  sendMaxBalance,
  sendModalInit,
  sendToggleConfirmationView,
  sendTransaction,
  sendUpdateAssetAmount,
  sendUpdateGasPrice,
  sendUpdateNativeAmount,
  sendUpdateRecipient,
  sendUpdateSelected,
  toChecksumAddress,
};
