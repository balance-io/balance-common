const defaultVersion = '0.1.0';
const accountLocalVersion = '0.1.0';
const globalSettingsVersion = '0.1.0';
const walletConnectVersion = '0.1.0';

/**
 * @desc save to storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @param  {String} [version=defaultVersion]
 */
export const saveLocal = async (key = '', data = {}, version = defaultVersion) => {
  try {
    data['storageVersion'] = version;
    await storage.save({ key, data, expires: null });
  } catch (error) {
    console.log('error saving to local for key: ', key);
    // TODO error handling
  }
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = async (key = '', version = defaultVersion) => {
  try {
    const result = await storage.load({ key, autoSync: false, syncInBackground: false });
    if (result && result.storageVersion === version) {
      return result;
    } else if (result) {
      await removeLocal(key);
      return null;
    }
  } catch(error) {
    // TODO error handling
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
    // TODO error handling
    console.log('error removing local with key: ', key);
    console.log('error removing local with error: ', error);
  }
}

/**
 * @desc get account local
 * @param  {String}   [address]
 * @return {Object}
 */
export const getAccountLocal = async (accountAddress) => {
  return await getLocal(accountAddress, accountLocalVersion);
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
export const saveNativePrices = async (nativePrices) => {
  await saveLocal('nativePrices', { data: nativePrices }, accountLocalVersion);
};

/**
 * @desc get native currency
 * @return {Object}
 */
export const getNativeCurrency = async () => {
  const nativeCurrency = await getLocal('nativeCurrency', globalSettingsVersion);
  return nativeCurrency ? nativeCurrency.data : null;
};

/**
 * @desc save native currency
 * @param  {String}   [currency]
 */
export const saveNativeCurrency = async (nativeCurrency) => {
  await saveLocal('nativeCurrency', { data: nativeCurrency }, globalSettingsVersion);
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
  let accountLocal = await getLocal(address) || {};
  if (!accountLocal[network]) {
    accountLocal[network] = {};
  }
  accountLocal[network].type = account.type;
  accountLocal[network].balances = {
    assets: account.assets,
    total: account.total || '———',
  };
  await saveLocal(address, accountLocal, accountLocalVersion);
};

/**
 * @desc update local transactions
 * @param  {String}   [address]
 * @param  {Array}    [transactions]
 * @param  {String}   [network]
 * @return {Void}
 */
export const updateLocalTransactions = async (address, transactions, network) => {
  if (!address) return;
  let accountLocal = await getLocal(address) || {};
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
  await saveLocal(address, accountLocal, accountLocalVersion);
};

/**
 * @desc get wallet connect account
 * @return {Object}
 */
export const getWalletConnectAccount = async () => {
  const walletConnectAccount = await getLocal('walletconnect', walletConnectVersion);
  return walletConnectAccount ? walletConnectAccount.data : null;
};

/**
 * @desc save wallet connect account
 * @param  {String}   [address]
 */
export const saveWalletConnectAccount = async (account) => {
  await saveLocal('walletconnect', { data: account }, walletConnectVersion);
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
export const saveLanguage = async (language) => {
  await saveLocal('language', { data: language }, globalSettingsVersion);
};
