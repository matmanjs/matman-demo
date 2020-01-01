const { MockStarQuery } = require('mockstar');

const DEFAULT_MOCK = {
    // 获取流水记录
    'get_flow': 'success_basic'
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

function getBasicFlow() {
    return getMockStarQuery(DEFAULT_MOCK);
}

function getEmptyFlow() {
    return getMockStarQuery({
        'get_flow': 'success_empty'
    });
}

module.exports = {
    getMockStarQuery,
    getBasicFlow,
    getEmptyFlow
};
