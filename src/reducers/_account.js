import _ from 'lodash';
import { apiGetAccountBalances, apiGetPrices } from '../handlers/api';
import { apiGetAccountUniqueTokens } from '../handlers/opensea-api.js';
import {
  parseError,
  parseAccountBalancesPrices,
  parsePricesObject,
} from '../handlers/parsers';
import {
  getAccountLocal,
  getNativePrices,
  getNativeCurrency,
  saveNativePrices,
  updateLocalBalances,
} from '../handlers/commonStorage';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST =
  'account/ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST';

const ACCOUNT_GET_NATIVE_PRICES_REQUEST =
  'account/ACCOUNT_GET_NATIVE_PRICES_REQUEST';
const ACCOUNT_GET_NATIVE_PRICES_SUCCESS =
  'account/ACCOUNT_GET_NATIVE_PRICES_SUCCESS';
const ACCOUNT_GET_NATIVE_PRICES_FAILURE =
  'account/ACCOUNT_GET_NATIVE_PRICES_FAILURE';

const ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST =
  'account/ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST';
const ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS =
  'account/ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS';
const ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE =
  'account/ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE';

const ACCOUNT_UPDATE_BALANCES_REQUEST =
  'account/ACCOUNT_UPDATE_BALANCES_REQUEST';
const ACCOUNT_UPDATE_BALANCES_SUCCESS =
  'account/ACCOUNT_UPDATE_BALANCES_SUCCESS';
const ACCOUNT_UPDATE_BALANCES_FAILURE =
  'account/ACCOUNT_UPDATE_BALANCES_FAILURE';

const ACCOUNT_INITIALIZE_PRICES_REQUEST =
  'account/ACCOUNT_INITIALIZE_PRICES_REQUEST';
const ACCOUNT_INITIALIZE_PRICES_SUCCESS =
  'account/ACCOUNT_INITIALIZE_PRICES_SUCCESS';
const ACCOUNT_INITIALIZE_PRICES_FAILURE =
  'account/ACCOUNT_INITIALIZE_PRICES_FAILURE';

const ACCOUNT_CLEAR_STATE = 'account/ACCOUNT_CLEAR_STATE';
const ACCOUNT_UPDATE_ACCOUNT_ADDRESS = 'account/ACCOUNT_UPDATE_ACCOUNT_ADDRESS';

// -- Actions --------------------------------------------------------------- //
let getPricesInterval = null;
let getAccountBalancesInterval = null;

export const initializeAccountPrices = () => (dispatch, getState) => {
  dispatch({ type: ACCOUNT_INITIALIZE_PRICES_REQUEST });
  getNativeCurrency()
    .then(nativeCurrency => {
      getNativePrices()
        .then(nativePrices => {
          dispatch({
            type: ACCOUNT_INITIALIZE_PRICES_SUCCESS,
            payload: { nativeCurrency, nativePrices },
          });
        })
        .catch(error => {
          const message = parseError(error);
          dispatch(notificationShow(message, true));
          dispatch({ type: ACCOUNT_INITIALIZE_PRICES_FAILURE });
        });
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: ACCOUNT_INITIALIZE_PRICES_FAILURE });
    });
};

export const accountGetAccountBalances = () => (dispatch, getState) => {
  const {
    network,
    accountInfo,
    accountAddress,
    accountType,
  } = getState().account;
  let cachedAccount = { ...accountInfo };
  //let cachedTransactions = [];
  getAccountLocal(accountAddress)
    .then(accountLocal => {
      if (accountLocal && accountLocal[network]) {
        if (accountLocal[network].balances) {
          cachedAccount = {
            ...cachedAccount,
            assets: accountLocal[network].balances.assets,
            total: accountLocal[network].balances.total,
          };
        }
        if (accountLocal[network].type && !cachedAccount.type) {
          cachedAccount.type = accountLocal[network].type;
        }
        /*
      if (accountLocal[network].pending) {
        cachedTransactions = [...accountLocal[network].pending];
      }
      if (accountLocal[network].transactions) {
        cachedTransactions = _.unionBy(
          cachedTransactions,
          accountLocal[network].transactions,
          'hash',
        );
        updateLocalTransactions(accountAddress, cachedTransactions, network);
      }
      */
      }
      dispatch({
        type: ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST,
        payload: {
          accountType: cachedAccount.type || accountType,
          accountInfo: cachedAccount,
          //transactions: cachedTransactions,
          fetching: (accountLocal && !accountLocal[network]) || !accountLocal,
        },
      });
      dispatch(accountUpdateBalances());
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
    });
};

export const accountUpdateBalances = () => (dispatch, getState) => {
  const { network, accountAddress, accountType } = getState().account;
  const getAccountBalances = () => {
    dispatch({ type: ACCOUNT_UPDATE_BALANCES_REQUEST });
    apiGetAccountBalances(accountAddress, network)
      .then(({ data }) => {
        let accountInfo = { ...data, type: accountType };
        const prices = getState().account.prices;
        if (prices && prices.selected) {
          const parsedAccountInfo = parseAccountBalancesPrices(
            accountInfo,
            prices,
            network,
          );
          dispatch({
            type: ACCOUNT_UPDATE_BALANCES_SUCCESS,
            payload: parsedAccountInfo,
          });
        }
        dispatch(accountGetNativePrices(accountInfo));
      })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: ACCOUNT_UPDATE_BALANCES_FAILURE });
      });
  };
  getAccountBalances();
  clearInterval(getAccountBalancesInterval);
  getAccountBalancesInterval = setInterval(getAccountBalances, 15000); // 15secs
};

