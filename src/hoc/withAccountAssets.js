import { connect } from 'react-redux';
import { compose, withProps } from 'recompact';
import { sortAssetsByNativeAmountSelector } from './assetSelectors';

const mapStateToProps = ({
  assets: {
    assets,
    fetchingAssets,
    fetchingUniqueTokens,
    uniqueTokens,
  },
  settings: { nativeCurrency },
  prices: { prices },
}) => ({
  assets,
  fetchingAssets,
  fetchingUniqueTokens,
  nativeCurrency,
  prices,
  uniqueTokens,
});

const sortAssets = (state) => sortAssetsByNativeAmountSelector(state);

export default Component => compose(
  connect(mapStateToProps),
  withProps(sortAssets),
)(Component);
