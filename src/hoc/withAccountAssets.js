import { connect } from 'react-redux';
import { compose, withProps } from 'recompact';
import { sortAssetsByNativeAmountSelector } from './assetSelectors';

const mapStateToProps = ({
  assets: {
    fetchingAssets,
    fetchingUniqueTokens,
    uniqueTokens,
  },
}) => ({
  fetchingAssets,
  fetchingUniqueTokens,
  uniqueTokens,
});

const sortAssets = (state) => sortAssetsByNativeAmountSelector(state);

export default Component => compose(
  connect(mapStateToProps),
  withProps(sortAssets),
)(Component);
