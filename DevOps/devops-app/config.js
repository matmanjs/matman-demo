const path = require('path');
const _ = require('lodash');
const { DevOpsWebTest } = require('devops-web-test');

const {
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
} = require('./pipelines');

function createDWT() {
    const dwt = new DevOpsWebTest(__dirname);

    // 项目工作区间
    const workspacePath = path.join(__dirname, '../../');

    // 是否单元测试和端对端测试
    const { shouldRunUnitTest, shouldRunE2ETest } = getActionConfigByDWTMode(process.env.DWT_MODE);

    dwt.testRecord = {
        shouldRunUnitTest,
        shouldRunE2ETest,
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
            enableTest: shouldRunUnitTest,
            runTestPath: workspacePath,
            outputPath: path.join(dwt.outputPath, 'unit_test_report'),
            coverageOutputPath: path.join(dwt.outputPath, 'unit_test_report/coverage')
        },
        e2eTest: {
            enableTest: shouldRunE2ETest,
            runTestPath: workspacePath,
            outputPath: path.join(dwt.outputPath, 'e2e_test_report'),
            coverageOutputPath: path.join(dwt.outputPath, 'e2e_test_report/coverage')
        },
        whistle: {
            namespace: `dwt_${dwt.seqId}`
        },
        archive: {
            rootPath: dwt.outputPath
        }
    };

    return dwt;
}

async function start() {
    const dwt = createDWT();

    try {
        // 开始
        await handleBeforeRun(dwt);

        // 初始化项目
        await handleInitProject(dwt);

        if (dwt.testRecord.shouldRunUnitTest) {
            // 执行单元测试
            await handleRunUnitTest(dwt);
        }

        if (dwt.testRecord.shouldRunE2ETest) {
            // 构建项目
            await handleBuildProject(dwt);

            // 启动 mockstar
            await handleStartMockstar(dwt);

            // 启动 whistle
            await handleStartWhistle(dwt, {
                getWhistleRules: () => {
                    const whistleSetting = require(path.join(__dirname, '../whistle'));

                    return whistleSetting.getProdRules({
                        projectRootPath: dwt.testRecord.project.rootPath,
                        shouldUseMockstar: true,
                        mockstarPort: dwt.testRecord.mockstar.port,
                        name: dwt.testRecord.whistle.namespace
                    });
                }
            });

            // 安装和构建 matman
            await handleStartMatman(dwt);

            // 直接运行段对端测试命令
            await handleRunE2ETestDirect(dwt);
        }

        // 归档
        await handleArchive(dwt);

        // 结束
        await handleAfterRun(dwt);
    } catch (err) {
        console.error('run catch err', err);

        // 如果遇到异常情况，注意要清理被占用的资源，例如端口等
        await handleAfterRun(dwt);
    }

    return dwt;
}

module.exports = {
    createDWT,
    start
};