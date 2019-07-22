import { TEST_REQUEST, TEST_REQUEST_FAIL, TEST_REQUEST_SUCCESS } from './action';

const initialState = {
    isLoaded: false,
    data: {}
};

export default function testInfo(state = initialState, action) {
    let { type, data } = action,
        update = {};

    switch (type) {
        case TEST_REQUEST:
            update = {
                isLoaded: false
            };
            break;
        case TEST_REQUEST_SUCCESS:
            update = {
                isLoaded: true,
                data: data
            };
            break;
        case TEST_REQUEST_FAIL:
            update = {
                isLoaded: true
            };
            break;

        default:
            break;
    }

    return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

