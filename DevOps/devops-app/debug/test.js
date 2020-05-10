const path = require('path');
const dwt = require('devops-web-test');

const {
    getPluginProject,
    getPluginUnitTest,
    getPluginMockstar,
    getPluginWhistle,
    getPluginE2ETest,
    getPluginArchive
} = require('../pipelines');

const dwtPath = path.join(__dirname, '../');

const { shouldRunUnitTest, shouldRunE2ETest } = ((dwtMode) => {
    let shouldRunUnitTest;
    let shouldRunE2ETest;

    const DWT_MODE = {
        UNIT: 'unit',
        E2E: 'e2e'
    };

    switch (dwtMode) {
        case DWT_MODE.UNIT:
            shouldRunUnitTest = true;
            shouldRunE2ETest = false;
            break;
        case DWT_MODE.E2E:
            shouldRunUnitTest = false;
            shouldRunE2ETest = true;
            break;
        default:
            shouldRunUnitTest = true;
            shouldRunE2ETest = true;
            break;
    }

    return {
        shouldRunUnitTest,
        shouldRunE2ETest
    };
})(process.env.DWT_MODE);

const config = {
    plugins: [
        // 业务项目
        getPluginProject(shouldRunE2ETest),

        // 单元测试
        getPluginUnitTest(shouldRunUnitTest),

        // 数据 mock
        getPluginMockstar(shouldRunE2ETest),

        // 代理配置
        getPluginWhistle(shouldRunE2ETest, {
            getWhistleRules: function (testRecord) {
                const whistleSetting = require(path.join(__dirname, '../../whistle'));

                return whistleSetting.getProdRules({
                    projectRootPath: testRecord.getPlugin('project').rootPath,
                    shouldUseMockstar: true,
                    mockstarPort: testRecord.getPlugin('mockstar').port,
                    name: testRecord.getPlugin('whistle')._processKey
                });
            }
        }),

        // 端对端测试
        getPluginE2ETest(shouldRunE2ETest),

        // 归档
        getPluginArchive()
    ]
};

dwt.start(dwtPath, config)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

