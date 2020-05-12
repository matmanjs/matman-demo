const path = require('path');
const { DevOpsWebTest } = require('devops-web-test');

async function generateMochaReporterConfigFile(dwt, outputPath) {
    const mochaReporterConfigFile = path.join(outputPath, 'mocha-multi-reporters-config.json');

    await dwt.saveJsonFile(mochaReporterConfigFile, {
        'reporterEnabled': 'mochawesome, mocha-junit-reporter',
        'mochaJunitReporterReporterOptions': {
            'mochaFile': `${outputPath}/test-result.xml`
        },
        'mochawesomeReporterOptions': {
            'reportDir': `${outputPath}`
        }
    });

    return mochaReporterConfigFile;
}

async function run() {
    const dwt = new DevOpsWebTest(__dirname);

    // 工作区间
    const workspacePath = path.join(__dirname, '../../');

    const shouldRunUnitTest = true;
    const shouldRunE2ETest = true;

    const testRecord = {
        project: {
            rootPath: workspacePath
        },
        mockstar: {
            rootPath: path.join(workspacePath, 'DevOps/mockstar-app')
        },
        matman: {
            rootPath: path.join(workspacePath, 'DevOps/matman-app')
        },
        unitTest: {
            runTestPath: workspacePath,
            outputPath: path.join(dwt.outputPath, 'unit_test_report'),
            coverageOutputPath: path.join(dwt.outputPath, 'unit_test_report/coverage')
        },
        e2eTest: {
            runTestPath: workspacePath,
            outputPath: path.join(dwt.outputPath, 'e2e_test_report'),
            coverageOutputPath: path.join(dwt.outputPath, 'e2e_test_report/coverage')
        },
        whistle: {
            namespace: `dwt_${dwt.seqId}`
        }
    };

    dwt.testRecord = testRecord;

    try {
        // 项目 install
        testRecord.project.installCmd = 'npm install';
        await dwt.runByExec(testRecord.project.installCmd, { cwd: testRecord.project.rootPath });

        // 需要安装自动化测试需要的 reporter 等组件的依赖
        await dwt.runByExec('npm install cross-env nyc mocha-multi-reporters mochawesome mocha-junit-reporter --no-save', { cwd: testRecord.project.rootPath });

        // 为单元测试配置生成 reporter 配置
        const unitTestReporterConfigFile = await generateMochaReporterConfigFile(dwt, testRecord.unitTest.outputPath);

        // 执行单元测试
        testRecord.unitTest.testCmd = `npx cross-env BABEL_ENV=test mocha test/unit --reporter mocha-multi-reporters --reporter-options configFile=${unitTestReporterConfigFile}`;
        await dwt.runByExec(testRecord.unitTest.testCmd, { cwd: testRecord.unitTest.runTestPath });

        // 执行单元测试覆盖率
        testRecord.unitTest.coverageCmd = [
            `npx nyc --silent ${testRecord.unitTest.testCmd}`,
            `npx nyc report --reporter=html --report-dir=${testRecord.unitTest.coverageOutputPath}`,
            `npx nyc report --reporter=cobertura --report-dir=${testRecord.unitTest.coverageOutputPath}`,
            `npx nyc report --reporter=lcovonly --report-dir=${testRecord.unitTest.coverageOutputPath}`
        ].join(' && ');
        await dwt.runByExec(testRecord.unitTest.coverageCmd, { cwd: testRecord.project.rootPath });

        // 构建项目
        testRecord.project.buildCmd = 'npx cross-env ENABLE_E2E_TEST=1 npm run build';
        await dwt.runByExec(testRecord.project.buildCmd, { cwd: testRecord.project.rootPath });

        // mockstar-app 安装依赖
        testRecord.mockstar.installCmd = 'npm install';
        await dwt.runByExec(testRecord.mockstar.installCmd, { cwd: testRecord.mockstar.rootPath });

        // 为 mockstar 获得一个没有被占用的端口
        const mockstarPort = await dwt.findAvailablePort('mockstar');
        testRecord.mockstar.port = mockstarPort;

        // mockstar-app 启动
        testRecord.mockstar.startCmd = `npx mockstar run -p ${mockstarPort}`;
        const mockstarStartCmd = await dwt.runByExec(testRecord.mockstar.startCmd, { cwd: testRecord.mockstar.rootPath }, (data) => {
            return data && data.indexOf(`127.0.0.1:${mockstarPort}`) > -1;
        });

        testRecord.mockstar.startPid = mockstarStartCmd.pid;

        // 为 mockstar 锁定这个已被占用的端口
        await dwt.lockPort('mockstar', mockstarPort, testRecord.mockstar.startPid);

        // 为 whistle 获得一个没有被占用的端口
        const whistlePort = await dwt.findAvailablePort('whistle');
        testRecord.whistle.port = whistlePort;

        // whistle 启动
        testRecord.whistle.startCmd = `w2 start -S ${testRecord.whistle.namespace} -p ${whistlePort}`;
        const whistleStartCmd = await dwt.runByExec(testRecord.whistle.startCmd, {}, (data) => {
            return data && data.indexOf(`127.0.0.1:${whistlePort}`) > -1;
        });

        testRecord.whistle.startPid = whistleStartCmd.pid;

        // 为 whistle 锁定这个已被占用的端口
        await dwt.lockPort('whistle', whistlePort, testRecord.whistle.startPid);

        // 检查 whistle 是否实际ok
        await dwt.checkIfWhistleIsStarted(whistlePort);

        // 产生 whistle 规则配置文件
        const whistleRulesConfigFile = path.join(dwt.outputPath, 'test.whistle.js');
        testRecord.whistle.whistleRulesConfigFile = whistleRulesConfigFile;

        await dwt.generateWhistleRulesConfigFile(whistleRulesConfigFile, () => {
            const whistleSetting = require(path.join(__dirname, '../whistle'));

            return whistleSetting.getProdRules({
                projectRootPath: testRecord.project.rootPath,
                shouldUseMockstar: true,
                mockstarPort: testRecord.mockstar.port,
                name: testRecord.whistle.namespace
            });
        });

        // 使用这个 whistle 规则文件
        testRecord.whistle.useCmd = `w2 use ${whistleRulesConfigFile} -S ${testRecord.whistle.namespace} --force`;
        await dwt.runByExec(testRecord.whistle.useCmd);

        // matman-app 安装依赖
        testRecord.matman.installCmd = `npm install`;
        await dwt.runByExec(testRecord.matman.installCmd, { cwd: testRecord.matman.rootPath });

        // matman-app 构建
        testRecord.matman.buildCmd = `npm run build`;
        await dwt.runByExec(testRecord.matman.buildCmd, { cwd: testRecord.matman.rootPath });

        // 为端对端测试配置生成 reporter 配置
        const e2eTestReporterConfigFile = await generateMochaReporterConfigFile(dwt, testRecord.e2eTest.outputPath);

        // 执行端对端测试
        testRecord.e2eTest.testCmd = `npx cross-env WHISTLE_PORT=${whistlePort} mocha test/e2e --reporter mocha-multi-reporters --reporter-options configFile=${e2eTestReporterConfigFile}`;
        await dwt.runByExec(testRecord.e2eTest.testCmd, { cwd: testRecord.e2eTest.runTestPath });

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