export const accountGetUniqueTokens = () => (dispatch, getState) => {
  const { accountAddress } = getState().account;
  dispatch({
    type: ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST,
  });
  apiGetAccountUniqueTokens(accountAddress)
    .then(data => {
      dispatch({
        type: ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS,
        payload: data,
      });
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE });
    });
};

export const accountUpdateAccountAddress = (accountAddress, accountType) => (
  dispatch,
  getState,
) => {
  if (!accountAddress || !accountType) return;
  const { network } = getState().account;
  if (getState().account.accountType !== accountType)
    dispatch(accountClearState());
  dispatch({
    type: ACCOUNT_UPDATE_ACCOUNT_ADDRESS,
    payload: { accountAddress, accountType },
  });
  dispatch(accountGetAccountBalances());
  dispatch(accountGetUniqueTokens());
};

export const accountGetNativePrices = accountInfo => (dispatch, getState) => {
  const assetSymbols = accountInfo.assets.map(asset => asset.symbol);
  const getPrices = () => {
    dispatch({
      type: ACCOUNT_GET_NATIVE_PRICES_REQUEST,
      payload: getState().account.nativeCurrency,
    });
    apiGetPrices(assetSymbols)
      .then(({ data }) => {
        const nativePriceRequest = getState().account.nativePriceRequest;
        const nativeCurrency = getState().account.nativeCurrency;
        const network = getState().account.network;
        if (nativeCurrency === nativePriceRequest) {
          const prices = parsePricesObject(data, assetSymbols, nativeCurrency);
          const parsedAccountInfo = parseAccountBalancesPrices(
            accountInfo,
            prices,
            network,
          );
          updateLocalBalances(
            parsedAccountInfo.address,
            parsedAccountInfo,
            network,
          );
          saveNativePrices(prices);
          dispatch({
            type: ACCOUNT_GET_NATIVE_PRICES_SUCCESS,
            payload: { accountInfo: parsedAccountInfo, prices },
          });
        }
      })
      .catch(error => {
        dispatch({ type: ACCOUNT_GET_NATIVE_PRICES_FAILURE });
        const message = parseError(error);
        dispatch(notificationShow(message, true));
      });
  };
  getPrices();
  clearInterval(getPricesInterval);
  getPricesInterval = setInterval(getPrices, 15000); // 15secs
};

export const accountClearState = () => dispatch => {
  clearInterval(getPricesInterval);
  clearInterval(getAccountBalancesInterval);
  dispatch({ type: ACCOUNT_CLEAR_STATE });
};

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  nativePriceRequest: 'USD',
  nativeCurrency: 'USD',
  prices: {},
  network: 'mainnet',
  accountType: '',
  accountAddress: '',
  accountInfo: {
    address: '',
    accountType: '',
    assets: [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        address: null,
        decimals: 18,
        balance: {
          amount: '',
          display: '0.00 ETH',
        },
        native: null,
      },
    ],
    total: '———',
  },
  uniqueTokens: [],
  fetchingUniqueTokens: false,
  fetching: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATE_ACCOUNT_ADDRESS:
      return {
        ...state,
        accountType: action.payload.accountType,
        accountAddress: action.payload.accountAddress,
        //transactions: [],
      };
    case ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_REQUEST:
      return {
        ...state,
        fetchingUniqueTokens: true,
      };
    case ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_SUCCESS:
      return {
        ...state,
        fetchingUniqueTokens: false,
        uniqueTokens: action.payload,
      };
    case ACCOUNT_GET_ACCOUNT_UNIQUE_TOKENS_FAILURE:
      return { ...state, fetchingUniqueTokens: false };
    case ACCOUNT_GET_ACCOUNT_BALANCES_REQUEST:
      return {
        ...state,
        fetching: action.payload.fetching,
        accountType: action.payload.accountType,
        accountInfo: action.payload.accountInfo,
        //transactions: action.payload.transactions,
      };
    case ACCOUNT_UPDATE_BALANCES_REQUEST:
      return {
        ...state,
        fetching: true,
      };
    case ACCOUNT_UPDATE_BALANCES_SUCCESS:
      return {
        ...state,
        accountInfo: action.payload,
        fetching: false,
      };
    case ACCOUNT_UPDATE_BALANCES_FAILURE:
      return { ...state, fetching: false };
    case ACCOUNT_GET_NATIVE_PRICES_REQUEST:
      return {
        ...state,
        fetchingNativePrices: true,
        nativePriceRequest: action.payload,
      };
    case ACCOUNT_GET_NATIVE_PRICES_SUCCESS:
      return {
        ...state,
        fetchingNativePrices: false,
        nativePriceRequest: '',
        prices: action.payload.prices,
        accountInfo: action.payload.accountInfo,
      };
    case ACCOUNT_GET_NATIVE_PRICES_FAILURE:
      return {
        ...state,
        fetchingNativePrices: false,
        nativePriceRequest: 'USD',
      };
    case ACCOUNT_INITIALIZE_PRICES_REQUEST:
      return {
        ...state,
        nativePriceRequest: 'USD',
        nativeCurrency: 'USD',
        prices: {},
      };
    case ACCOUNT_INITIALIZE_PRICES_SUCCESS:
      return {
        ...state,
        nativePriceRequest: action.payload.nativeCurrency,
        nativeCurrency: action.payload.nativeCurrency,
        prices: action.payload.prices,
      };
    case ACCOUNT_INITIALIZE_PRICES_FAILURE:
      return {
        ...state,
        nativePriceRequest: 'USD',
        nativeCurrency: 'USD',
        prices: {},
      };
    case ACCOUNT_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
