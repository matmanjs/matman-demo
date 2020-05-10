const path = require('path');
const _ = require('lodash');
const fse = require('fs-extra');

const {
    PluginProject,
    PluginMockstar,
    PluginWhistle,
    PluginUnitTest,
    PluginE2ETest,
    PluginArchive
} = require('devops-web-test');

/**
 * 业务项目
 *
 * @param shouldRunE2ETest
 * @param customPluginParams
 * @return {PluginProject}
 */
function getPluginProject(shouldRunE2ETest, customPluginParams) {
    return new PluginProject('project', _.merge({
        shouldSkip: !shouldRunE2ETest,

        // 注意要设置 FEFLOW_ENV=test，这样在构建时才能够生成端对端测试的覆盖率文件
        buildCmd: 'npx cross-env FEFLOW_ENV=test tnpm run build'
    }, customPluginParams['project']));
}

/**
 * 单元测试
 *
 * @param shouldRunUnitTest
 * @param customPluginParams
 * @return {PluginUnitTest}
 */
function getPluginUnitTest(shouldRunUnitTest, customPluginParams) {
    return new PluginUnitTest('unitTest', _.merge({
        shouldSkip: !shouldRunUnitTest,
        testCmd: function (testRecord) {
            const relativePath = path.relative(this.rootPath, this.outputPath);

            return `npx cross-env BABEL_ENV=test mocha --reporter mocha-multi-reporters --reporter-options configFile=${relativePath}/mocha-multi-reporters-config.json`;
        },
        testCompleteCheck: function (data) {
            // 这样可以保证在覆盖率生成之后强制结束
            return data && data.indexOf(`Report HTML saved to`) > -1;
        },
        onBeforeTest: async function (testRecord, runCmd) {
            // 安装 reporters 依赖
            await runCmd.runByExec('tnpm install mocha-multi-reporters mochawesome mocha-junit-reporter --no-save', { cwd: this.rootPath });

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
        coverageCmd: function (testCmd, testRecord) {
            const relativePath = path.relative(this.rootPath, this.coverageOutputPath);

            const cmdArr = [
                `npx nyc --silent ${testCmd.replace(/^npx\s+/, ' ')}`,
                `npx nyc report --reporter=html --report-dir=${relativePath}`,
                `npx nyc report --reporter=cobertura --report-dir=${relativePath}`,
                `npx nyc report --reporter=lcovonly --report-dir=${relativePath}`
            ];

            return cmdArr.join(' && ');
        },
        coverageCompleteCheck: async function (testRecord) {
            return new Promise(async (resolve, reject) => {
                let count = 0;
                const checkFile = path.join(this.coverageOutputPath, 'index.html');

                async function check() {
                    const isExist = await fse.pathExists(checkFile);

                    console.log(`check ${checkFile} result=${isExist} count=${count}`);

                    if (isExist) {
                        setTimeout(() => {
                            resolve();
                        }, 1000);
                    } else if (count > 10) {
                        reject(new Error(`Not exist ${checkFile}`));
                    } else {
                        count++;

                        setTimeout(async () => {
                            await check();
                        }, 500);
                    }
                }

                await check();
            });
        }
    }, customPluginParams['unitTest']));
}

/**
 * 数据 mock
 *
 * @param shouldRunE2ETest
 * @param customPluginParams
 * @return {PluginMockstar}
 */
function getPluginMockstar(shouldRunE2ETest, customPluginParams) {
    return new PluginMockstar('mockstar', _.merge({
        shouldSkip: !shouldRunE2ETest
    }, customPluginParams['mockstar']));
}

/**
 * 代理配置
 *
 * @param devopsAppBasePath
 * @param shouldRunE2ETest
 * @param customPluginParams
 * @return {PluginWhistle}
 */
function getPluginWhistle(devopsAppBasePath, shouldRunE2ETest, customPluginParams, opts) {
    return new PluginWhistle('whistle', _.merge({
        shouldSkip: !shouldRunE2ETest,
        getWhistleRules: function (testRecord) {
            if (typeof opts.getWhistleRules === 'function') {
                const whistleRules = opts.getWhistleRules(testRecord, {
                    projectRootPath: testRecord.getPlugin('project').rootPath,
                    shouldUseMockstar: true,
                    mockstarPort: testRecord.getPlugin('mockstar').port,
                    name: testRecord.getPlugin('whistle')._processKey
                });

                let ruleContent = whistleRules.rules;

                // 在 devnet 机器中，需要额外配置一个 pac 文件，否则无法直接访问外网
                // 在蓝盾中运行的 linux 机器基本都是 devnet 网络
                //   https_proxy: 'http://devnet-proxy.oa.com:8080',
                //   http_proxy: 'http://devnet-proxy.oa.com:8080',
                const checkDevnetTag = process.env.http_proxy || process.env.https_proxy || '';
                if (checkDevnetTag.indexOf('devnet-proxy.oa.com') > -1) {
                    console.log('当前在 devnet 网络，自动追加额外的 devnet.pac 配置！');

                    const devnetPacSrc = path.join(__dirname, '../../pac/devnet.pac');
                    const devnetPacDest = path.join(testRecord.outputPath, './pac/devnet.pac');

                    console.log(`copy ${devnetPacSrc} to ${devnetPacDest}`);

                    // 复制到产出物目录
                    try {
                        fse.copySync(devnetPacSrc, devnetPacDest);
                        console.log('copy devnet.pac success!');
                    } catch (err) {
                        console.error(err);
                    }

                    const devnetPacRule = `* pac://${devnetPacDest}`;
                    console.log('Should add another rules!', devnetPacRule);

                    ruleContent = `${ruleContent}\n\n${devnetPacRule}`;
                }

                // 更新
                whistleRules.rules = ruleContent;

                return whistleRules;
            } else {
                return {
                    name: `unknown-whistle-rules-${Date.now()}`,
                    rules: `#也许你应该设置一下whistle配置：${devopsAppBasePath}`
                };
            }
        }
    }, customPluginParams['whistle']));
}

/**
 * 端对端测试
 *
 * @param shouldRunE2ETest
 * @param customPluginParams
 * @return {PluginE2ETest}
 */
function getPluginE2ETest(shouldRunE2ETest, customPluginParams) {
    return new PluginE2ETest('e2eTest', _.merge({
        shouldSkip: !shouldRunE2ETest,
        enableTest: shouldRunE2ETest,
        getWhistlePort: function (testRecord) {
            return testRecord.getPlugin('whistle').port || 0;
        },
        testCmd: function (testRecord) {
            const relativePath = path.relative(this.rootPath, this.outputPath);

            const cmd = `mocha --reporter mocha-multi-reporters --reporter-options configFile=${relativePath}/mocha-multi-reporters-config.json`;

            const whistlePort = this.getWhistlePort(testRecord);

            return whistlePort ? `npx cross-env WHISTLE_PORT=${whistlePort} ${cmd}` : `npx ${cmd}`;
        },
        testCompleteCheck: function (data) {
            // 这样可以保证在覆盖率生成之后强制结束
            return data && data.indexOf(`Report HTML saved to`) > -1;
        },
        onBeforeTest: async function (testRecord, runCmd) {
            // 安装 reporters 依赖
            await runCmd.runByExec('tnpm install mocha-multi-reporters mochawesome mocha-junit-reporter --no-save', { cwd: this.rootPath });

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
    }, customPluginParams['e2eTest']));
}

/**
 * 归档
 *
 * @param customPluginParams
 * @return {PluginArchive}
 */
function getPluginArchive(customPluginParams) {
    return new PluginArchive('archive', _.merge({
        getPlugins: function (testRecord) {
            return {
                pluginE2ETest: testRecord.getPlugin('e2eTest'),
                pluginUnitTest: testRecord.getPlugin('unitTest'),
                pluginWhistle: testRecord.getPlugin('whistle')
            };
        }
    }, customPluginParams['archive']));
}

/**
 * 获得自动化测试的配置
 *
 * @param {String} devopsAppBasePath devops-app 的根目录
 * @param {Object} [opts] 额外选项
 * @param {Boolean} [opts.shouldRunE2ETest] 是否执行端对端测试，默认值为 true
 * @param {Boolean} [opts.shouldRunUnitTest] 是否执行单元你测试，默认值为 true
 * @param {Function} [opts.getWhistleRules] 获得 whistle 的配置，接受两个参数 testRecord 和 opts<projectRootPath,shouldUseMockstar,mockstarPort,name>
 * @param {Object} [opts.customPluginParams] 插件的自定义配置，是一个 map ，key 值为 插件名字， value 为插件的自定义配置
 * @return {Object}
 */
function getTestConfig(devopsAppBasePath, opts = {}) {
    const { shouldRunUnitTest = true, shouldRunE2ETest = true, customPluginParams = {} } = opts;

    const common = {
        basePath: devopsAppBasePath,
        shouldRunE2ETest,
        shouldRunUnitTest,
        plugins: [
            // 业务项目
            getPluginProject(shouldRunE2ETest, customPluginParams),

            // 单元测试
            getPluginUnitTest(shouldRunUnitTest, customPluginParams),

            // 数据 mock
            getPluginMockstar(shouldRunE2ETest, customPluginParams),

            // 代理配置
            getPluginWhistle(devopsAppBasePath, shouldRunE2ETest, customPluginParams, opts),

            // 端对端测试
            getPluginE2ETest(shouldRunE2ETest, customPluginParams),

            // 归档
            getPluginArchive(customPluginParams)
        ]
    };

    return Object.assign(common, opts);
}

module.exports = {
    getPluginProject,
    getPluginUnitTest,
    getPluginMockstar,
    getPluginWhistle,
    getPluginE2ETest,
    getPluginArchive,
    getTestConfig
};