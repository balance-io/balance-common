import { updateLanguage } from '../languages';
import {
  getLanguage,
  getNativeCurrency,
  saveLanguage,
  saveNativeCurrency,
} from '../handlers/commonStorage';
import { web3SetHttpProvider } from '../handlers/web3';
import { getNetworkFromChainId, getChainIdFromNetwork } from '../helpers/utilities';

// -- Constants ------------------------------------------------------------- //
const SETTINGS_UPDATE_NETWORK = 'settings/SETTINGS_UPDATE_NETWORK';
const SETTINGS_UPDATE_CHAIN_ID = 'settings/SETTINGS_UPDATE_CHAIN_ID';
const SETTINGS_UPDATE_SETTINGS_ADDRESS = 'settings/SETTINGS_UPDATE_SETTINGS_ADDRESS';

const SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS = 'settings/SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS';
const SETTINGS_UPDATE_NATIVE_CURRENCY_FAILURE = 'settings/SETTINGS_UPDATE_NATIVE_CURRENCY_FAILURE';

const SETTINGS_UPDATE_LANGUAGE_SUCCESS = 'settings/SETTINGS_UPDATE_LANGUAGE_SUCCESS';
const SETTINGS_UPDATE_LANGUAGE_FAILURE = 'settings/SETTINGS_UPDATE_LANGUAGE_FAILURE';

// -- Actions --------------------------------------------------------------- //
export const settingsInitializeState = () => dispatch => {
  getLanguage().then(language => {
    dispatch({
      type: SETTINGS_UPDATE_LANGUAGE_SUCCESS,
      payload: language
    });
  }).catch(error => {
    dispatch({
      type: SETTINGS_UPDATE_LANGUAGE_FAILURE
    });
  });
  getNativeCurrency().then(nativeCurrency => {
    dispatch({
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS,
      payload: nativeCurrency,
    });
  }).catch(error => {
    dispatch({
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_FAILURE
    });

  });
};

export const settingsUpdateAccountAddress = (accountAddress, accountType) => (
  dispatch,
  getState,
) => {
  dispatch({
    type: SETTINGS_UPDATE_SETTINGS_ADDRESS,
    payload: { accountAddress, accountType },
  });
};

export const settingsUpdateNetwork = network => dispatch => {
  const chainId = getChainIdFromNetwork(network);
  web3SetHttpProvider(`https://${network}.infura.io/`);
  dispatch({ type: SETTINGS_UPDATE_NETWORK, payload: { network, chainId } });
};

export const settingsUpdateChainId = chainId => dispatch => {
  const network = getNetworkFromChainId(chainId);
  web3SetHttpProvider(`https://${network}.infura.io/`);
  dispatch({ type: SETTINGS_UPDATE_CHAIN_ID, payload: { network, chainId } });
};

export const settingsChangeLanguage = language => dispatch => {
  //TODO: needs to trigger render after change
  updateLanguage(language);
  saveLanguage(language).then( () => {
    dispatch({
      type: SETTINGS_UPDATE_LANGUAGE_SUCCESS,
      payload: language,
    });
  }).catch(error => {
    dispatch({
      type: SETTINGS_UPDATE_LANGUAGE_FAILURE,
    });
  });
};

export const settingsChangeNativeCurrency = nativeCurrency => (
  dispatch,
) => {
  saveNativeCurrency(nativeCurrency).then(() => {
    dispatch({
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS,
      payload: nativeCurrency,
    });
  }).catch(error => {
    dispatch({
      type: SETTINGS_UPDATE_NATIVE_CURRENCY_FAILURE,
    });
  });
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  accountType: '',
  accountAddress: '',
  language: 'en',
  nativeCurrency: 'USD',
  chainId: 1,
  network: 'mainnet',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SETTINGS_UPDATE_SETTINGS_ADDRESS:
      return {
        ...state,
        accountType: action.payload.accountType,
        accountAddress: action.payload.accountAddress,
      };
    case SETTINGS_UPDATE_NATIVE_CURRENCY_SUCCESS:
      return {
        ...state,
        nativeCurrency: action.payload,
      };
    case SETTINGS_UPDATE_NATIVE_CURRENCY_FAILURE:
      return {
        ...state,
      };
    case SETTINGS_UPDATE_NETWORK:
      return {
        ...state,
        network: action.payload.network,
        chainId: action.payload.chainId
      };
    case SETTINGS_UPDATE_CHAIN_ID:
      return {
        ...state,
        network: action.payload.network,
        chainId: action.payload.chainId
      };
    case SETTINGS_UPDATE_LANGUAGE_SUCCESS:
      return {
        ...state,
        language: action.payload,
      };
    case SETTINGS_UPDATE_LANGUAGE_FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
