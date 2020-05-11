const path = require('path');
const _ = require('lodash');

const {
    getPluginProject,
    getPluginUnitTest,
    getPluginMockstar,
    getPluginWhistle,
    getPluginE2ETest,
    getPluginArchive,
    getActionConfigByDWTMode
} = require('./pipelines');

/**
 * 获得自动化测试的配置
 *
 * @param {Object} [opts] 额外选项
 * @param {Boolean} [opts.shouldRunE2ETest] 是否执行端对端测试，默认值为 true
 * @param {Boolean} [opts.shouldRunUnitTest] 是否执行单元你测试，默认值为 true
 * @param {Function} [opts.getWhistleRules] 获得 whistle 的配置，接受两个参数 testRecord 和 opts<projectRootPath,shouldUseMockstar,mockstarPort,name>
 * @param {Object} [opts.customPluginParams] 插件的自定义配置，是一个 map ，key 值为 插件名字， value 为插件的自定义配置
 * @return {Object}
 */
function getTestConfig(opts = {}) {
    const { shouldRunUnitTest, shouldRunE2ETest } = getActionConfigByDWTMode(process.env.DWT_MODE);

    const config = {
        dwtPath: __dirname,
        plugins: [
            // 业务项目
            getPluginProject(shouldRunE2ETest, {
                usePort: true,
                buildCmd: function (testRecord, port) {
                    return port ? `npx cross-env PORT=${port} npm start` : 'npm start';
                },
                buildCompleteCheck: function (data) {
                    return data && data.indexOf('Compiled successfully') > -1;
                }
            }),

            // 单元测试
            getPluginUnitTest(shouldRunUnitTest),

            // 数据 mock
            getPluginMockstar(shouldRunE2ETest),

            // 代理配置
            getPluginWhistle(shouldRunE2ETest, {
                getWhistleRules: function (testRecord) {
                    const whistleSetting = require(path.join(__dirname, '../whistle'));

                    return whistleSetting.getDevRules({
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

    return _.merge(config, opts);
}

module.exports = {
    getTestConfig
};