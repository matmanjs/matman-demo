import { CALL_API } from '../../middlewares/api';

export const TEST_REQUEST = 'TEST_REQUEST';
export const TEST_REQUEST_SUCCESS = 'TEST_REQUEST_SUCCESS';
export const TEST_REQUEST_FAIL = 'TEST_REQUEST_FAIL';

function fetchTestInfo() {
    return {
        [CALL_API]: {
            types: [TEST_REQUEST, TEST_REQUEST_SUCCESS, TEST_REQUEST_FAIL],
            url: `/testdata.json`
        }
    };
}

export function loadTestInfo(mockerName) {
    return (dispatch, getState) => {
        return dispatch(fetchTestInfo(mockerName));
    };
}
