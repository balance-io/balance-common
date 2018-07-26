import axios from 'axios';
import {
  parseAccountAssets,
  parseAccountTransactions,
  parseHistoricalTransactions,
} from './parsers';
import nativeCurrencies from '../references/native-currencies.json';

const cryptocompareApiKey = process.env.REACT_APP_CRYPTOCOMPARE_API_KEY || '';

/**
 * Configuration for cryptocompare api
 * @type axios instance
 */
const cryptocompare = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data/',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * @desc get all assets prices
 * @param  {Array}   [asset=[]]
 * @return {Promise}
 */
export const apiGetPrices = (assets = []) => {
  const assetsQuery = JSON.stringify(assets).replace(/[[\]"]/gi, '');
  const nativeQuery = JSON.stringify(Object.keys(nativeCurrencies)).replace(
    /[[\]"]/gi,
    '',
  );
  return cryptocompare.get(
    `/pricemultifull?fsyms=${assetsQuery}&tsyms=${nativeQuery}&apiKey=${cryptocompareApiKey}`,
  );
};

/**
 * @desc get historical prices
 * @param  {String}  [assetSymbol='']
 * @param  {Number}  [timestamp=Date.now()]
 * @return {Promise}
 */
export const apiGetHistoricalPrices = (
  assetSymbol = '',
  timestamp = Date.now(),
) => {
  const nativeQuery = JSON.stringify(Object.keys(nativeCurrencies)).replace(
    /[[\]"]/gi,
    '',
  );
  return cryptocompare.get(
    `/pricehistorical?fsym=${assetSymbol}&tsyms=${nativeQuery}&ts=${timestamp}&apiKey=${cryptocompareApiKey}`,
  );
};

/**
 * Configuration for balance api
 * @type axios instance
 */
const api = axios.create({
  baseURL: 'https://indexer.balance.io',
  timeout: 30000, // 30 secs
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * @desc get account balances
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetAccountBalances = async (
  address = '',
  network = 'mainnet',
) => {
  try {
    const { data } = await api.get(`/get_balances/${network}/${address}`);
    const accountInfo = parseAccountAssets(data, address);
    const result = { data: accountInfo };
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @desc get transaction data
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @param  {Number}   [page = 1]
 * @return {Promise}
 */
export const apiGetTransactionData = (
  address = '',
  network = 'mainnet',
  page = 1,
) => api.get(`/get_transactions/${network}/${address}/${page}`);

/**
 * @desc get transaction
 * @param  {String}   [txnHash = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetTransaction = (txnHash = '', network = 'mainnet') =>
  api.get(`/get_transaction/${network}/${txnHash}`);

/**
 * @desc get account transactions
 * @param  {String}   [address = '']
 * @param  {String}   [network = 'mainnet']
 * @return {Promise}
 */
export const apiGetAccountTransactions = async (
  address = '',
  network = 'mainnet',
  lastTxHash = '',
) => {
  try {
    let { data } = await apiGetTransactionData(address, network, 1);
    let transactions = await parseAccountTransactions(data, address, network);
    if (transactions.length && lastTxHash) {
      let newTxs = true;
      transactions = transactions.filter(tx => {
        if (tx.hash === lastTxHash && newTxs) {
          newTxs = false;
          return false;
        } else if (tx.hash !== lastTxHash && newTxs) {
          return true;
        } else {
          return false;
        }
      });
    }
    transactions = await parseHistoricalTransactions(transactions);
    const result = { data: transactions };
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * @desc get ethereum gas prices
 * @return {Promise}
 */
export const apiGetGasPrices = () => api.get(`/get_eth_gas_prices`);

