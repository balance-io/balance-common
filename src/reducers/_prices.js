import { apiGetPrices } from '../handlers/api';
import {
  parseError,
  parsePricesObject,
} from '../handlers/parsers';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const PRICES_GET_NATIVE_PRICES_REQUEST =
  'prices/PRICES_GET_NATIVE_PRICES_REQUEST';
const PRICES_GET_NATIVE_PRICES_SUCCESS =
  'prices/PRICES_GET_NATIVE_PRICES_SUCCESS';
const PRICES_GET_NATIVE_PRICES_FAILURE =
  'prices/PRICES_GET_NATIVE_PRICES_FAILURE';

const PRICES_CLEAR_STATE =
  'prices/PRICES_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //

export const pricesClearState = () => dispatch => {
  dispatch({ type: PRICES_CLEAR_STATE });
};

export const getNativePrices = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const { assets } = getState().assets;
  const assetSymbols = assets.map(asset => asset.symbol);
  dispatch({ type: PRICES_GET_NATIVE_PRICES_REQUEST });
  apiGetPrices(assetSymbols)
    .then(({ data }) => {
      const prices = parsePricesObject(data, assetSymbols);
      dispatch({
        type: PRICES_GET_NATIVE_PRICES_SUCCESS,
        payload: prices,
      });
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
  fetchingPrices: false,
  prices: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
