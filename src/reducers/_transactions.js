import _ from 'lodash';
import lang from '../languages';
import { apiGetAccountTransactions } from '../handlers/api';
import {
  parseError,
  parseNewTransaction,
} from '../handlers/parsers';
import { notificationShow } from './_notification';

let getTransactionsInterval = null;

export const transactionsRefreshState = () => dispatch => {
  dispatch(getAccountTransactions());
};

//TODO is this still needed? who uses it and what happens when app restarted
export const transactionsAddNewTransaction = txDetails => (dispatch, getState) => new Promise((resolve, reject) => {
  const { nativeCurrency } = getState().settings;
  parseNewTransaction(txDetails, nativeCurrency)
    .then(parsedTransaction => {
      //TODO add parsedTransaction
      resolve(true);
    })
    .catch(error => {
      const message = parseError(error);
      dispatch(notificationShow(message, true));
      reject(false);
    });
});

// TODO do anything with database?
export const transactionsClearState = () => (dispatch, getState) => {
  clearInterval(getTransactionsInterval);
};

const getAccountTransactions = () => (dispatch, getState) => {
  const getTransactions = () => {
    const { assets } = getState().assets;
    const { accountAddress, network } = getState().settings;
    // TODO: how to deal with pending
    //TODO get last successful txn hash from transactions
    const lastSuccessfulTxn = _.find(transactions, (txn) => txn.hash && !txn.pending);
    const lastTxHash = lastSuccessfulTxn ? lastSuccessfulTxn.hash : '';
    dispatch(getPages({
      assets,
      accountAddress,
      network,
      lastTxHash,
      page: 1
    }));
  };
  getTransactions();
  clearInterval(getTransactionsInterval);
  getTransactionsInterval = setInterval(getTransactions, 15000); // 15 secs
};

const getPages = ({
  assets,
  accountAddress,
  network,
  lastTxHash,
  page
}) => dispatch => {
  //TODO deal with pending
  apiGetAccountTransactions(assets, accountAddress, network, lastTxHash, page)
    .then(({ data: transactionsForPage, pages }) => {
      if (!transactionsForPage.length) {
        return;
      }
      if (transactionsForPage.length) {
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
    });
}
