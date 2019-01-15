import { apiGetAccountBalances } from '../handlers/api';
import { apiGetAccountUniqueTokens } from '../handlers/opensea-api.js';
import { parseError } from '../handlers/parsers';
import {
  getAssets,
  saveAssets,
  removeAssets,
  getUniqueTokens,
  saveUniqueTokens,
  removeUniqueTokens,
  removeWalletConnect,
} from '../handlers/commonStorage';
import { transactionsClearState } from './_transactions';
import { getNativePrices, pricesClearState } from './_prices';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const ASSETS_GET_BALANCES_REQUEST =
  'assets/ASSETS_GET_BALANCES_REQUEST';
const ASSETS_GET_BALANCES_SUCCESS =
  'assets/ASSETS_GET_BALANCES_SUCCESS';

const ASSETS_UPDATE_BALANCES_REQUEST =
  'assets/ASSETS_UPDATE_BALANCES_REQUEST';
const ASSETS_UPDATE_BALANCES_SUCCESS =
  'assets/ASSETS_UPDATE_BALANCES_SUCCESS';
const ASSETS_UPDATE_BALANCES_FAILURE =
  'assets/ASSETS_UPDATE_BALANCES_FAILURE';

const ASSETS_GET_UNIQUE_TOKENS_REQUEST =
  'assets/ASSETS_GET_UNIQUE_TOKENS_REQUEST';
const ASSETS_GET_UNIQUE_TOKENS_SUCCESS =
  'assets/ASSETS_GET_UNIQUE_TOKENS_SUCCESS';
const ASSETS_GET_UNIQUE_TOKENS_FAILURE =
  'assets/ASSETS_GET_UNIQUE_TOKENS_FAILURE';

const ASSETS_CLEAR_STATE = 'assets/ASSETS_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //
let getBalancesInterval = null;

export const accountClearState = () => dispatch => {
  dispatch(pricesClearState());
  dispatch(assetsClearState());
  dispatch(transactionsClearState());
  removeWalletConnect();
};

const assetsClearState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  removeAssets(accountAddress, network);
  removeUniqueTokens(accountAddress, network);
  clearInterval(getBalancesInterval);
  dispatch({ type: ASSETS_CLEAR_STATE });
};

export const assetsRefreshState = () => dispatch => new Promise((resolve, reject) => {
  dispatch(assetsGetBalances()).then(() => {
    dispatch(assetsGetUniqueTokens()).then(() => {
      resolve(true);
    }).catch(error => {
      reject(false);
    });
  }).catch(error => {
    reject(false);
  });
  //return Promise.all(dispatch(assetsGetBalances()), dispatch(assetsGetUniqueTokens()));
});

const assetsGetBalances = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { accountAddress, accountType, network } = getState().settings;
  if (accountAddress && accountType) {
    dispatch(assetsUpdateBalances()).then(() => {
      resolve(true);
    }).catch(error => {
      reject(false);
    });
  } else {
    dispatch({ type: ASSETS_GET_BALANCES_REQUEST });
    getAssets(accountAddress, network)
      .then(assets => {
        dispatch({
          type: ASSETS_GET_BALANCES_SUCCESS,
          payload: assets,
        });
        dispatch(assetsUpdateBalances()).then(() => {
          resolve(true);
        }).catch(error => {
          reject(false);
        });
      }).catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        reject(false);
      });
  }
});

const assetsUpdateBalances = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { accountAddress, accountType, network } = getState().settings;
  dispatch({ type: ASSETS_UPDATE_BALANCES_REQUEST });
  const getBalances = () => new Promise((resolve, reject) => {
    apiGetAccountBalances(accountAddress, network)
      .then(assets => {
        saveAssets(accountAddress, assets, network);
        dispatch({
          type: ASSETS_UPDATE_BALANCES_SUCCESS,
          payload: assets,
        });
        dispatch(getNativePrices()).then(() => {
          resolve(true);
        }).catch(error => {
          reject(false);
        });
      })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: ASSETS_UPDATE_BALANCES_FAILURE });
        reject(false);
      });
  });
  getBalances().then(() => {
    console.log('RESET BALANCES INTERVAL');
    clearInterval(getBalancesInterval);
    getBalancesInterval = setInterval(getBalances, 15000); // 15 secs
    resolve(true);
  }).catch(error => {
    clearInterval(getBalancesInterval);
    getBalancesInterval = setInterval(getBalances, 15000); // 15 secs
    reject(false);
  });
});

const assetsGetUniqueTokens = () => (dispatch, getState) => new Promise((resolve, reject) => {
  dispatch({ type: ASSETS_GET_UNIQUE_TOKENS_REQUEST });
  const { accountAddress, network } = getState().settings;
  getUniqueTokens(accountAddress, network).then(cachedUniqueTokens => {
    if (cachedUniqueTokens) {
      dispatch({
        type: ASSETS_GET_UNIQUE_TOKENS_SUCCESS,
        payload: cachedUniqueTokens,
      });
    }
    apiGetAccountUniqueTokens(accountAddress)
      .then(uniqueTokens => {
        saveUniqueTokens(accountAddress, uniqueTokens, network);
        dispatch({
          type: ASSETS_GET_UNIQUE_TOKENS_SUCCESS,
          payload: uniqueTokens,
        });
        resolve(true);
      })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: ASSETS_GET_UNIQUE_TOKENS_FAILURE });
        reject(false);
    });
  })
  .catch(error => {
    dispatch({ type: ASSETS_GET_UNIQUE_TOKENS_FAILURE });
    reject(false);
  });
});


// -- Reducer --------------------------------------------------------------- //
export const INITIAL_ASSETS_STATE = {
  assets: [],
  fetchingAssets: false,
  fetchingUniqueTokens: false,
  uniqueTokens: [],
};

export default (state = INITIAL_ASSETS_STATE, action) => {
  switch (action.type) {
    case ASSETS_GET_UNIQUE_TOKENS_REQUEST:
      return {
        ...state,
        fetchingUniqueTokens: true,
      };
    case ASSETS_GET_UNIQUE_TOKENS_SUCCESS:
      return {
        ...state,
        fetchingUniqueTokens: false,
        uniqueTokens: action.payload,
      };
    case ASSETS_GET_UNIQUE_TOKENS_FAILURE:
      return { ...state, fetchingUniqueTokens: false };
    case ASSETS_GET_BALANCES_REQUEST:
      return {
        ...state,
        fetchingAssets: true,
      };
    case ASSETS_GET_BALANCES_SUCCESS:
      return {
        ...state,
        assets: action.payload,
        fetchingAssets: false,
      };
    case ASSETS_UPDATE_BALANCES_REQUEST:
      return {
        ...state,
        fetchingAssets: true,
      };
    case ASSETS_UPDATE_BALANCES_SUCCESS:
      return {
        ...state,
        assets: action.payload,
        fetchingAssets: false,
      };
    case ASSETS_UPDATE_BALANCES_FAILURE:
      return {
        ...state,
        assets: action.payload,
        fetchingAssets: false,
      };
    case ASSETS_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_ASSETS_STATE,
      };
    default:
      return state;
  }
};
