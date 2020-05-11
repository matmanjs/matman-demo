const path = require('path');
const _ = require('lodash');
const fse = require('fs-extra');

const {
    PluginProject,
    PluginMockstar,
    PluginWhistle,
    PluginUnitTest,
    PluginE2ETest,
    PluginArchive,
    PluginExit,
    util
} = require('devops-web-test');

/**
 * 业务项目
 *
 * @param shouldRunE2ETest
 * @param opts
 * @return {PluginProject}
 */
function getPluginProject(shouldRunE2ETest, opts) {
    return new PluginProject('project', _.merge({
        shouldSkip: !shouldRunE2ETest,
        rootPath: path.join(__dirname, '../../'),
        buildCmd: 'npx cross-env ENABLE_E2E_TEST=1 npm run build'
    }, opts));
}

/**
 * 单元测试
 *
 * @param shouldRunUnitTest
 * @param opts
 * @return {PluginUnitTest}
 */
function getPluginUnitTest(shouldRunUnitTest, opts) {
    return new PluginUnitTest('unitTest', _.merge({
        shouldSkip: !shouldRunUnitTest,
        runTestPath: path.join(__dirname, '../../'),
        testCmd: function (testRecord) {
            const relativePath = path.relative(this.runTestPath, this.outputPath);

            // 之所以要设置 BABEL_ENV=test，是指定测试时使用 .babelrc 文件中名为 test 的配置
            // 避免与 create-react-app 项目的配置冲突
            return `npx cross-env BABEL_ENV=test mocha test/unit --reporter mocha-multi-reporters --reporter-options configFile=${relativePath}/mocha-multi-reporters-config.json`;
        },
        testCompleteCheck: function (data) {
            // 这样可以保证在覆盖率生成之后强制结束
            return data && data.indexOf(`Report HTML saved to`) > -1;
        },
        onBeforeTest: async function (testRecord, runCmd) {
            // 安装 reporters 依赖
            await runCmd.runByExec('npm install mocha-multi-reporters mochawesome mocha-junit-reporter --no-save', { cwd: this.runTestPath });

            // 生成 mocha-multi-reporters 的 configFile
            fse.outputJsonSync(path.join(this.outputPath, 'mocha-multi-reporters-config.json'), {
                'reporterEnabled': 'mochawesome, mocha-junit-reporter',
                'mochaJunitReporterReporterOptions': {
                    'mochaFile': `${this.outputPath}/test-result.xml`
                },
                'mochawesomeReporterOptions': {
                    'reportDir': `${this.outputPath}`
                }
            });
        },
        coverageCmd: function (testRecord, testCmdToExecute) {
            const relativePath = path.relative(this.runTestPath, this.coverageOutputPath);

            const cmdArr = [
                `npx nyc --silent ${testCmdToExecute.replace(/^npx\s+/, ' ')}`,
                `npx nyc report --reporter=html --report-dir=${relativePath}`,
                `npx nyc report --reporter=cobertura --report-dir=${relativePath}`,
                `npx nyc report --reporter=lcovonly --report-dir=${relativePath}`
            ];

            return cmdArr.join(' && ');
        },
        coverageCompleteCheck: async function (testRecord) {
            return util.checkAndWaitFileAvailable(path.join(this.coverageOutputPath, 'index.html'));
        }
    }, opts));
}

/**
 * 数据 mock
 *
 * @param shouldRunE2ETest
 * @param opts
 * @return {PluginMockstar}
 */
function getPluginMockstar(shouldRunE2ETest, opts) {
    return new PluginMockstar('mockstar', _.merge({
        shouldSkip: !shouldRunE2ETest,
        rootPath: path.join(__dirname, '../mockstar-app')
    }, opts));
}

/**
 * 代理配置
 *
 * @param shouldRunE2ETest
 * @param opts
 * @return {PluginWhistle}
 */
function getPluginWhistle(shouldRunE2ETest, opts) {
    return new PluginWhistle('whistle', _.merge({
        shouldSkip: !shouldRunE2ETest
    }, opts));
}

/**
 * 端对端测试
 *
 * @param shouldRunE2ETest
 * @param opts
 * @return {PluginE2ETest}
 */
function getPluginE2ETest(shouldRunE2ETest, opts) {
    return new PluginE2ETest('e2eTest', _.merge({
        shouldSkip: !shouldRunE2ETest,
        runTestPath: path.join(__dirname, '../../'),
        matmanAppPath: path.join(__dirname, '../matman-app'),
        testCmd: function (testRecord) {
            const relativePath = path.relative(this.runTestPath, this.outputPath);

            const cmd = `mocha test/e2e --reporter mocha-multi-reporters --reporter-options configFile=${relativePath}/mocha-multi-reporters-config.json`;

            const whistlePort = testRecord.getPlugin('whistle').port || 0;

            return whistlePort ? `npx cross-env WHISTLE_PORT=${whistlePort} ${cmd}` : `npx ${cmd}`;
        },
        testCompleteCheck: function (data) {
            // 这样可以保证在覆盖率生成之后强制结束
            return data && data.indexOf(`Report HTML saved to`) > -1;
        },
        onBeforeTest: async function (testRecord, runCmd) {
            // 安装 reporters 依赖
            await runCmd.runByExec('npm install mocha-multi-reporters mochawesome mocha-junit-reporter --no-save', { cwd: this.runTestPath });

            // 生成 mocha-multi-reporters 的 configFile
            fse.outputJsonSync(path.join(this.outputPath, 'mocha-multi-reporters-config.json'), {
                'reporterEnabled': 'mochawesome, mocha-junit-reporter',
                'mochaJunitReporterReporterOptions': {
                    'mochaFile': `${this.outputPath}/test-result.xml`
                },
                'mochawesomeReporterOptions': {
                    'reportDir': `${this.outputPath}`
                }
            });
        }
    }, opts));
}

/**
 * 归档
 *
 * @param opts
 * @return {PluginArchive}
 */
function getPluginArchive(opts) {
    return new PluginArchive('archive', _.merge({
        getPlugins: function (testRecord) {
            return {
                pluginE2ETest: testRecord.getPlugin('e2eTest'),
                pluginUnitTest: testRecord.getPlugin('unitTest'),
                pluginWhistle: testRecord.getPlugin('whistle')
            };
        }
    }, opts));
}

/**
 * 强制关闭
 *
 * @param opts
 * @return {PluginArchive}
 */
function getPluginExit(opts) {
    return new PluginExit('exit', _.merge({}, opts));
}

/**
 * 根据运行模式确定一些行为
 *
 * @param {String} [dwtMode] 运行模式
 * @return {Object}
 */
function getActionConfigByDWTMode(dwtMode) {
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
}

module.exports = {
    getPluginProject,
    getPluginUnitTest,
    getPluginMockstar,
    getPluginWhistle,
    getPluginE2ETest,
    getPluginArchive,
    getPluginExit,
    getActionConfigByDWTMode
};