const path = require('path');
const runCmd = require('./run-cmd');

function startMatman() {
    const matmanAppPath = path.join(__dirname, '../../DevOps/matman-app');

    return runCmd.runByExec('npm i', { cwd: matmanAppPath })
        .then(() => {
            console.log(`matman-app npm i 完成`);

            return runCmd.runByExec(`npm run build`, { cwd: matmanAppPath })
                .then((data) => {
                    console.log(`matman 构建成功`);
                    return data;
                })
                .catch((err) => {
                    console.error('matman 构建失败：', err);
                    return Promise.reject(err);
                });
        })
        .catch((err) => {
            console.error('matman-app npm i 失败：', err);
            return Promise.reject(err);
        });
}

module.exports = {
    startMatman
};



