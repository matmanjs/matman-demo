const { MockStarQuery } = require('mockstar');

const DEFAULT_MOCK = {
    // 身份证认证
    'get_top_room_info': 'success_female'
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

function getBasicFemale() {
    return getMockStarQuery(DEFAULT_MOCK);
}

function getBasicMale() {
    return getMockStarQuery({
        // 身份证认证
        'get_top_room_info': 'success_male'
    });
}

module.exports = {
    getMockStarQuery,
    getBasicFemale,
    getBasicMale
};