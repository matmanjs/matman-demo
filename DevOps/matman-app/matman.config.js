const path = require('path');

// 更多配置说明，请参考 https://matmanjs.github.io/matman/api/matman-config.html
module.exports = {
    rootPath: __dirname,
    testerPath: path.join(__dirname, './src/testers'),
    crawlerInjectJQuery: true
};
