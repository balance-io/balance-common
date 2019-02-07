import _ from 'lodash';
import lang from '../languages';
import { apiGetAccountTransactions } from '../handlers/api';
import {
  parseError,
  parseNewTransaction,
} from '../handlers/parsers';
import {
  getLocalTransactions,
  saveLocalTransactions,
  removeLocalTransactions,
} from '../handlers/commonStorage';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const TRANSACTIONS_LOAD_REQUEST =
  'transactions/TRANSACTIONS_LOAD_REQUEST';
const TRANSACTIONS_LOAD_SUCCESS =
  'transactions/TRANSACTIONS_LOAD_SUCCESS';
const TRANSACTIONS_LOAD_FAILURE =
  'transactions/TRANSACTIONS_LOAD_FAILURE';

const TRANSACTIONS_GET_TRANSACTIONS_REQUEST =
  'transactions/TRANSACTIONS_GET_TRANSACTIONS_REQUEST';
const TRANSACTIONS_GET_TRANSACTIONS_SUCCESS =
  'transactions/TRANSACTIONS_GET_TRANSACTIONS_SUCCESS';
const TRANSACTIONS_GET_TRANSACTIONS_FAILURE =
  'transactions/TRANSACTIONS_GET_TRANSACTIONS_FAILURE';
const TRANSACTIONS_GET_NO_NEW_PAYLOAD_SUCCESS =
  'transactions/TRANSACTIONS_GET_NO_NEW_PAYLOAD_SUCCESS';

const TRANSACTIONS_ADD_NEW_TRANSACTION_REQUEST =
  'transactions/TRANSACTIONS_ADD_NEW_TRANSACTION_REQUEST';
const TRANSACTIONS_ADD_NEW_TRANSACTION_SUCCESS =
  'transactions/TRANSACTIONS_ADD_NEW_TRANSACTION_SUCCESS';
const TRANSACTIONS_ADD_NEW_TRANSACTION_FAILURE =
  'transactions/TRANSACTIONS_ADD_NEW_TRANSACTION_FAILURE';

const TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION =
  'transactions/TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION';
const TRANSACTIONS_CLEAR_STATE = 'transactions/TRANSACTIONS_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //
let getTransactionsInterval = null;

export const transactionsRefreshState = () => (dispatch, getState) => new Promise((resolve, reject) => {
  const getTransactions = () => new Promise((resolve, reject) => {
    dispatch({ type: TRANSACTIONS_GET_TRANSACTIONS_REQUEST });
    const { assets } = getState().assets;
    const { loadingTransactions, transactions } = getState().transactions;
    const { accountAddress, network } = getState().settings;
    const lastSuccessfulTxn = _.find(transactions, (txn) => txn.hash && !txn.pending);
    const lastTxHash = lastSuccessfulTxn ? lastSuccessfulTxn.hash : '';
    const partitions = _.partition(transactions, (txn) => txn.pending);
    if (!loadingTransactions) {
      dispatch(getPages({
        assets,
        newTransactions: [],
        pendingTransactions: partitions[0],
        confirmedTransactions: partitions[1],
        accountAddress,
        network,
        lastTxHash,
        page: 1
      })).then(() => {
        resolve(true);
      }).catch(error => {
        reject(error);
      });
    }
  });
  getTransactions().then(() => {
    clearInterval(getTransactionsInterval);
    getTransactionsInterval = setInterval(getTransactions, 15000); // 15 secs
    resolve(true);
  }).catch(error => {
    clearInterval(getTransactionsInterval);
    getTransactionsInterval = setInterval(getTransactions, 15000); // 15 secs
    reject(error);
  });
});


export const transactionsUpdateHasPendingTransaction = (hasPending = true) => dispatch => {
  dispatch({
    type: TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION,
    payload: hasPending,
  });
};

export const transactionsAddNewTransaction = txDetails => (dispatch, getState) => new Promise((resolve, reject) => {
  dispatch({ type: TRANSACTIONS_ADD_NEW_TRANSACTION_REQUEST });
  const { transactions } = getState().transactions;
  const { accountAddress, nativeCurrency, network } = getState().settings;
  parseNewTransaction(txDetails, nativeCurrency)
    .then(parsedTransaction => {
      let _transactions = [parsedTransaction, ...transactions];
      saveLocalTransactions(accountAddress, _transactions, network);
      dispatch({
        type: TRANSACTIONS_ADD_NEW_TRANSACTION_SUCCESS,
        payload: _transactions,
      });
      resolve(true);
    })
    .catch(error => {
      dispatch({ type: TRANSACTIONS_ADD_NEW_TRANSACTION_FAILURE });
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      reject(false);
    });
});

