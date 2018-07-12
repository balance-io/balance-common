import { combineReducers } from 'redux';
import account from './_account';
import { accountUpdateAccountAddress } from './_account';

const reducers = combineReducers({
  account,
});

export { reducers, accountUpdateAccountAddress };
