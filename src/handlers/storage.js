const defaultVersion = '0.1.0';
const accountLocalVersion = '0.1.0';
const globalSettingsVersion = '0.1.0';

/**
 * @desc save to storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @param  {String} [version=defaultVersion]
 */
export const saveLocal = (key = '', data = {}, version = defaultVersion) => {
  data['storageVersion'] = version;
  storage.save({ key, data, expires: null});
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = (key = '', version = defaultVersion) => {
  let response = null;
  storage.load({ key, autoSync: false, syncInBackground: false })
  .then(ret => {
    if (ret && ret.storageVersion === version) {
      response = data;
    } else if (ret) {
      removeLocal(key);
    }
    return response;
  }).catch(err => {});
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const removeLocal = (key = '') => storage.removeItem({ key });

/**
 * @desc get account local
 * @param  {String}   [address]
 * @return {Object}
 */
export const getAccountLocal = accountAddress => {
  return getLocal(accountAddress, accountLocalVersion);
};

/**
 * @desc get native prices
 * @return {Object}
 */
export const getNativePrices = () => {
  const nativePrices = getLocal('nativePrices', accountLocalVersion);
  return nativePrices ? nativePrices.data : null;
};

/**
 * @desc save native prices
 * @param  {String}   [address]
 */
export const saveNativePrices = nativePrices => {
  saveLocal('nativePrices', { data: nativePrices }, accountLocalVersion);
};

/**
 * @desc get native currency
 * @return {Object}
 */
export const getNativeCurrency = () => {
  const nativeCurrency = getLocal('nativeCurrency', globalSettingsVersion);
  return nativeCurrency ? nativeCurrency.data : null;
};

/**
 * @desc save native currency
 * @param  {String}   [currency]
 */
export const saveNativeCurrency = nativeCurrency => {
  saveLocal('nativeCurrency', { data: nativeCurrency }, globalSettingsVersion);
};

/**
 * @desc update local balances
 * @param  {String}   [address]
 * @param  {Object}   [account]
 * @param  {String}   [network]
 * @return {Void}
 */
export const updateLocalBalances = (address, account, network) => {
  if (!address) return;
  let accountLocal = getLocal(address) || {};
  if (!accountLocal[network]) {
    accountLocal[network] = {};
  }
  accountLocal[network].type = account.type;
  accountLocal[network].balances = {
    assets: account.assets,
    total: account.total || '———',
  };
  saveLocal(address, accountLocal, accountLocalVersion);
};

/**
 * @desc update local transactions
 * @param  {String}   [address]
 * @param  {Array}    [transactions]
 * @param  {String}   [network]
 * @return {Void}
 */
export const updateLocalTransactions = (address, transactions, network) => {
  if (!address) return;
  let accountLocal = getLocal(address) || {};
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
  saveLocal(address, accountLocal, accountLocalVersion);
};

/**
 * @desc get wallet connect account
 * @return {Object}
 */
export const getWalletConnectAccount = () => {
  const walletConnectAccount = getLocal('walletconnect', walletConnectVersion);
  return walletConnectAccount ? walletConnectAccount.data : null;
};

/**
 * @desc save wallet connect account
 * @param  {String}   [address]
 */
export const saveWalletConnectAccount = account => {
  saveLocal('walletconnect', { data: account }, walletConnectVersion);
};

/**
 * @desc get language
 * @return {Object}
 */
export const getLanguage = () => {
  const language = getLocal('language', globalSettingsVersion);
  return language ? language.data : null;
};

/**
 * @desc save language
 * @param  {String}   [language]
 */
export const saveLanguage = language => {
  saveLocal('language', { data: language }, globalSettingsVersion);
};
