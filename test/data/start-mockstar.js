const path = require('path');
const runCmd = require('./run-cmd');

function startMockstar(port) {
    const mockstarAppPath = path.join(__dirname, '../../DevOps/mockstar-app');

    return runCmd.runByExec('npm i', { cwd: mockstarAppPath })
        .then(() => {
            console.log(`mockstar-app npm i 完成`);

            const mockstarPort = process.env.MOCKSTAR_PORT || 9527;

            return runCmd.runByExec(`npm run build`, { cwd: mockstarAppPath })
                .then(() => {
                    console.log(`mockstar 已经启动，端口为 ${mockstarPort}`);
                    return mockstarPort;
                })
                .catch((err) => {
                    console.error('mockstar 启动失败：', err);
                    return Promise.reject(err);
                });
        })
        .catch((err) => {
            console.error('mockstar-app npm i 失败：', err);
            return Promise.reject(err);
        });
}

module.exports = {
    startMockstar
};



