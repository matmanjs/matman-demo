const path = require('path');
const { E2ERunner } = require('matman-e2e-test');
const whistle = require('../DevOps/whistle');

/**
 * 创建 E2ERunner
 *
 * @return {Promise<E2ERunner>}
 */
async function createE2ERunner() {
  return new E2ERunner({
    workspacePath: path.join(__dirname, '../'),
    outputPath: path.join(__dirname, '../.matman_output'),
  });
}

/**
 * 测试之前准备环境，在准备测试环境阶段准备SUT（System Under Test）
 *
 * @param {E2ERunner} e2eRunner
 * @param {Object} [config]
 * @param {Boolean} [config.isBuildDev] 当前构建是否是 dev 场景
 * @param {Number} [config.mockstarPort] MockStar 需要的端口
 * @param {Number} [config.whistlePort] Whistle 需要的端口
 * @param {Boolean} [config.useCurrentStartedWhistle] 是否复用当前可能启动的 whistle，适合开发场景下使用
 * @return {Promise<Object>}
 */
async function prepareSUT(e2eRunner, config = {}) {
  // 第一步：构建项目
  const buildProjectCmd = `npx cross-env ENABLE_E2E_TEST=1 npm run ${
    config.isBuildDev ? 'start' : 'build'
  }`;
  await e2eRunner.buildProject(buildProjectCmd, {
    cwd: e2eRunner.workspacePath,
  });

  // 第二步：启动 mockstar
  const mockstarAppPath = path.join(e2eRunner.workspacePath, './DevOps/mockstar-app');
  const mockstarPort = await e2eRunner.startMockstar(mockstarAppPath, {
    port: config.mockstarPort,
  });

  // 第三步：启动 whistle
  const whistlePort = await e2eRunner.startWhistle({
    port: config.whistlePort,
    useCurrentStartedWhistle: config.useCurrentStartedWhistle,
    getWhistleRules: () => {
      const getRulesOpts = {
        projectRootPath: e2eRunner.workspacePath,
        mockstarPort,
      };
      return config.isBuildDev
        ? whistle.getDevRules(getRulesOpts)
        : whistle.getProdRules(getRulesOpts);
    },
  });

  // 第四步：启动 matman
  const matmanAppPath = path.join(e2eRunner.workspacePath, './DevOps/matman-app');
  await e2eRunner.startMatman(matmanAppPath);

  return {
    config,
    mockstarPort,
    whistlePort,
    matmanAppPath,
  };
}

/**
 * 直接执行测试文件，执行测试文件阶段，即使用 Mocha 或者 Jest 执行测试命令
 *
 * @param {E2ERunner} e2eRunner
 * @param {Object} [config]
 * @param {Number} [config.whistlePort] Whistle 需要的端口
 * @param {Number} [config.matmanAppPath] Matman 项目根目录
 * @return {Promise<Object>}
 */
async function runE2ETestDirect(e2eRunner, config = {}) {
  const { whistlePort, matmanAppPath } = config;

  // 启动 e2e test
  await e2eRunner.runE2ETest('tnpm run test:e2e:direct', {
    cwd: e2eRunner.workspacePath,
    whistlePort,
    matmanAppPath,
    mochawesomeJsonFilePath: path.join(e2eRunner.outputPath, './mochawesome/mochawesome.json'),
  });

  return {
    config,
  };
}

module.exports = {
  createE2ERunner,
  prepareSUT,
  runE2ETestDirect,
};
