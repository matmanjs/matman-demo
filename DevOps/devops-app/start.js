const path = require('path');
const { DevOpsWebTest } = require('devops-web-test');

async function run() {
    const dwt = new DevOpsWebTest(__dirname);

    try {
        // 工作区间
        const workspacePath = path.join(__dirname, '../../');

        dwt.addCacheData({
            projectRootPath: workspacePath,
            mockstarAppRootPath: path.join(workspacePath, 'DevOps/mockstar-app'),
            matmanAppRootPath: path.join(workspacePath, 'DevOps/matman-app'),
            unitTest: {
                runTestPath: workspacePath,
                outputPath: path.join(dwt.outputPath, 'unit_test_report'),
                coverageOutputPath: path.join(dwt.outputPath, 'unit_test_report/coverage')
            }
        });

        // // 项目 install
        // await dwt.runByExec('npm install', { cwd: dwt.getCacheData().projectRootPath });
        //
        // // 执行单元测试之前需要安装一些额外的依赖
        // await dwt.runByExec('npm install mocha-multi-reporters mochawesome mocha-junit-reporter --no-save', { cwd: dwt.getCacheData().projectRootPath });
        //
        // // 单元测试需要一些配置文件
        // const unitTestOutputPath = dwt.getCacheData().unitTest.outputPath;
        // const unitTestReporterConfigFile = path.join(unitTestOutputPath, 'mocha-multi-reporters-config.json');
        // await dwt.saveJsonFile(unitTestReporterConfigFile, {
        //     'reporterEnabled': 'mochawesome, mocha-junit-reporter',
        //     'mochaJunitReporterReporterOptions': {
        //         'mochaFile': `${unitTestOutputPath}/test-result.xml`
        //     },
        //     'mochawesomeReporterOptions': {
        //         'reportDir': `${unitTestOutputPath}`
        //     }
        // });
        //
        // // 执行单元测试
        // await dwt.runByExec(`npx cross-env BABEL_ENV=test mocha test/unit --reporter mocha-multi-reporters --reporter-options configFile=${unitTestReporterConfigFile}`, { cwd: dwt.getCacheData().projectRootPath });
        //
        // // 项目构建
        // await dwt.runByExec('npx cross-env ENABLE_E2E_TEST=1 npm run build', { cwd: dwt.getCacheData().projectRootPath });
        //
        // // mockstar-app 安装依赖
        // await dwt.runByExec('npm install', { cwd: dwt.getCacheData().mockstarAppRootPath });

        // // 需要获得一个没有被占用的端口
        // const mockstarPort = await dwt.findAvailablePort('mockstar');
        //
        // dwt.addCacheData({
        //     mockstarPort
        // });
        //
        // // mockstar-app 启动
        // const mockstarStartCmd = await dwt.runByExec(`npx mockstar run -p ${mockstarPort}`, { cwd: dwt.getCacheData().mockstarAppRootPath }, (data) => {
        //     return data && data.indexOf(`127.0.0.1:${mockstarPort}`) > -1;
        // });
        //
        // // 锁定这个已被占用的端口
        // await dwt.lockPort('mockstar', mockstarPort, mockstarStartCmd.pid);

        // 需要获得一个没有被占用的端口
        const whistlePort = await dwt.findAvailablePort('whistle');

        dwt.addCacheData({
            whistlePort
        });

        // whistle 启动
        const whistleStartCmd = await dwt.runByExec(`w2 start -S ${dwt.seqId} -p ${whistlePort}`, {}, (data) => {
            return data && data.indexOf(`127.0.0.1:${whistlePort}`) > -1;
        });

        // 锁定这个已被占用的端口
        await dwt.lockPort('whistle', whistlePort, whistleStartCmd.pid);

        // 检查 whistle 是否实际ok
        await dwt.checkIfWhistleIsStarted(whistlePort);

        // 产生 whistle 规则配置文件
        const whistleRulesConfigFile = path.join(dwt.outputPath, 'test.whistle.js');
        await dwt.generateWhistleRulesConfigFile(whistleRulesConfigFile, () => {
            const whistleSetting = require(path.join(__dirname, '../whistle'));

            return whistleSetting.getProdRules({
                projectRootPath: dwt.getCacheData().projectRootPath,
                shouldUseMockstar: true,
                mockstarPort: dwt.getCacheData().mockstarPort,
                name: `whistle-e2etest-${dwt.seqId}`
            });
        });

        // 使用这个 whistle 规则文件
        await dwt.runByExec(`w2 use ${whistleRulesConfigFile} -S ${dwt.seqId} --force`);

    } catch (err) {
        console.error('run catch err', err);
    }

    return dwt;
}

run()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });