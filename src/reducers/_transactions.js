import _ from 'lodash';
import lang from '../languages';
import { apiGetAccountTransactions } from '../handlers/api';
import {
  parseError,
  parseNewTransaction,
} from '../handlers/parsers';
import { notificationShow } from './_notification';

// -- Constants ------------------------------------------------------------- //
const TRANSACTIONS_LOAD_LAST_HASH_SUCCESS =
  'transactions/TRANSACTIONS_LOAD_LAST_HASH_SUCCESS';

const TRANSACTIONS_CLEAR_STATE = 'transactions/TRANSACTIONS_CLEAR_STATE';

const LAST_TXN_HASH = 'lastTxnHash';
let getTransactionsInterval = null;

export const transactionsLoadState = () => dispatch => {
  database.adapter.getLocal(LAST_TXN_HASH)
  .then(lastTxnHash => {
    if (lastTxnHash) {
      console.log('got lastTxnHash from db adapter', lastTxnHash);
      dispatch({
        type: TRANSACTIONS_LOAD_LAST_HASH_SUCCESS,
        payload: lastTxnHash
      });
    }
  }).catch(error => {
  });
};

export const transactionsRefreshState = () => (dispatch, getState) => {
  const getTransactions = () => {
    const { accountAddress, network } = getState().settings;
    const { assets } = getState().assets;
    const { lastTxnHash } = getState().transactions;
    getPages({
      assets,
      accountAddress,
      network,
      lastTxnHash,
      page: 1
    });
  };
  getTransactions();
  clearInterval(getTransactionsInterval);
  getTransactionsInterval = setInterval(getTransactions, 15000); // 15 secs
};

export const transactionsAddNewTransaction = txDetails => (dispatch, getState) => new Promise((resolve, reject) => {
  const { nativeCurrency } = getState().settings;
  parseNewTransaction(txDetails, nativeCurrency)
    .then(parsedTransaction => {
      // TODO test
      database.action(async () => {
        const transactionsCollection = database.collections.get('transactions');
        await transactionsCollection.create(transaction => {
          _.assign(transaction, parsedTransaction);
        });
      });
      resolve(true);
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      reject(false);
    });
});

export const transactionsClearState = () => (dispatch, getState) => {
  clearInterval(getTransactionsInterval);
  database.adapter.removeLocal(LAST_TXN_HASH);
  // TODO test
  const transactionsCollection = database.collections.get('transactions');
  console.log('clearing txn state', transactionsCollection);
  transactionsCollection.query().destroyAllPermanently();
  dispatch({ type: TRANSACTIONS_CLEAR_STATE });
};

const getPages = ({
  assets,
  accountAddress,
  network,
  lastTxnHash,
  page
}) => dispatch => {
  //TODO deal with pending
  apiGetAccountTransactions(assets, accountAddress, network, lastTxnHash, page)
    .then(({ data: transactionsForPage, pages }) => {
      if (!transactionsForPage.length) {
        return;
      }
      if (transactionsForPage.length) {
        if (page === 1) {
          const newLastTxnHash = get(transactionsForPage, '[0].hash', lastTxnHash);
          database.adapter.setLocal(LAST_TXN_HASH, newLastTxnHash);
        }
        database.action(async () => {
          const transactionsCollection = database.collections.get('transactions');
          const newTransactionActions = transactionsForPage.map(txn => transactionsCollection.prepareCreate(transaction => {
           _.assign(transaction, txn);
          }));
          await database.batch(...newTransactionActions);
        })
          .then(() => { console.log('db save success') })
          .catch(error => console.log('db error', error));
      }

      if (page < pages) {
        const nextPage = page + 1;
        dispatch(getPages({
          assets,
          accountAddress,
          network,
          lastTxnHash,
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
    });
}

// -- Reducer --------------------------------------------------------------- //
export const INITIAL_STATE = {
  lastTxnHash: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSACTIONS_LOAD_LAST_HASH_SUCCESS:
      return {
        ...state,
        lastTxnHash: action.payload,
      };
    case TRANSACTIONS_CLEAR_STATE:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