export const transactionsClearState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  removeLocalTransactions(accountAddress, network);
  clearInterval(getTransactionsInterval);
  dispatch({ type: TRANSACTIONS_CLEAR_STATE });
};

export const transactionsLoadState = () => (dispatch, getState) => {
  const { accountAddress, network } = getState().settings;
  dispatch({ type: TRANSACTIONS_LOAD_REQUEST });
  getLocalTransactions(accountAddress, network).then(transactions => {
    dispatch({
      type: TRANSACTIONS_LOAD_SUCCESS,
      payload: transactions,
    });
  }).catch(error => {
    dispatch({ type: TRANSACTIONS_LOAD_FAILURE });
  });
};

const getPages = ({
  assets,
  newTransactions,
  pendingTransactions,
  confirmedTransactions,
  accountAddress,
  network,
  lastTxHash,
  page
}) => dispatch => new Promise((resolve, reject) => {
  apiGetAccountTransactions(assets, accountAddress, network, lastTxHash, page)
    .then(({ data: transactionsForPage, pages }) => {
      if (!transactionsForPage.length) {
        dispatch({
          type: TRANSACTIONS_GET_NO_NEW_PAYLOAD_SUCCESS
        });
        resolve(true);
      }
      let updatedPendingTransactions = pendingTransactions;
      if (pendingTransactions.length) {
        updatedPendingTransactions = _.filter(pendingTransactions, (pendingTxn) => {
          const matchingElement = _.find(transactionsForPage, (txn) => txn.hash && txn.hash.startsWith(pendingTxn.hash));
          return !matchingElement;
        });
      }
      let _newPages = newTransactions.concat(transactionsForPage);
      let _transactions = _.unionBy(updatedPendingTransactions, _newPages, confirmedTransactions, 'hash');
      saveLocalTransactions(accountAddress, _transactions, network);
      dispatch({
        type: TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
        payload: _transactions,
      });
      if (page < pages) {
        const nextPage = page + 1;
        dispatch(getPages({
          assets,
          newTransactions: _newPages,
          pendingTransactions: updatedPendingTransactions,
          confirmedTransactions,
          accountAddress,
          network,
          lastTxHash,
          page: nextPage
        }));
      }
      resolve(true);
    })
    .catch(error => {
      dispatch(
        notificationShow(
          lang.t('notification.error.failed_get_account_tx'),
          true,
        ),
      );
      dispatch({ type: TRANSACTIONS_GET_TRANSACTIONS_FAILURE });
      reject(error);
    });
});

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  loadingTransactions: false,
  fetchingTransactions: false,
  hasPendingTransaction: false,
  transactions: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSACTIONS_LOAD_REQUEST:
      return { ...state, loadingTransactions: true };
    case TRANSACTIONS_LOAD_SUCCESS:
      return {
        ...state,
        loadingTransactions: false,
        transactions: action.payload,
      };
    case TRANSACTIONS_LOAD_FAILURE:
      return { ...state, loadingTransactions: false };
    case TRANSACTIONS_GET_TRANSACTIONS_REQUEST:
      return { ...state, fetchingTransactions: true };
    case TRANSACTIONS_GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        fetchingTransactions: false,
        transactions: action.payload,
      };
    case TRANSACTIONS_GET_NO_NEW_PAYLOAD_SUCCESS:
      return { ...state, fetchingTransactions: false };
    case TRANSACTIONS_GET_TRANSACTIONS_FAILURE:
      return { ...state, fetchingTransactions: false };
    case TRANSACTIONS_ADD_NEW_TRANSACTION_REQUEST:
      return { ...state, hasPendingTransaction: true };
    case TRANSACTIONS_ADD_NEW_TRANSACTION_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
      };
    case TRANSACTIONS_ADD_NEW_TRANSACTION_FAILURE:
      return {
        ...state,
        hasPendingTransaction: false,
      };
    case TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION:
      return { ...state, hasPendingTransaction: action.payload };
    case TRANSACTIONS_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
