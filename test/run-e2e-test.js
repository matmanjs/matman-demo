const path = require('path');
const runCmd = require('./data/run-cmd');
const { startWhistle } = require('./data/start-whistle');
const { startMockstar } = require('./data/start-mockstar');
const { startMatman } = require('./data/start-matman');

/**
 * 执行端对端测试用例
 *
 * @return {Promise<>}
 */
function runTestDirect(whistlePort) {
    const t = Date.now();

    console.error('开始执行端对端测试用例...');

    let cmd = 'npm run test:e2e:direct';

    if (whistlePort) {
        cmd = `cross-env WHISTLE_PORT=${whistlePort} ${cmd}`;
    }

    return runCmd.runByExec(cmd, { cwd: path.join(__dirname, '../') })
        .then((data) => {
            console.log(`端对端测试用例执行执行完成！耗时${Date.now() - t}ms`);
            return data;
        })
        .catch((err) => {
            console.error('执行端对端测试时失败', err);
            return Promise.reject(err);
        });
}

console.log(`============开始执行===========`);

const t = Date.now();

// 1. 启动 mockstar
startMockstar()
    .then((mockstarPort) => {
        // 2. 启动 whistle
        return startWhistle(mockstarPort)
            .then((whistlePort) => {
                // 3. 启动 matman（实际上是构建）
                return startMatman()
                    .then(() => {
                        // 4. 执行端对端自动化测试
                        return runTestDirect(whistlePort);
                    });
            });
    })
    .then((data) => {
        console.log(`============执行结束，总耗时${Date.now() - t}ms===========`);
    })
    .catch((err) => {
        console.log(`============执行过程遇到异常，总耗时${Date.now() - t}ms===========`,err);
    });
