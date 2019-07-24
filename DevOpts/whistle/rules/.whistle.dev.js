const lib = require('./lib');

module.exports = (cb, util) => {
    const name = lib.getRuleName();

    const ruleList = [
        'now.qq.com/cgi-bin 127.0.0.1:9527',
        'now.qq.com 127.0.0.1:3000',
        'www.qq.com 127.0.0.1:3006'
    ];

    const rules = ruleList.join('\n');

    cb({
        name: name,
        rules: rules
    });
};
