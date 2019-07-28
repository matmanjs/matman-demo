const { MockStarQuery } = require('mockstar');

const DEFAULT_MOCK = {
    // 查询余额
    'get_balance': 'success_16888',

    // 拉取认证状态
    'get_verify_status': 'success_all_ok',

    // 申请提现
    'withdraw_money': 'success'
};

function getMockStarQuery(queryMap) {
    return new MockStarQuery(Object.assign({}, DEFAULT_MOCK, queryMap));
}

function getBasic() {
    return getMockStarQuery(DEFAULT_MOCK);
}

module.exports = {
    getMockStarQuery: getMockStarQuery,
    getBasic: getBasic
};