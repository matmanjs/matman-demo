const path = require('path');
const { E2ERunner } = require('matman-e2e-test');
const whistle = require('../DevOps/whistle');

(async () => {
  const WORKSPACE_PATH = path.join(__dirname, '../');
  const OUTPUT_PATH = path.join(__dirname, '../.matman_output');

  const e2eRunner = new E2ERunner({
    workspacePath: WORKSPACE_PATH,
    outputPath: OUTPUT_PATH,
  });

  // 开始启动
  await e2eRunner.start();

  // 构建项目
  await e2eRunner.buildProject('npx cross-env ENABLE_E2E_TEST=1 tnpm run build', {
    cwd: WORKSPACE_PATH,
  });

  // 启动 mockstar
  const mockstarAppPath = path.join(WORKSPACE_PATH, './DevOps/mockstar-app');
  const mockstarPort = await e2eRunner.startMockstar(mockstarAppPath);

  // 启动 whistle
  const whistlePort = await e2eRunner.startWhistle({
    getWhistleRules: () => {
      return whistle.getProdRules({
        projectRootPath: WORKSPACE_PATH,
        shouldUseMockstar: true,
        mockstarPort,
      });
    },
  });

  // 启动 matman
  const matmanAppPath = path.join(WORKSPACE_PATH, './DevOps/matman-app');
  await e2eRunner.startMatman(matmanAppPath);

  // 启动 e2e test
  await e2eRunner.runE2ETest('tnpm run test:e2e:direct', {
    cwd: WORKSPACE_PATH,
    whistlePort,
    matmanAppPath,
    mochawesomeJsonFilePath: path.join(OUTPUT_PATH, './mochawesome/mochawesome.json'),
  });

  // 结束
  await e2eRunner.stop();
})();
