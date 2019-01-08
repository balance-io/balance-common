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

/**
 * @desc reset account local
 * @param  {String}   [address]
 */
export const resetAccount = (accountAddress) => {
  const accountAddressKey = accountAddress.toLowerCase();
  removeLocal(accountAddressKey);
  removeLocal('nativePrices');
};

/**
 * @desc get account local
 * @param  {String}   [address]
 * @return {Object}
 */
export const getAccountLocal = async accountAddress => {
  return await getLocal(accountAddress.toLowerCase());
};

const getTransactionsKey = (accountAddress, network) => {
  return `transactions-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;
};

const getUniqueTokensKey = (accountAddress, network) => {
  return `uniquetokens-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;
};

const getAssetsKey = (accountAddress, network) => {
  return `assets-${accountAddress.toLowerCase()}-${network.toLowerCase()}`;
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
