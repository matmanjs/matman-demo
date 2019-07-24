const lib = require('./lib');

module.exports = (cb, util) => {
    const name = lib.getRuleName('prod');
    const projectRootPath = lib.getProjectRootPath();

    const ruleList = [
        'cgi.now.qq.com/cgi-bin 127.0.0.1:9527',
        `now.qq.com/manifest.json ${projectRootPath}/build/manifest.json`,
        `/^https?://now\\.qq\\.com/static/(.*)$/ ${projectRootPath}/build/static/$1`,
        `/^https?://now\\.qq\\.com/([\\w\\-]*)(.*)$/ ${projectRootPath}/build/index.html`
    ];

    cb({
        name: name,
        rules: ruleList.join('\n')
    });
};
