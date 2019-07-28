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
    const mockStarQuery = new MockStarQuery();

    const map = Object.assign({}, queryMap);

    const mockerNameList = Object.keys(map);

    mockerNameList.forEach((mockerName) => {
        mockStarQuery.addOne(mockerName, map[mockerName], false);
    });

    return mockStarQuery;
}

function getBasic() {
    return getMockStarQuery(DEFAULT_MOCK);
}

module.exports = {
    getMockStarQuery: getMockStarQuery,
    getBasic: getBasic
};