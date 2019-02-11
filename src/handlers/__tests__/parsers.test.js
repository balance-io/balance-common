import '@babel/polyfill';
import { mockPriceResponse } from './parsersMockData';
import { parsePricesObject } from '../parsers'
import nativeCurrencies from '../../references/native-currencies.json';

test('parsePricesObject', () => {
  const assets = ['ETH', 'WETH', 'WBTC', 'DAI'];
  const results = parsePricesObject(mockPriceResponse, assets);
  const priceChangeProperties = ['price', 'change'];
  const amountDisplayProperties = ['amount', 'display'];
  Object.keys(nativeCurrencies).forEach(nativeCurrency =>
    assets.forEach(asset =>
      priceChangeProperties.forEach(priceChange =>
        amountDisplayProperties.forEach(amountDisplay =>
          expect(results).toHaveProperty(`${nativeCurrency}.${asset}.${priceChange}.${amountDisplay}`)
        )
      )
    )
  );
});
