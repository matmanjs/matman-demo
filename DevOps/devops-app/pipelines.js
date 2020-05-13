const path = require('path');
const { DevOpsWebTest, util } = require('devops-web-test');

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

async function handleBeforeRun(dwt) {
    const { testRecord } = dwt;

    await dwt.clean();
}

async function handleInitProject(dwt) {
    const { testRecord } = dwt;

    // 项目 install
    testRecord.project.installCmd = 'npm install';
    await dwt.runByExec(testRecord.project.installCmd, { cwd: testRecord.project.rootPath });

    // 需要安装自动化测试需要的 reporter 等组件的依赖
    testRecord.project.extraPackagesInstallCmd = 'npm install cross-env nyc mocha-multi-reporters mochawesome mocha-junit-reporter --no-save';
    await dwt.runByExec(testRecord.project.extraPackagesInstallCmd, { cwd: testRecord.project.rootPath });
}

async function handleRunUnitTest(dwt) {
    const { testRecord } = dwt;

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
}

async function handleBuildProject(dwt, opts = {}) {
    const { testRecord } = dwt;

    if (opts.isDevelopment) {
        // 为项目获得一个没有被占用的端口
        const projectPort = await dwt.findAvailablePort('project');
        testRecord.project.port = projectPort;

        // 启动构建，由于是监听端口的，因此需要自定义结束
        testRecord.project.buildCmd = `npx cross-env ENABLE_E2E_TEST=1 PORT=${projectPort} npm start`;
        const projectBuildCmd = await dwt.runByExec(testRecord.project.buildCmd, { cwd: testRecord.project.rootPath }, (data) => {
            return data && data.indexOf('Compiled successfully') > -1;
        });

        testRecord.project.buildPid = projectBuildCmd.pid;

        // 为项目锁定这个已被占用的端口
        await dwt.lockPort('project', projectPort, testRecord.project.buildPid);

    } else {
        // 启动构建
        testRecord.project.buildCmd = 'npx cross-env ENABLE_E2E_TEST=1 npm run build';
        await dwt.runByExec(testRecord.project.buildCmd, { cwd: testRecord.project.rootPath });
    }
}

async function handleStartMockstar(dwt, opts = {}) {
    const { testRecord } = dwt;

    // mockstar-app 安装依赖
    testRecord.mockstar.installCmd = 'npm install';
    await dwt.runByExec(testRecord.mockstar.installCmd, { cwd: testRecord.mockstar.rootPath });

    if (opts.port) {
        // 如果传入了指定端口，则先杀掉这个端口
        await util.killPort(opts.port);

        // 直接使用指定的端口
        testRecord.mockstar.port = opts.port;
    } else {
        // 为 mockstar 获得一个没有被占用的端口
        testRecord.mockstar.port = await dwt.findAvailablePort('mockstar');
    }

    // mockstar-app 启动
    if (opts.startCmd && opts.startCmd === 'string') {
        testRecord.mockstar.startCmd = opts.startCmd;
    } else if (opts.startCmd && opts.startCmd === 'function') {
        testRecord.mockstar.startCmd = opts.startCmd(testRecord.mockstar.port);
    } else {
        testRecord.mockstar.startCmd = `npx mockstar run -p ${testRecord.mockstar.port}`;
    }

    const mockstarStartCmd = await dwt.runByExec(testRecord.mockstar.startCmd, { cwd: testRecord.mockstar.rootPath }, (data) => {
        return data && data.indexOf(`127.0.0.1:${testRecord.mockstar.port}`) > -1;
    });

    testRecord.mockstar.startPid = mockstarStartCmd.pid;

    // 为 mockstar 锁定这个已被占用的端口
    await dwt.lockPort('mockstar', testRecord.mockstar.port, testRecord.mockstar.startPid);
}

async function handleStartWhistle(dwt, opts = {}) {
    const { testRecord } = dwt;

    if (opts.port) {
        // 如果传入了指定端口，则先杀掉这个端口
        await util.killPort(opts.port);

        // 停止 whistle
        await dwt.runByExec('w2 stop');

        // 直接使用指定的端口
        testRecord.whistle.port = opts.port;
    } else {
        // 为 whistle 获得一个没有被占用的端口
        testRecord.whistle.port = await dwt.findAvailablePort('whistle');
    }

    // whistle 启动
    testRecord.whistle.startCmd = `w2 start -S ${testRecord.whistle.namespace} -p ${testRecord.whistle.port}`;
    const whistleStartCmd = await dwt.runByExec(testRecord.whistle.startCmd, {}, (data) => {
        return data && data.indexOf(`127.0.0.1:${testRecord.whistle.port}`) > -1;
    });

    testRecord.whistle.startPid = whistleStartCmd.pid;

    // 为 whistle 锁定这个已被占用的端口
    await dwt.lockPort('whistle', testRecord.whistle.port, testRecord.whistle.startPid);

    // 检查 whistle 是否实际ok
    await dwt.checkIfWhistleIsStarted(testRecord.whistle.port);

    // whistle 规则配置文件存储的路径
    const whistleRulesConfigFile = path.join(dwt.outputPath, 'test.whistle.js');
    testRecord.whistle.whistleRulesConfigFile = whistleRulesConfigFile;

    // 产生 whistle 规则配置文件
    await dwt.generateWhistleRulesConfigFile(whistleRulesConfigFile, opts.getWhistleRules);

    // 使用这个 whistle 规则文件
    testRecord.whistle.useCmd = `w2 use ${whistleRulesConfigFile} -S ${testRecord.whistle.namespace} --force`;
    await dwt.runByExec(testRecord.whistle.useCmd);
}

