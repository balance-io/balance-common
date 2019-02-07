import { isEmpty } from 'lodash';
import { apiGetPrices } from '../handlers/api';
import {
  getPrices,
  savePrices,
  removePrices,
} from '../handlers/commonStorage';
import {
  parseError,
  parsePricesObject,
} from '../handlers/parsers';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const PRICES_LOAD_NATIVE_PRICES_REQUEST =
  'prices/PRICES_LOAD_NATIVE_PRICES_REQUEST';
const PRICES_LOAD_NATIVE_PRICES_SUCCESS =
  'prices/PRICES_LOAD_NATIVE_PRICES_SUCCESS';
const PRICES_LOAD_NATIVE_PRICES_FAILURE =
  'prices/PRICES_LOAD_NATIVE_PRICES_FAILURE';

const PRICES_GET_NATIVE_PRICES_REQUEST =
  'prices/PRICES_GET_NATIVE_PRICES_REQUEST';
const PRICES_GET_NATIVE_PRICES_SUCCESS =
  'prices/PRICES_GET_NATIVE_PRICES_SUCCESS';
const PRICES_GET_NATIVE_PRICES_FAILURE =
  'prices/PRICES_GET_NATIVE_PRICES_FAILURE';

const PRICES_CLEAR_STATE =
  'prices/PRICES_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //

export const pricesClearState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  removePrices(accountAddress, network);
  dispatch({ type: PRICES_CLEAR_STATE });
};

export const pricesLoadState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  dispatch({ type: PRICES_LOAD_NATIVE_PRICES_REQUEST });
  getPrices(accountAddress, network)
    .then(prices => {
      dispatch({
        type: PRICES_LOAD_NATIVE_PRICES_SUCCESS,
        payload: prices,
      });
    }).catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      dispatch({ type: PRICES_LOAD_NATIVE_PRICES_FAILURE });
    });
};

export const getNativePrices = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { accountAddress, network } = getState().settings;
  const { assets } = getState().assets;
  const assetSymbols = assets.map(asset => asset.symbol);
  dispatch({ type: PRICES_GET_NATIVE_PRICES_REQUEST });
  apiGetPrices(assetSymbols)
    .then(({ data }) => {
      const prices = parsePricesObject(data, assetSymbols);
      if (!isEmpty(prices)) {
        savePrices(accountAddress, prices, network);
        dispatch({
          type: PRICES_GET_NATIVE_PRICES_SUCCESS,
          payload: prices,
        });
      } else {
        dispatch({ type: PRICES_GET_NATIVE_PRICES_FAILURE });
      }
      resolve(true);
    })
    .catch(error => {
      dispatch({ type: PRICES_GET_NATIVE_PRICES_FAILURE });
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      reject(false);
    });
});

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  loadingPrices: false,
  fetchingPrices: false,
  prices: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PRICES_LOAD_NATIVE_PRICES_REQUEST:
      return {
        ...state,
        loadingPrices: true,
      };
    case PRICES_LOAD_NATIVE_PRICES_SUCCESS:
      return {
        ...state,
        loadingPrices: false,
        prices: action.payload,
      };
    case PRICES_LOAD_NATIVE_PRICES_FAILURE:
      return {
        ...state,
        loadingPrices: false,
      };
    case PRICES_GET_NATIVE_PRICES_REQUEST:
      return {
        ...state,
        fetchingPrices: true,
      };
    case PRICES_GET_NATIVE_PRICES_SUCCESS:
      return {
        ...state,
        fetchingPrices: false,
        prices: action.payload,
      };
    case PRICES_GET_NATIVE_PRICES_FAILURE:
      return {
        ...state,
        fetchingPrices: false,
      };
    case PRICES_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
