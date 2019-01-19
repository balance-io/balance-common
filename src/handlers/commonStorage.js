import { differenceInMinutes } from 'date-fns';
import { omit, pickBy } from 'lodash';

const defaultVersion = '0.1.0';

/**
 * @desc save to storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @param  {String} [version=defaultVersion]
 */
export const saveLocal = async (
  key = '',
  data = {},
  version = defaultVersion,
) => {
  try {
    data['storageVersion'] = version;
    await storage.save({ key, data, expires: null });
  } catch (error) {
    console.log('Storage: error saving to local for key', key);
  }
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = async (key = '', version = defaultVersion) => {
  try {
    const result = await storage.load({
      key,
      autoSync: false,
      syncInBackground: false,
    });
    if (result && result.storageVersion === version) {
      return result;
    } else if (result) {
      removeLocal(key);
      return null;
    }
  } catch (error) {
    console.log('Storage: error getting from local for key', key);
    return null;
  }
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const removeLocal = (key = '') => {
  try {
    storage.remove({ key });
  } catch (error) {
    console.log('Storage: error removing local with key', key);
  }
};

const getAssetsKey = (accountAddress, network) => `assets-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;

const getPricesKey = (accountAddress, network) => `prices-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;

const getTransactionsKey = (accountAddress, network) => `transactions-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;

const getUniqueTokensKey = (accountAddress, network) => `uniquetokens-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;

/**
 * @desc get prices
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getPrices = async (accountAddress, network) => {
  const prices = await getLocal(getPricesKey(accountAddress, network));
  return prices ? prices.data : {};
};

/**
 * @desc save prices
 * @param  {String}   [address]
 * @param  {String}   [network]
 */
export const savePrices = async (accountAddress, prices, network) => {
  await saveLocal(
    getPricesKey(accountAddress, network),
    { data: prices },
  );
};

/**
 * @desc remove prices
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const removePrices = (accountAddress, network) => {
  const key = getPricesKey(accountAddress, network);
  removeLocal(key);
};

/**
 * @desc get assets
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getAssets = async (accountAddress, network) => {
  const assets = await getLocal(getAssetsKey(accountAddress, network));
  return assets ? assets.data : [];
};

/**
 * @desc save assets
 * @param  {String}   [address]
 * @param  {String}   [network]
 */
export const saveAssets = async (accountAddress, assets, network) => {
  await saveLocal(
    getAssetsKey(accountAddress, network),
    { data: assets },
  );
};

/**
 * @desc remove assets
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const removeAssets = (accountAddress, network) => {
  const key = getAssetsKey(accountAddress, network);
  removeLocal(key);
};

/**
 * @desc get transactions
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getLocalTransactions = async (accountAddress, network) => {
  const transactions = await getLocal(getTransactionsKey(accountAddress, network));
  return transactions ? transactions.data : [];
};

/**
 * @desc save transactions
 * @param  {String}   [address]
 * @param  {Array}   [transactions]
 * @param  {String}   [network]
 */
export const saveLocalTransactions = async (accountAddress, transactions, network) => {
  await saveLocal(
    getTransactionsKey(accountAddress, network),
    { data: transactions },
  );
};

/**
 * @desc remove transactions
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const removeLocalTransactions = (accountAddress, network) => {
  const key = getTransactionsKey(accountAddress, network);
  removeLocal(key);
};

/**
 * @desc get unique tokens
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const getUniqueTokens = async (accountAddress, network) => {
  const uniqueTokens = await getLocal(getUniqueTokensKey(accountAddress, network));
  return uniqueTokens ? uniqueTokens.data : [];
};

/**
 * @desc save unique tokens
 * @param  {String}   [address]
 * @param  {Array}   [uniqueTokens]
 * @param  {String}   [network]
 */
export const saveUniqueTokens = async (accountAddress, uniqueTokens, network) => {
  await saveLocal(
    getUniqueTokensKey(accountAddress, network),
    { data: uniqueTokens },
  );
};

/**
 * @desc remove unique tokens
 * @param  {String}   [address]
 * @param  {String}   [network]
 * @return {Object}
 */
export const removeUniqueTokens = (accountAddress, network) => {
  const key = getUniqueTokensKey(accountAddress, network);
  removeLocal(key);
};

/**
 * @desc get native currency
 * @return {Object}
 */
export const getNativeCurrency = async () => {
  const nativeCurrency = await getLocal(
    'nativeCurrency',
  );
  return nativeCurrency ? nativeCurrency.data : 'USD';
};

/**
 * @desc save native currency
 * @param  {String}   [currency]
 */
export const saveNativeCurrency = async nativeCurrency => {
  await saveLocal(
    'nativeCurrency',
    { data: nativeCurrency },
  );
};

/**
 * @desc get all wallet connect sessions
 * @return {Object}
 */
export const getAllValidWalletConnectSessions = async () => {
  const allSessions = await getAllWalletConnectSessions();
  const validSessions = pickBy(allSessions, (value, key) => {
    const expiration = new Date(value.expiration);
    return (new Date() < expiration);
  });
  return validSessions;
};

/**
 * @desc get all wallet connect sessions
 * @return {Object}
 */
export const getAllWalletConnectSessions = async () => {
  const allSessions = await getLocal(
    'walletconnect',
  );
  return allSessions ? allSessions : {};
};

/**
 * @desc save wallet connect session
 * @param  {String}   [sessionId]
 * @param  {String}   [uriString]
 * @param  {Number}   [expirationDateInMs]
 */
export const saveWalletConnectSession = async (sessionId, uriString, expirationDateInMs) => {
  let allSessions = await getAllValidWalletConnectSessions();
  allSessions[sessionId] = { uriString, expiration: expirationDateInMs };
  await saveLocal('walletconnect', allSessions);
};

/**
 * @desc remove wallet connect session
 * @param  {String}   [sessionId]
 */
export const removeWalletConnectSession = async (sessionId) => {
  const allSessions = await getAllWalletConnectSessions();
  const session = allSessions ? allSessions[sessionId] : null;
  const resultingSessions = omit(allSessions, [sessionId]);
  await saveLocal('walletconnect', resultingSessions);
  return session;
};

/**
 * @desc remove wallet connect sessions
 * @param  {String}   [sessionId]
 */
export const removeWalletConnectSessions = async (sessionIds) => {
  const allSessions = await getAllWalletConnectSessions();
  const resultingSessions = omit(allSessions, sessionIds);
  await saveLocal('walletconnect', resultingSessions);
};

/**
 * @desc remove all wallet connect sessions
 * @param  {String}   [sessionId]
 */
export const removeWalletConnect = () => {
  removeLocal('walletconnect');
};

/**
 * @desc get language
 * @return {Object}
 */
export const getLanguage = async () => {
  const language = await getLocal('language');
  return language ? language.data : 'en';
};

/**
 * @desc save language
 * @param  {String}   [language]
 */
export const saveLanguage = async language => {
  await saveLocal('language', { data: language });
};
