import { omit, pickBy } from 'lodash';

const defaultVersion = '0.1.0';
const accountLocalVersion = '0.1.0';
const globalSettingsVersion = '0.1.0';
const walletConnectVersion = '0.1.0';

const defaultExpirationInMs = 24 * 60 * 60 * 1000;

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
      await removeLocal(key);
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
export const removeLocal = async (key = '') => {
  try {
    await storage.removeItem({ key });
  } catch (error) {
    console.log('Storage: error removing local with key', key);
  }
};

/**
 * @desc reset account local
 * @param  {String}   [address]
 */
export const resetAccount = async (accountAddress) => {
  accountAddress = accountAddress.toLowerCase();
  await removeLocal(accountAddress);
  await removeLocal('nativePrices');
};

/**
 * @desc get account local
 * @param  {String}   [address]
 * @return {Object}
 */
export const getAccountLocal = async accountAddress => {
  console.log('get account local', accountAddress);
  return await getLocal(accountAddress.toLowerCase(), accountLocalVersion);
};

/**
 * @desc get native prices
 * @return {Object}
 */
export const getNativePrices = async () => {
  const nativePrices = await getLocal('nativePrices', accountLocalVersion);
  return nativePrices ? nativePrices.data : null;
};

/**
 * @desc save native prices
 * @param  {String}   [address]
 */
export const saveNativePrices = async nativePrices => {
  await saveLocal('nativePrices', { data: nativePrices }, accountLocalVersion);
};

/**
 * @desc get native currency
 * @return {Object}
 */
export const getNativeCurrency = async () => {
  const nativeCurrency = await getLocal(
    'nativeCurrency',
    globalSettingsVersion,
  );
  return nativeCurrency ? nativeCurrency.data : null;
};

/**
 * @desc save native currency
 * @param  {String}   [currency]
 */
export const saveNativeCurrency = async nativeCurrency => {
  await saveLocal(
    'nativeCurrency',
    { data: nativeCurrency },
    globalSettingsVersion,
  );
};

/**
 * @desc update local balances
 * @param  {String}   [address]
 * @param  {Object}   [account]
 * @param  {String}   [network]
 * @return {Void}
 */
export const updateLocalBalances = async (address, account, network) => {
  if (!address) return;
  let accountLocal = await getAccountLocal(address);
  if (!accountLocal) {
    accountLocal = {};
  }
  if (!accountLocal[network]) {
    accountLocal[network] = {};
  }
  accountLocal[network].type = account.type;
  accountLocal[network].balances = {
    assets: account.assets,
    total: account.total || '———',
  };
  await saveLocal(address.toLowerCase(), accountLocal, accountLocalVersion);
};

/**
 * @desc update local transactions
 * @param  {String}   [address]
 * @param  {Array}    [transactions]
 * @param  {String}   [network]
 * @return {Void}
 */
export const updateLocalTransactions = async (
  address,
  transactions,
  network,
) => {
  if (!address) return;
  let accountLocal = await getAccountLocal(address);
  if (!accountLocal) {
    accountLocal = {};
  }
  const pending = [];
  const _transactions = [];
  transactions.forEach(tx => {
    if (tx.pending) {
      pending.push(tx);
    } else {
      _transactions.push(tx);
    }
  });
  if (!accountLocal[network]) {
    accountLocal[network] = {};
  }
  accountLocal[network].transactions = _transactions;
  accountLocal[network].pending = pending;
  await saveLocal(address.toLowerCase(), accountLocal, accountLocalVersion);
};

/**
 * @desc get wallet connect session
 * @return {Object}
 */
export const getWalletConnectSession = async (sessionId) => {
  const allSessions = await getAllWalletConnectSessions();
  const sessionDetails = allSessions ? allSessions[sessionId] : null;
  if (sessionDetails) {
    const expiration = Date.parse(sessionDetails.expiration);
    return (new Date() < expiration) ? sessionDetails : null;
  } else {
    return null;
  }
};

/**
 * @desc get all wallet connect sessions
 * @return {Object}
 */
export const getAllValidWalletConnectSessions = async () => {
  const allSessions = await getAllWalletConnectSessions();
  const validSessions = pickBy(allSessions, (value, key) => {
    const expiration = Date.parse(value.expiration);
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
    walletConnectVersion,
  );
  return allSessions;
};

/**
 * @desc save wallet connect session
 * @param  {String}   [sessionId]
 * @param  {String}   [uriString]
 * @param  {Number}   [expirationInMs]
 */
export const saveWalletConnectSession = async (sessionId, uriString, expirationInMs = defaultExpirationInMs) => {
  let allSessions = await getAllValidWalletConnectSessions();
  let expiration = new Date();
  expiration.setMilliseconds(
    expiration.getMilliseconds() + expirationInMs);
  allSessions[sessionId] = { uriString, expiration };
  await saveLocal('walletconnect',
    allSessions,
    walletConnectVersion);
};

/**
 * @desc remove wallet connect session
 * @param  {String}   [sessionId]
 */
export const removeWalletConnectSession = async (sessionId) => {
  const allSessions = await getAllWalletConnectSessions();
  const session = allSessions ? allSessions[sessionId] : null;
  const resultingSessions = omit(allSessions, [sessionId]);
  await saveLocal('walletconnect',
    resultingSessions,
    walletConnectVersion);
  return session;
};

/**
 * @desc get language
 * @return {Object}
 */
export const getLanguage = async () => {
  const language = await getLocal('language', globalSettingsVersion);
  return language ? language.data : null;
};

/**
 * @desc save language
 * @param  {String}   [language]
 */
export const saveLanguage = async language => {
  await saveLocal('language', { data: language }, globalSettingsVersion);
};
