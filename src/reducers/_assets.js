import { apiGetAccountBalances } from '../handlers/api';
import { apiGetAccountUniqueTokens } from '../handlers/opensea-api.js';
import { parseError } from '../handlers/parsers';
import {
  getAssets,
  saveAssets,
  getUniqueTokens,
  saveUniqueTokens,
} from '../handlers/commonStorage';
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

export const assetsClearState = () => dispatch => {
  clearInterval(getBalancesInterval);
  dispatch({ type: ASSETS_CLEAR_STATE });
};

export const assetsRefreshState = () => dispatch => {
  dispatch(assetsGetBalances());
  dispatch(assetsGetUniqueTokens());
};

const assetsGetBalances = () => (dispatch, getState) => {
  const { accountAddress, accountType, network } = getState().settings;
  if (accountAddress && accountType) {
    dispatch(assetsUpdateBalances());
  } else {
    dispatch({ type: ASSETS_GET_BALANCES_REQUEST });
    getAssets(accountAddress, network)
      .then(assets => {
        dispatch({
          type: ASSETS_GET_BALANCES_SUCCESS,
          payload: assets,
        });
        dispatch(assetsUpdateBalances());
        })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
      });
  }
};

const assetsUpdateBalances = () => (dispatch, getState) => {
  const { accountAddress, accountType, network } = getState().settings;
  dispatch({ type: ASSETS_UPDATE_BALANCES_REQUEST });
  const getBalances = () => {
    apiGetAccountBalances(accountAddress, network)
      .then(assets => {
        saveAssets(accountAddress, assets, network);
        dispatch({
          type: ASSETS_UPDATE_BALANCES_SUCCESS,
          payload: assets,
        });
      })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: ASSETS_UPDATE_BALANCES_FAILURE });
      });
  };
  getBalances();
  clearInterval(getBalancesInterval);
  getBalancesInterval = setInterval(getBalances, 15000); // 15 secs
};

const assetsGetUniqueTokens = () => (dispatch, getState) => {
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
      })
      .catch(error => {
        const message = parseError(error);
        dispatch(notificationShow(message, true));
        dispatch({ type: ASSETS_GET_UNIQUE_TOKENS_FAILURE });
    });
  })
  .catch(error => {
    dispatch({ type: ASSETS_GET_UNIQUE_TOKENS_FAILURE });
  });
};


// -- Reducer --------------------------------------------------------------- //
// TODO: assets with default ETH 
export const INITIAL_ASSETS_STATE = {
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
    },
  ],
  fetchingAssets: null, // TODO
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
      return { ...state, fetchingAssets: false };
    case ASSETS_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_ASSETS_STATE,
      };
    default:
      return state;
  }
};
