import { get } from 'lodash';
import Web3 from 'web3';
import { isValidAddress } from '../helpers/validators';
import { getDataString, removeHexPrefix } from '../helpers/utilities';
import {
  convertStringToNumber,
  convertNumberToString,
  convertAmountToBigNumber,
  convertAssetAmountFromBigNumber,
  convertHexToString,
  convertStringToHex,
  convertAmountToAssetAmount,
} from '../helpers/bignumber';
import ethUnits from '../references/ethereum-units.json';
import smartContractMethods from '../references/smartcontract-methods.json';

/**
 * @desc web3 http instance
 */
export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(`https://mainnet.infura.io/`),
);

/**
 * @desc set a different web3 provider
 * @param {String}
 */
export const web3SetHttpProvider = provider => {
  let providerObj = null;
  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  }
  if (!providerObj) {
    throw new Error(
      'function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint',
    );
  }
  return web3Instance.setProvider(providerObj);
};

/**
 * @desc convert to checksum address
 * @param  {String} address
 * @return {String}
 */
export const toChecksumAddress = address => {
  if (typeof address === 'undefined') return '';

  address = address.toLowerCase().replace('0x', '');
  const addressHash = web3Instance.utils.sha3(address).replace('0x', '');
  let checksumAddress = '0x';

  for (let i = 0; i < address.length; i++) {
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
};

/**
 * @desc convert from wei to ether
 * @param  {Number} wei
 * @return {BigNumber}
 */
export const fromWei = wei => web3Instance.utils.fromWei(wei);

/**
 * @desc convert from ether to wei
 * @param  {Number} ether
 * @return {BigNumber}
 */
export const toWei = ether => web3Instance.utils.toWei(ether);

/**
 * @desc hash string with sha3
 * @param  {String} string
 * @return {String}
 */
export const sha3 = string => web3Instance.utils.sha3(string);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  web3Instance.eth.getTransactionCount(address, 'pending');

/**
 * @desc get transaction by hash
 * @param   {String}  hash
 * @return  {Promise}
 */
export const getTransactionByHash = hash =>
  web3Instance.eth.getTransaction(hash);

/**
 * @desc get block by hash
 * @param   {String}  hash
 * @return  {Promise}
 */
export const getBlockByHash = hash => web3Instance.eth.getBlock(hash);

/**
 * @desc get account ether balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */
export const getAccountBalance = async address => {
  const wei = await web3Instance.eth.getBalance(address);
  const ether = fromWei(wei);
  const balance =
    convertStringToNumber(ether) !== 0 ? convertNumberToString(ether) : 0;
  return balance;
};

/**
 * @desc get account token balance
 * @param  {String} accountAddress
 * @param  {String} tokenAddress
 * @return {Array}
 */
export const getTokenBalanceOf = (accountAddress, tokenAddress) =>
  new Promise((resolve, reject) => {
    const balanceMethodHash = smartContractMethods.token_balance.hash;
    const dataString = getDataString(balanceMethodHash, [
      removeHexPrefix(accountAddress),
    ]);
    web3Instance.eth
      .call({ to: tokenAddress, data: dataString })
      .then(balanceHexResult => {
        const balance = convertHexToString(balanceHexResult);
        resolve(balance);
      })
      .catch(error => reject(error));
  });

/**
 * @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async ({
  from,
  to,
  data,
  value,
  gasPrice,
  gasLimit,
}) => {
  const _gasPrice = gasPrice || (await web3Instance.eth.getGasPrice());
  const estimateGasData = value === '0x00' ? { from, to, data } : { to, data };
  const _gasLimit =
    gasLimit || (await web3Instance.eth.estimateGas(estimateGasData));
  const nonce = await getTransactionCount(from);
  const tx = {
    data,
    from,
    gas: web3Instance.utils.toHex(_gasLimit),
    gasLimit: web3Instance.utils.toHex(_gasLimit),
    gasPrice: web3Instance.utils.toHex(_gasPrice),
    nonce: web3Instance.utils.toHex(nonce),
    to,
    value: web3Instance.utils.toHex(value),
  };
  return tx;
};

/**
 * @desc get safe transfer nft transaction
 * @param  {Object}  transaction { asset, from, to, gasPrice }
 * @return {Object}
 */
export const getTransferNftTransaction = transaction => {
  console.log('GET TRANSFER NFT', transaction);
  const transferMethodHash = smartContractMethods.nft_safe_transfer.hash;
  const recipient = removeHexPrefix(transaction.to);
  const from = removeHexPrefix(transaction.from);
  const tokenId = asset.id;
  const dataString = getDataString(transferMethodHash, [from, recipient, tokenId]);
  return {
    from: transaction.from,
    to: transaction.asset.address,
    data: dataString,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit,
  };
};

/**
 * @desc get transfer token transaction
 * @param  {Object}  transaction { asset, from, to, amount, gasPrice }
 * @return {Object}
 */
export const getTransferTokenTransaction = transaction => {
  const transferMethodHash = smartContractMethods.token_transfer.hash;
  const value = convertStringToHex(
    convertAmountToAssetAmount(transaction.amount, transaction.asset.decimals),
  );
  const recipient = removeHexPrefix(transaction.to);
  const dataString = getDataString(transferMethodHash, [recipient, value]);
  return {
    from: transaction.from,
    to: transaction.asset.address,
    data: dataString,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit,
  };
};

/**
 * @desc transform into signable transaction
 * @param {Object} transaction { asset, from, to, amount, gasPrice }
 * @return {Promise}
 */
export const createSignableTransaction = (transaction) =>
  new Promise((resolve, reject) => {
    transaction.value = transaction.amount;
    if (transaction.asset.symbol !== 'ETH') {
      const isNft = get(transaction, 'asset.nft', false);
      transaction = isNft ? getTransferNftTransaction(transaction) :
        getTransferTokenTransaction(transaction);
    }
    const from =
      transaction.from.substr(0, 2) === '0x'
        ? transaction.from
        : `0x${transaction.from}`;
    const to =
      transaction.to.substr(0, 2) === '0x'
        ? transaction.to
        : `0x${transaction.to}`;
    const value = transaction.value ? toWei(transaction.value) : '0x00';
    const data = transaction.data ? transaction.data : '0x';
    getTxDetails({
      from,
      to,
      data,
      value,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit,
    }).then(txDetails => resolve(txDetails))
    .catch(error => reject(error));
  });

/**
 * @desc estimate gas limit
 * @param {Object} [{selected, address, recipient, amount, gasPrice}]
 * @return {String}
 */
export const estimateGasLimit = async ({
  asset,
  address,
  recipient,
  amount,
}) => {
  console.log('ESTIMATING GAS LIMIT', asset);
  let gasLimit = ethUnits.basic_tx;
  if (asset.isNft) {
    const transferMethodHash = smartContractMethods.nft_safe_transfer.hash;
    const data = getDataString(transferMethodHash, [
      removeHexPrefix(address),
      removeHexPrefix(recipient),
      asset.id
    ]);
    const estimateGasData = { from: address, to: asset.address, data };
    gasLimit = await web3Instance.eth.estimateGas(estimateGasData);
    console.log('NFT gas limit', gasLimit);
  } else if (asset.symbol !== 'ETH') {
    let _amount =
      amount && Number(amount)
        ? convertAmountToBigNumber(amount)
        : asset.balance.amount * 0.1;
    let _recipient =
      recipient && isValidAddress(recipient)
        ? recipient
        : '0x737e583620f4ac1842d4e354789ca0c5e0651fbb';
    const transferMethodHash = smartContractMethods.token_transfer.hash;
    let value = convertAssetAmountFromBigNumber(_amount, asset.decimals);
    value = convertStringToHex(value);
    const data = getDataString(transferMethodHash, [
      removeHexPrefix(_recipient),
      value,
    ]);
    const estimateGasData = { from: address, to: asset.address, data, value: '0x0' };
    gasLimit = await web3Instance.eth.estimateGas(estimateGasData);
  }
  return gasLimit;
};
