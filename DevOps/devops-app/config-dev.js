const path = require('path');
const _ = require('lodash');

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
    handleAfterRun
} = require('./pipelines');

const { createDWT } = require('./config');

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
            await handleBuildProject(dwt, { isDevelopment: true });

            // 启动 mockstar
            await handleStartMockstar(dwt);

            // 启动 whistle
            await handleStartWhistle(dwt, {
                getWhistleRules: () => {
                    const whistleSetting = require(path.join(__dirname, '../whistle'));

                    return whistleSetting.getDevRules({
                        projectRootPath: dwt.testRecord.project.rootPath,
                        projectDevPort: dwt.testRecord.project.port,
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

/**
 * 准备自动化测试所依赖的环境
 *
 * @return {Promise<DevOpsWebTest>}
 */
async function bootstrap() {
    const dwt = createDWT();

    const mockstarPort = process.env.MOCKSTAR_PORT;
    const whistlePort = process.env.WHISTLE_PORT;

    try {
        // 初始化项目
        await handleInitProject(dwt);

        // 构建项目
        await handleBuildProject(dwt, { isDevelopment: true });

        // 启动 mockstar
        await handleStartMockstar(dwt, {
            port: mockstarPort,
            startCmd: function (port) {
                return `npx mockstar start -p ${port}`;
            }
        });

        // 启动 whistle
        await handleStartWhistle(dwt, {
            port: whistlePort,
            getWhistleRules: () => {
                const whistleSetting = require(path.join(__dirname, '../whistle'));

                return whistleSetting.getDevRules({
                    projectRootPath: dwt.testRecord.project.rootPath,
                    projectDevPort: dwt.testRecord.project.port,
                    shouldUseMockstar: true,
                    mockstarPort: dwt.testRecord.mockstar.port,
                    name: dwt.testRecord.whistle.namespace
                });
            }
        });

        // 安装和构建 matman
        await handleStartMatman(dwt);

    } catch (err) {
        console.error('run catch err', err);

        // 如果遇到异常情况，注意要清理被占用的资源，例如端口等
    }

    return dwt;
}

module.exports = {
    start,
    bootstrap
};