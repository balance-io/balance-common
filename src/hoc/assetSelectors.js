import { groupBy, isEmpty, isNil, map, toNumber } from 'lodash';
//import { createSelector } from 'reselect';
import {
  add,
  convertAmountFromBigNumber,
  convertAmountToBigNumber,
  convertAmountToUnformattedDisplay,
  multiply,
  simpleConvertAmountToDisplay,
} from '../helpers/bignumber';
import { sortList } from '../helpers';

const EMPTY_ARRAY = [];

/*
export const sortAssetsByNativeAmountSelector = createSelector(
  [ parseAssetsNativeSelector ],
  sortAssetsByNativeAmount
);

const assetsSelector = state => state.assets.assets;
const nativeCurrencySelector = state => state.settings.nativeCurrency;
const nativePricesSelector = state => state.prices.prices;

const parseAssetsNativeSelector = createSelector(
  [ assetsSelector, nativeCurrencySelector, nativePricesSelector ],
  parseAssetsNative
);
*/

export const sortAssetsByNativeAmount = (originalAssets, prices, nativeCurrency) => {
  console.log('SORT ASSETS BY NATIVE AMOUNT', originalAssets);
  console.log('prices', prices);
  let assetsNativePrices = originalAssets;
  let total = null;
  if (!isEmpty(originalAssets) && !isEmpty(prices)) {
    console.log('parse assets native');
    const parsedAssets = parseAssetsNative(originalAssets, nativeCurrency, prices);
    assetsNativePrices = parsedAssets.assetsNativePrices;
    total = parsedAssets.total;
  }
  console.log('assetsNativePrices', assetsNativePrices);
  const {
    hasValue = EMPTY_ARRAY,
    noValue = EMPTY_ARRAY,
  } = groupAssetsByMarketValue(assetsNativePrices);
  console.log('has value', hasValue);
  console.log('no value', noValue);

  const sortedAssets = sortList(hasValue, 'native.balance.amount', 'desc', 0, toNumber);
  const sortedShitcoins = sortList(noValue, 'name', 'asc');
  const allAssets = sortedAssets.concat(sortedShitcoins);

  return {
    allAssets,
    allAssetsCount: allAssets.length,
    assets: sortedAssets,
    assetsCount: sortedAssets.length,
    assetsTotal: total,
    shitcoins: sortedShitcoins,
    shitcoinsCount: sortedShitcoins.length,
  };
};

const groupAssetsByMarketValue = assets => groupBy(assets, ({ native }) => (
  isNil(native) ? 'noValue' : 'hasValue'
));

const parseAssetsNative = (
  assets,
  nativeCurrency,
  nativePrices,
) => {
  const nativePricesForNativeCurrency = nativePrices[nativeCurrency];
  let assetsNative = assets;
  assetsNative = map(assets, asset => {
    const assetNativePrice = nativePricesForNativeCurrency[asset.symbol];
    if (isNil(assetNativePrice)) {
      console.log('nil asset price');
      return asset;
    }

    const balanceAmountUnit = convertAmountFromBigNumber(
      asset.balance.amount,
      asset.decimals,
    );
    const balancePriceUnit = convertAmountFromBigNumber(
      assetNativePrice.price.amount,
    );
    const balanceRaw = multiply(balanceAmountUnit, balancePriceUnit);
    const balanceAmount = convertAmountToBigNumber(balanceRaw);
    let trackingAmount = balanceAmount;
    if (nativeCurrency !== 'USD') {
      const trackingPriceUnit = convertAmountFromBigNumber(
        nativePrices['USD'][asset.symbol].price.amount,
      );
      const trackingRaw = multiply(balanceAmountUnit, trackingPriceUnit);
      trackingAmount = convertAmountToBigNumber(trackingRaw);
    }
    const balanceDisplay = simpleConvertAmountToDisplay(
      balanceAmount,
      nativeCurrency,
    );
    const assetPrice = assetNativePrice.price;
    return {
      ...asset,
      trackingAmount,
      native: {
        balance: { amount: balanceAmount, display: balanceDisplay },
        price: assetPrice,
        change:
          asset.symbol === nativeCurrency
            ? { amount: '0', display: '———' }
            : assetNativePrice.change,
      },
    };
  });
  console.log('collecting total', assetsNative);
  let totalAmount = assetsNative.reduce(
    (total, asset) =>
    add(total, asset.native ? asset.native.balance.amount : 0),
    0,
  );
  const totalUSDAmount = (nativeCurrency === 'USD') ? totalAmount :
    assetsNative.reduce((total, asset) => add(total, asset.native ? asset.trackingAmount : 0), 0);
  const totalDisplay = simpleConvertAmountToDisplay(totalAmount, nativeCurrency);
  const totalTrackingAmount = convertAmountToUnformattedDisplay(totalUSDAmount, 'USD');
  const total = { amount: totalAmount, display: totalDisplay, totalTrackingAmount };
  return { assetsNativePrices: assetsNative, total };
};
