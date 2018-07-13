import lang from '../languages';
import {
  add,
  multiply,
  convertAmountToBigNumber,
  convertAmountFromBigNumber,
  convertAmountToDisplay,
  convertAmountToDisplaySpecific,
  convertStringToNumber,
  convertAssetAmountToBigNumber,
} from '../helpers/bignumber';
import nativeCurrencies from '../references/native-currencies.json';

/**
 * @desc parse error code message
 * @param  {Error} error
 * @return {String}
 */

export const parseError = error => {
  if (error) {
    const msgEnd =
      error.message.indexOf('\n') !== -1
        ? error.message.indexOf('\n')
        : error.message.length;
    let message = error.message.slice(0, msgEnd);
    if (
      error.message.includes('MetaMask') ||
      error.message.includes('Returned error:')
    ) {
      message = message
        .replace('Error: ', '')
        .replace('MetaMask ', '')
        .replace('Returned error: ', '');
      message =
        message.slice(0, 1).toUpperCase() + message.slice(1).toLowerCase();

      console.error(new Error(message));
      return message;
    } else if (message.indexOf('0x6801') !== -1) {
      message = lang.t('notification.error.generic_error');
    }
    console.error(error);
    return message;
  }
  return lang.t('notification.error.generic_error');
};

/**
 * @desc parse prices object from api response
 * @param  {Object} [data=null]
 * @param  {Array} [assets=[]]
 * @param  {String} [native='USD']
 * @return {Object}
 */
export const parsePricesObject = (
  data = null,
  assets = [],
  nativeSelected = 'USD',
) => {
  let prices = { selected: nativeCurrencies[nativeSelected] };
  Object.keys(nativeCurrencies).forEach(nativeCurrency => {
    prices[nativeCurrency] = {};
    assets.forEach(asset => {
      let assetPrice = null;
      if (data.RAW[asset]) {
        assetPrice = {
          price: {
            amount: convertAmountToBigNumber(
              data.RAW[asset][nativeCurrency].PRICE,
            ),
            display: convertAmountToDisplaySpecific(
              convertAmountToBigNumber(data.RAW[asset][nativeCurrency].PRICE),
              prices,
              nativeCurrency,
            ),
          },
          change: {
            amount: convertAmountToBigNumber(
              data.RAW[asset][nativeCurrency].CHANGEPCT24HOUR,
            ),
            display: convertAmountToDisplay(
              convertAmountToBigNumber(
                data.RAW[asset][nativeCurrency].CHANGEPCT24HOUR,
              ),
            ),
          },
        };
      }
      if (asset !== 'WETH') {
        prices[nativeCurrency][asset] = assetPrice;
      }
      if (asset === 'ETH') {
        prices[nativeCurrency]['WETH'] = assetPrice;
      }
    });
  });
  return prices;
};

/**
 * @desc parse account assets
 * @param  {Object} [data=null]
 * @param  {String} [address=null]
 * @return {Object}
 */
export const parseAccountAssets = (data = null, address = '') => {
  try {
    let assets = [...data];
    assets = assets.map(assetData => {
      const name =
        assetData.contract.name !== assetData.contract.address
          ? assetData.contract.name
          : assetData.contract.symbol || 'Unknown Token';
      const asset = {
        name: name,
        symbol: assetData.contract.symbol || '———',
        address: assetData.contract.address || null,
        decimals: convertStringToNumber(assetData.contract.decimals),
      };
      const assetBalance = convertAssetAmountToBigNumber(
        assetData.balance,
        asset.decimals,
      );
      return {
        ...asset,
        balance: {
          amount: assetBalance,
          display: convertAmountToDisplay(assetBalance, null, {
            symbol: asset.symbol,
            decimals: asset.decimals,
          }),
        },
        native: null,
      };
    });

    assets = assets.filter(
      asset => !!Number(asset.balance.amount) || asset.symbol === 'ETH',
    );

    return {
      address: address,
      type: '',
      assets: assets,
      total: null,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * @desc parse account balances from native prices
 * @param  {Object} [account=null]
 * @param  {Object} [prices=null]
 * @param  {String} [network='']
 * @return {Object}
 */
export const parseAccountBalancesPrices = (
  account = null,
  nativePrices = null,
  network = '',
) => {
  let totalAmount = 0;
  let newAccount = {
    ...account,
  };
  let nativeSelected = nativePrices.selected.currency;
  if (account) {
    const newAssets = account.assets.map(asset => {
      if (
        !nativePrices ||
        (nativePrices && !nativePrices[nativeSelected][asset.symbol])
      )
        return asset;

      const balanceAmountUnit = convertAmountFromBigNumber(
        asset.balance.amount,
        asset.decimals,
      );
      const balancePriceUnit = convertAmountFromBigNumber(
        nativePrices[nativeSelected][asset.symbol].price.amount,
      );
      const balanceRaw = multiply(balanceAmountUnit, balancePriceUnit);
      const balanceAmount = convertAmountToBigNumber(balanceRaw);
      const balanceDisplay = convertAmountToDisplay(
        balanceAmount,
        nativePrices,
      );
      const assetPrice = nativePrices[nativeSelected][asset.symbol].price;
      return {
        ...asset,
        native: {
          selected: nativePrices.selected,
          balance: { amount: balanceAmount, display: balanceDisplay },
          price: assetPrice,
          change:
            asset.symbol === nativePrices.selected.currency
              ? { amount: '0', display: '———' }
              : nativePrices[nativeSelected][asset.symbol].change,
        },
      };
    });
    totalAmount = newAssets.reduce(
      (total, asset) =>
        add(total, asset.native ? asset.native.balance.amount : 0),
      0,
    );
    const totalDisplay = convertAmountToDisplay(totalAmount, nativePrices);
    const total = { amount: totalAmount, display: totalDisplay };
    newAccount = {
      ...newAccount,
      assets: newAssets,
      total: total,
    };
  }
  return newAccount;
};

/**
 * @desc parse unique tokens from opensea
 * @param  {Object}
 * @return {Array}
 */
export const parseAccountUniqueTokens = data => {
  if (!data.data.assets.length) return [];
  const uniqueTokens = data.data.assets.map(el => ({
    background: `#${el.background_color}`,
    name: el.name,
    imageUrl: el.image_url,
    id: el.token_id,
    lastPrice:
      el.last_sale &&
      Number(convertAmountFromBigNumber(el.last_sale.total_price)),
    contractAddress: el.asset_contract.address,
  }));
  return uniqueTokens;
};