async function handleStartMatman(dwt) {
    const { testRecord } = dwt;

    // matman-app 安装依赖
    testRecord.matman.installCmd = `npm install`;
    await dwt.runByExec(testRecord.matman.installCmd, { cwd: testRecord.matman.rootPath });

    // matman-app 构建
    testRecord.matman.buildCmd = `npm run build`;
    await dwt.runByExec(testRecord.matman.buildCmd, { cwd: testRecord.matman.rootPath });
}

async function handleRunE2ETestDirect(dwt) {
    const { testRecord } = dwt;

    // 为端对端测试配置生成 reporter 配置
    const e2eTestReporterConfigFile = await generateMochaReporterConfigFile(dwt, testRecord.e2eTest.outputPath);

    // 执行端对端测试
    testRecord.e2eTest.testCmd = `npx cross-env WHISTLE_PORT=${testRecord.whistle.port} mocha test/e2e --reporter mocha-multi-reporters --reporter-options configFile=${e2eTestReporterConfigFile}`;
    await dwt.runByExec(testRecord.e2eTest.testCmd, { cwd: testRecord.e2eTest.runTestPath });

    // 生成端对端测试覆盖率
    testRecord.e2eTest.generatedE2ECoverageDir = path.join(testRecord.matman.rootPath, 'build/coverage');
    await dwt.createE2ECoverage(path.join(testRecord.matman.rootPath, 'build/coverage_output/**/*.json'), testRecord.e2eTest.generatedE2ECoverageDir);
}

async function handleArchive(dwt) {
    const { testRecord } = dwt;

    if (testRecord.e2eTest.enableTest) {
        // 将端对端测试的一些文件复制到测试归档目录中
        await dwt.copyMatmanBuildOutputToArchive({
            srcPath: path.join(testRecord.matman.rootPath, 'build'),
            distPath: path.join(dwt.outputPath, 'e2e_test_build_output'),
            generatedE2ECoverageDir: testRecord.e2eTest.generatedE2ECoverageDir,
            coverageOutputPath: testRecord.e2eTest.coverageOutputPath
        });
    }

    // 获得单元测试报告数据
    const unitTestReport = dwt.getTestReport('单元测试', {
        enableTest: testRecord.unitTest.enableTest,
        mochawesomeFilePath: path.join(testRecord.unitTest.outputPath, 'mochawesome.json'),
        coverageHtmlPath: path.join(testRecord.unitTest.coverageOutputPath, `index.html`)
    });
    testRecord.unitTest.report = unitTestReport;

    // 获得端对端测试报告数据
    const e2eTestReport = dwt.getTestReport('端对端测试', {
        enableTest: testRecord.e2eTest.enableTest,
        mochawesomeFilePath: path.join(testRecord.e2eTest.outputPath, 'mochawesome.json'),
        coverageHtmlPath: path.join(testRecord.e2eTest.coverageOutputPath, `index.html`)
    });
    testRecord.e2eTest.report = e2eTestReport;

    const indexData = {
        totalCost: `${dwt.getTotalCost() / 1000} 秒`,
        unitTest: {
            msg: testRecord.unitTest.report.testResult.summary
        },
        e2eTest: {
            msg: testRecord.e2eTest.report.testResult.summary
        },
        moreLinks: [{
            url: `output.zip`,
            msg: 'output.zip'
        }, {
            url: `test-record.json`,
            msg: 'test-record.json'
        }]
    };

    // 单元测试
    if (testRecord.unitTest.enableTest) {
        if (testRecord.unitTest.report.isTestSuccess) {
            indexData.unitTest.testOutputUrl = `${path.relative(dwt.outputPath, testRecord.unitTest.outputPath)}/mochawesome.html`;
        }

        if (testRecord.unitTest.report.isCoverageSuccess) {
            indexData.unitTest.coverageOutputUrl = `${path.relative(dwt.outputPath, testRecord.unitTest.coverageOutputPath)}/index.html`;
            indexData.unitTest.coverageMsg = testRecord.unitTest.report.coverageResult.htmlResult;
        }
    }

    // 端对端测试
    if (testRecord.e2eTest.enableTest) {
        if (testRecord.e2eTest.report.isTestSuccess) {
            indexData.e2eTest.testOutputUrl = `${path.relative(dwt.outputPath, testRecord.e2eTest.outputPath)}/mochawesome.html`;
        }

        if (testRecord.e2eTest.report.isCoverageSuccess) {
            indexData.e2eTest.coverageOutputUrl = `${path.relative(dwt.outputPath, testRecord.e2eTest.coverageOutputPath)}/index.html`;
            indexData.e2eTest.coverageMsg = testRecord.e2eTest.report.coverageResult.htmlResult;
        }

        indexData.moreLinks.push({
            url: path.basename(testRecord.whistle.whistleRulesConfigFile),
            msg: path.basename(testRecord.whistle.whistleRulesConfigFile)
        });
    }

    console.log(indexData);

    // 产生自定义报告
    await dwt.saveOutputIndexHtml(indexData, testRecord.archive.rootPath);

    // 存储一下测试过程的缓存数据
    await dwt.saveJsonFile(path.join(testRecord.archive.rootPath, 'test-record.json'), testRecord);

    // 压缩打包产物
    await dwt.compressDir(testRecord.archive.rootPath, path.join(testRecord.archive.rootPath, 'output.zip'));
}

async function handleAfterRun(dwt) {
    const { testRecord } = dwt;

    await dwt.clean({ doNotRemoveOutput: true });
}

module.exports = {
    handleBeforeRun,
    handleInitProject,
    handleRunUnitTest,
    handleBuildProject,
    handleStartMockstar,
    handleStartWhistle,
    handleStartMatman,
    handleRunE2ETestDirect,
    handleArchive,
    handleAfterRun,
    getActionConfigByDWTMode
};
