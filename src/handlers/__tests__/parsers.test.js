import '@babel/polyfill';

import {
  mockERC20,
  mockNonTokenTransfer,
  mockNonTokenTransferKDO,
  mockPriceResponse,
  mockTransaction
} from './parsersMockData';
import { parsePricesObject, parseTransaction } from '../parsers'
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

test('parseTransactionWhenTransfersReversed', () => {
	const address = "0x203526aff6de28820e5eac5d5137f08d0395f3ca";
  const result = parseTransaction([], mockTransaction, address);
  expect(result).toHaveLength(2);
  expect(result[0].to).toBe(address);
  expect(result[1].from).toBe(address);
});

test('parseTransactionWhenNonTokenTransfer', () => {
	const address = "0x203526aff6de28820e5eac5d5137f08d0395f3ca";
  const result = parseTransaction([], mockNonTokenTransfer, address);
  expect(result).toHaveLength(1);
  expect(result[0].value.amount).toBe('1000000000000000000');
  expect(result[0].value.display).toBe('1.00 BAL');
});

test('parseTransactionWhenNonTokenTransferWithValue', () => {
	const address = "0x1492004547FF0eFd778CC2c14E794B26B4701105";
  const result = parseTransaction([], mockNonTokenTransferKDO, address);
  expect(result).toHaveLength(1);
  expect(result[0].value.amount).toBe('0');
});

test('parseTransactionWithMultipleTransfers', () => {
	const address = "0x1492004547FF0eFd778CC2c14E794B26B4701105";
  const result = parseTransaction([], mockERC20, address);
  expect(result).toHaveLength(1);
});
