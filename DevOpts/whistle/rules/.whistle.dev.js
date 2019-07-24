const lib = require('./lib');

module.exports = (cb, util) => {
    const name = lib.getRuleName();

    const ruleList = [
        'now.qq.com/cgi-bin 127.0.0.1:9527',
        'now.qq.com 127.0.0.1:3000'
    ];

    cb({
        name: name,
        rules: ruleList.join('\n')
    });
};
