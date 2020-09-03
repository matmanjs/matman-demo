const { createE2ERunner, prepareSUT } = require('./e2e.config');

const bootstrapProjectPort = 3000 || process.env.PROJECT_PORT;
const bootstrapMockstarPort = 9527 || process.env.MOCKSTAR_PORT;
const bootstrapWhistlePort = 8899 || process.env.WHISTLE_PORT;

(async () => {
  // 创建 E2ERunner
  const e2eRunner = await createE2ERunner();

  // 设置启动
  await e2eRunner.start();

  // 测试之前准备环境
  const prepareSUTResult = await prepareSUT(e2eRunner, {
    projectPort: bootstrapProjectPort,
    mockstarPort: bootstrapMockstarPort,
    whistlePort: bootstrapWhistlePort,
    useCurrentStartedWhistle: true,
    isBuildDev: true,
  });

  // debug 日志
  console.log(prepareSUTResult);
  console.log(e2eRunner);
})();
