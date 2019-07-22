import { combineReducers } from 'redux';

import { testInfo } from '../datas/data-test';
import { transactionInfo } from '../pages/transaction/data/now-data-transaction';

const rootReducer = combineReducers({
    testInfo,
    transactionInfo
});

export default rootReducer;
