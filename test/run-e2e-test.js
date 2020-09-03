const { createE2ERunner, prepareSUT, runE2ETestDirect } = require('./e2e.config');

(async () => {
  // 创建 E2ERunner
  const e2eRunner = await createE2ERunner();

  // 设置启动
  await e2eRunner.start();

  // 测试之前准备环境
  const prepareSUTResult = await prepareSUT(e2eRunner, {});
  const { whistlePort, matmanAppPath } = prepareSUTResult;

  // 直接执行测试文件
  await runE2ETestDirect(e2eRunner, {
    whistlePort,
    matmanAppPath,
  });

  // 设置结束
  await e2eRunner.stop();
})();
