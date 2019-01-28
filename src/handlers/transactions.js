import _ from 'lodash';
import lang from '../languages';
import { apiGetAccountTransactions } from './api';
import {
  parseError,
  parseNewTransaction,
} from './parsers';

let getTransactionsInterval = null;

export const transactionsRefreshState = (accountAddress, network) => {
  const getTransactions = () => {
    // TODO: how to deal with pending
    //TODO get last successful txn hash from transactions
    const lastSuccessfulTxn = _.find(transactions, (txn) => txn.hash && !txn.pending);
    const lastTxHash = lastSuccessfulTxn ? lastSuccessfulTxn.hash : '';
    getPages({
      accountAddress,
      network,
      lastTxHash,
      page: 1
    });
  };
  getTransactions();
  clearInterval(getTransactionsInterval);
  getTransactionsInterval = setInterval(getTransactions, 15000); // 15 secs
};

export const addNewTransaction = (txDetails, nativeCurrency) => new Promise((resolve, reject) => {
  parseNewTransaction(txDetails, nativeCurrency)
    .then(parsedTransaction => {
      //TODO add parsedTransaction
      resolve(true);
    })
    .catch(error => {
      const message = parseError(error);
      reject(false);
    });
});

// TODO do anything with database?
export const transactionsClearState = () => {
  clearInterval(getTransactionsInterval);
};

const getPages = ({
  accountAddress,
  network,
  lastTxHash,
  page
}) => {
  //TODO deal with pending
  apiGetAccountTransactions(accountAddress, network, lastTxHash, page)
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
        getPages({
          accountAddress,
          network,
          lastTxHash,
          page: nextPage
        });
      }
    })
    .catch(error => {
    });
}
