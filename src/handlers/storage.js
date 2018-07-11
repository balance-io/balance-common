const defaultVersion = '0.1.0';
const accountLocalVersion = '0.1.0';
const globalSettingsVersion = '0.1.0';
const walletConnectVersion = '0.1.0';

export default class Storage {
  constructor(storageBackend) {
    this.storage = storageBackend
  }

  /**
   * @desc save to storage
   * @param  {String}  [key='']
   * @param  {Object}  [data={}]
   * @param  {String} [version=defaultVersion]
   */
  saveLocal(key = '', data = {}, version = defaultVersion) {
    data['storageVersion'] = version;
    const jsonData = JSON.stringify(data);
    this.storage.setItem(key, jsonData);
  };

  /**
   * @desc get from storage
   * @param  {String}  [key='']
   * @return {Object}
   */
  getLocal(key = '', version = defaultVersion) {
    const data = this.storage.getItem(key) ? JSON.parse(this.storage.getItem(key)) : null;
    if (data && data['storageVersion'] === version) {
      return data;
    } else if (data) {
      removeLocal(key);
    }
    return null;
  };

  /**
   * @desc get from storage
   * @param  {String}  [key='']
   * @return {Object}
   */
  removeLocal(key = '') { this.storage.removeItem(key); }

  /**
   * @desc get account local
   * @param  {String}   [address]
   * @return {Object}
   */
  getAccountLocal(accountAddress) {
    return getLocal(accountAddress, accountLocalVersion);
  };

  /**
   * @desc get native prices
   * @return {Object}
   */
  getNativePrices() {
    const nativePrices = getLocal('native_prices', accountLocalVersion);
    return nativePrices ? nativePrices.data : null;
  };

  /**
   * @desc save native prices
   * @param  {String}   [address]
   */
  saveNativePrices(nativePrices) {
    saveLocal('native_prices', { data: nativePrices }, accountLocalVersion);
  };

  /**
   * @desc get native currency
   * @return {Object}
   */
  getNativeCurrency() {
    const nativeCurrency = getLocal('native_currency', globalSettingsVersion);
    return nativeCurrency ? nativeCurrency.data : null;
  };

  /**
   * @desc save native currency
   * @param  {String}   [currency]
   */
  saveNativeCurrency(nativeCurrency) {
    saveLocal('native_currency', { data: nativeCurrency }, globalSettingsVersion);
  };

  /**
   * @desc update local balances
   * @param  {String}   [address]
   * @param  {Object}   [account]
   * @param  {String}   [network]
   * @return {Void}
   */
  updateLocalBalances(address, account, network) {
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
  updateLocalTransactions(address, transactions, network) {
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
   * @desc get language
   * @return {Object}
   */
  getLanguage() {
    const language = getLocal('language', globalSettingsVersion);
    return language ? language.data : null;
  };

  /**
   * @desc save language
   * @param  {String}   [language]
   */
  saveLanguage(language) {
    saveLocal('language', { data: language }, globalSettingsVersion);
  };

}
