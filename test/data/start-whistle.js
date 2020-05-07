const fse = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const runCmd = require('./run-cmd');

function checkIfWhistleStarted() {
    return new Promise((resolve, reject) => {
        exec('w2 status', function (error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
            if (matchResult && matchResult[1]) {
                resolve(matchResult[1]);
            } else {
                reject(stdout);
            }
        });
    });
}

function startWhistleDirect() {
    return new Promise((resolve, reject) => {
        exec('w2 start', function (error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            const matchResult = stdout.match(/127\.0\.0\.1:([0-9]+)\//i);
            if (matchResult && matchResult[1]) {
                resolve(matchResult[1]);
            } else {
                reject(stdout);
            }
        });
    });
}

function startWhistle(mockstarPort) {
    const t = Date.now();

    return checkIfWhistleStarted()
        .then((port) => {
            console.log(`whistle 已经启动，端口为 ${port}`);

            const whistle = require('../../DevOps/whistle');
            const whistleRules = whistle.getProdRules({ mockstarPort });

            const tmpWhistleConfigPath = path.join(__dirname, 'tmp/whistle.prod.js');

            // 文件内容
            const configFileContent = `module.exports = ${JSON.stringify(whistleRules, null, 2)};`;

            // 保存文件
            fse.outputFileSync(tmpWhistleConfigPath, configFileContent);

            return runCmd.runByExec('w2 add tmp/whistle.prod.js --force', { cwd: __dirname })
                .then((data) => {
                    console.log(`whistle 设置完成！耗时${Date.now() - t}ms`);
                    return port;
                })
                .catch((err) => {
                    console.error('whistle 设置失败', err);
                    return Promise.reject(err);
                });
        })
        .catch((err) => {
            console.error('whistle 没有启动：', err);
            return startWhistleDirect()
                .then((port) => {
                    console.log(`whistle 启动成功，端口为 ${port}`);
                    return port;
                })
                .catch((err) => {
                    console.error('whistle 启动失败：', err);
                    return Promise.reject(err);
                });
        });
}

module.exports = {
    startWhistle
};

