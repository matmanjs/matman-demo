const env = require('./env');

function getResult(opts) {
    return env.createPageDriver(__filename, opts)

        // 设置浏览器参数
        .setDeviceConfig({
            'name': 'mydevice',
            'UA': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
            'width': 1250,
            'height': 400
        })

        // 加载页面地址
        .goto(env.getPageUrl())

        // 需要等待某些条件达成，才开始运行爬虫脚本
        .wait(env.WAIT.READY_UA)

        // 爬虫脚本的函数，用于获取页面中的数据
        .evaluate(() => {
            return {
                remarks: '调试UA',
                ua: document.querySelector('#debug-ua .ua').innerText
            };
        })

        // 结束，获取结果
        .end();
}

module.exports = getResult;

// getResult({ show: true, doNotCloseBrowser: true, useRecorder: false })
//     .then(function (result) {
//         console.log(JSON.stringify(result));
//     })
//     .catch(function (error) {
//         console.error('failed:', error);
//     });
