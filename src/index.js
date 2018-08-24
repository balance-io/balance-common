import "@babel/polyfill";
import lang, { resources } from './languages';

import {
  withSendComponentWithData
} from './components/SendComponentWithData';
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
import {
  isValidAddress,
  isValidEmail,
} from './helpers/validators';
import {
  calcTxFee,
  capitalize,
  ellipseText,
  getEth,
  getDataString,
  getDerivationPathComponents,
  removeHexPrefix,
  transactionData,
} from './helpers/utilities';
import {
  add,
  convertAmountFromBigNumber,
  convertAmountToBigNumber,
  convertAmountToDisplay,
  convertAmountToDisplaySpecific,
  convertAssetAmountFromBigNumber,
  convertAssetAmountToNativeValue,
  convertHexToString,
  convertNumberToString,
  convertStringToNumber,
  convertStringToHex,
  divide,
  formatInputDecimals,
  fromWei,
  greaterThan,
  greaterThanOrEqual,
  handleSignificantDecimals,
  hasHighMarketValue,
  hasLowMarketValue,
  multiply,
  smallerThan,
  subtract,
} from './helpers/bignumber';
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
export {
  add,
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
  calcTxFee,
  capitalize,
  commonStorage,
  convertAmountFromBigNumber,
  convertAmountToBigNumber,
  convertAmountToDisplay,
  convertAmountToDisplaySpecific,
  convertAssetAmountFromBigNumber,
  convertAssetAmountToNativeValue,
  convertHexToString,
  convertNumberToString,
  convertStringToNumber,
  convertStringToHex,
  divide,
  ellipseText,
  estimateGasLimit,
  formatInputDecimals,
  fromWei,
  getCountdown,
  getDataString,
  getDerivationPathComponents,
  getEth,
  getLocalTimeDate,
  greaterThan,
  greaterThanOrEqual,
  handleSignificantDecimals,
  hasHighMarketValue,
  hasLowMarketValue,
  isValidAddress,
  isValidEmail,
  lang,
  multiply,
  parseError,
  parseGasPrices,
  removeHexPrefix,
  resources,
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
  smallerThan,
  subtract,
  toChecksumAddress,
  transactionData,
  withSendComponentWithData,
};
