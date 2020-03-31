const lib = require('./lib');

/**
 * 动态生成 whistle 规则
 *
 * @param {Function} cb 回调函数，接受两个参数 name(规则集名字) 和 rules(具体规则)
 * @param {Object} util 工具集
 * @param {Number} util.port 当前 whistle 启动的端口
 * @param {Function} util.existsPlugin 判断指定的 whistle 插件是否存在，接受一个 name 参数，返回一个 Boolean 值
 */
module.exports = (cb, util) => {
    // 项目在 dev 场景下使用的端口，请按自己项目情况进行修改
    // 而这里的写法是因为我们用了 create-react-app
    // https://github.com/facebook/create-react-app/issues/1083
    const projectDevPort = process.env.PORT || 3000;

    // whistle 规则集的名字，会展示在 whistle 管理端 Rules 这个 tab 下
    // 实际上这个名字是可以任意字符串，详见： http://wproxy.org/whistle/webui/rules.html
    // 我们建议每一个项目都创建一个独立的规则集，因此获取项目名做规则集名字，大部分情况可以区分不同项目了
    const name = lib.getRuleName(`dev-${projectDevPort}`);

    // 项目的根目录，有些时候可能需要代理到本地的文件
    const projectRootPath = lib.getProjectRootPath();

    // 规则内容，具体语法请参考： http://wproxy.org/whistle/
    const ruleList = [
        'cgi.now.qq.com/cgi-bin 127.0.0.1:9527',
        'now.qq.com/maybe/report statusCode://200',
        `now.qq.com 127.0.0.1:${projectDevPort}`,
        `now.qq.com/manifest.json ${projectRootPath}/public/manifest.json`,
        'cgi.now.qq.com resCors://enable'
    ];

    // 设置返回，这样才能生效
    cb({
        name: name,
        rules: ruleList.join('\n')
    });
};
