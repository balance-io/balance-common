import _ from 'lodash';
import lang from '../languages';
import { apiGetAccountTransactions } from '../handlers/api';
import {
  parseError,
  parseNewTransaction,
} from '../handlers/parsers';
import {
  getTransactions,
  saveTransactions,
} from '../handlers/commonStorage';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_REQUEST =
  'transactions/TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_REQUEST';
const TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_SUCCESS =
  'transactions/TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_SUCCESS';
const TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_NO_NEW_PAYLOAD_SUCCESS =
  'transactions/TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_NO_NEW_PAYLOAD_SUCCESS';
const TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_FAILURE =
  'transactions/TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_FAILURE';

const TRANSACTIONS_UPDATE_TRANSACTIONS_REQUEST =
  'transactions/TRANSACTIONS_UPDATE_TRANSACTIONS_REQUEST';
const TRANSACTIONS_UPDATE_TRANSACTIONS_SUCCESS =
  'transactions/TRANSACTIONS_UPDATE_TRANSACTIONS_SUCCESS';
const TRANSACTIONS_UPDATE_TRANSACTIONS_FAILURE =
  'transactions/TRANSACTIONS_UPDATE_TRANSACTIONS_FAILURE';

const TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION =
  'transactions/TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION';
const TRANSACTIONS_CLEAR_STATE = 'transactions/TRANSACTIONS_CLEAR_STATE';

// -- Actions --------------------------------------------------------------- //
let getAccountTransactionsInterval = null;

export const transactionsUpdateHasPendingTransaction = (
  hasPending = true,
) => dispatch => {
  dispatch({
    type: TRANSACTIONS_UPDATE_HAS_PENDING_TRANSACTION,
    payload: hasPending,
  });
};

export const transactionsUpdateTransactions = txDetails => (dispatch, getState) => new Promise((resolve, reject) => {
  dispatch({ type: TRANSACTIONS_UPDATE_TRANSACTIONS_REQUEST });
  const currentTransactions = getState().transactions.transactions;
  const { accountAddress, nativeCurrency, network } = getState().account;
  parseNewTransaction(txDetails, nativeCurrency)
    .then(parsedTransaction => {
      let _transactions = [...currentTransactions];
      _transactions = [parsedTransaction, ..._transactions];
      saveTransactions(accountAddress, _transactions, network);
      dispatch({
        type: TRANSACTIONS_UPDATE_TRANSACTIONS_SUCCESS,
        payload: _transactions,
      });
      resolve(true);
    })
    .catch(error => {
      dispatch({ type: TRANSACTIONS_UPDATE_TRANSACTIONS_FAILURE });
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      reject(false);
    });
});

export const transactionsClearState = () => dispatch => {
  clearInterval(getAccountTransactionsInterval);
  dispatch({ type: TRANSACTIONS_CLEAR_STATE });
};

const transactionsGetTransactions = (accountAddress, network, lastTxHash, page) => (dispatch, getState) => {
  const existingTransactions = getState().transactions.transactions;
  const partitions = _.partition(existingTransactions, (txn) => txn.pending);
  dispatch(transactionsGetTransactionsPages({
    newTransactions: [],
    pendingTransactions: partitions[0],
    confirmedTransactions: partitions[1],
    accountAddress,
    network,
    lastTxHash,
    page
  }));
}

const transactionsGetTransactionsPages = ({
  newTransactions,
  pendingTransactions,
  confirmedTransactions,
  accountAddress,
  network,
  lastTxHash,
  page
}) => (dispatch, getState) => {
  apiGetAccountTransactions(accountAddress, network, lastTxHash, page)
    .then(({ data: transactionsForPage, pages }) => {
      if (!transactionsForPage.length) {
        dispatch({
          type: TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_NO_NEW_PAYLOAD_SUCCESS
        });
        return;
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
      saveTransactions(accountAddress, _transactions, network);
      dispatch({
        type: TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_SUCCESS,
        payload: _transactions,
      });
      if (page < pages) {
        const nextPage = page + 1;
        dispatch(transactionsGetTransactionsPages({
          newTransactions: _newPages,
          pendingTransactions: updatedPendingTransactions,
          confirmedTransactions,
          accountAddress,
          network,
          lastTxHash,
          page: nextPage
        }));
      }
    })
    .catch(error => {
      dispatch(
        notificationShow(
          lang.t('notification.error.failed_get_account_tx'),
          true,
        ),
      );
      dispatch({ type: TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_FAILURE });
    });
}

export const transactionsGetAccountTransactions = () => (dispatch, getState) => {
  const getAccountTransactions = () => {
    const { transactions } = getState().transactions;
    const { accountAddress, network } = getState().account;
    if (transactions.length) {
      const lastSuccessfulTxn = _.find(transactions, (txn) => txn.hash && !txn.pending);
      const lastTxHash = lastSuccessfulTxn ? lastSuccessfulTxn.hash : '';
      dispatch(transactionsGetTransactions(accountAddress, network, lastTxHash, 1));
    } else {
      getTransactions(accountAddress, network).then(transactions => {
        dispatch({
          type: TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_REQUEST,
          payload: {
            transactions,
            fetchingTransactions: !transactions || !transactions.length
          },
        });
        const lastSuccessfulTxn = _.find(transactions, (txn) => txn.hash && !txn.pending);
        const lastTxHash = lastSuccessfulTxn ? lastSuccessfulTxn.hash : '';
        dispatch(transactionsGetTransactions(accountAddress, network, lastTxHash, 1));
      }).catch(error => {
        dispatch({ type: TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_FAILURE });
      });
    }
  };
  getAccountTransactions();
  clearInterval(getAccountTransactionsInterval);
  getAccountTransactionsInterval = setInterval(getAccountTransactions, 15000); // 15 secs
};

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  fetchingTransactions: false,
  hasPendingTransaction: false,
  transactions: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_REQUEST:
      return {
        ...state,
        fetchingTransactions: action.payload.fetchingTransactions,
        transactions: action.payload.transactions,
      };
    case TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_NO_NEW_PAYLOAD_SUCCESS:
      return {
        ...state,
        fetchingTransactions: false,
      };
    case TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        fetchingTransactions: false,
        transactions: action.payload,
      };
    case TRANSACTIONS_GET_ACCOUNT_TRANSACTIONS_FAILURE:
      return { ...state, fetchingTransactions: false };
    case TRANSACTIONS_UPDATE_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload,
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
