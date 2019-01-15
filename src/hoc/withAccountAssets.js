import { connect } from 'react-redux';
import { compose, withProps } from 'recompact';
import { sortAssetsByNativeAmount } from './assetSelectors';
//import { sortAssetsByNativeAmountSelector } from './assetSelectors';

const mapStateToProps = ({
  assets: {
    fetchingAssets,
    fetchingUniqueTokens,
    uniqueTokens,
  },
  settings: { nativeCurrency },
  prices: { prices },
}) => ({
  fetchingAssets,
  fetchingUniqueTokens,
  uniqueTokens,
});

// const sortAssets = ({ assets, nativeCurrency, prices }) => sortAssetsByNativeAmountSelector(assets, prices, nativeCurrency);
const sortAssets = ({ assets, nativeCurrency, prices }) => sortAssetsByNativeAmount(assets, prices, nativeCurrency);

export default Component => compose(
  connect(mapStateToProps),
  withProps(sortAssets),
)(Component);

