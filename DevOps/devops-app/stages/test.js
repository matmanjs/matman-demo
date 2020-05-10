const webTest = require('@tencent/dwt-ivweb');
const config = require('../config');

/**
 * 提供给蓝盾流水线中的蓝盾插件，用于执行自动化测试
 *
 * @param {Object} inputParams 蓝盾体系内的一些参数变量
 * @param {Object} [nodejsAtomSdk] 蓝盾的 nodejs 版本 sdk，等效于 require('@tencent/nodejs_atom_sdk');
 * @param {Object} [opts] 额外参数
 * @return {Promise<*>}
 */
module.exports = (inputParams, nodejsAtomSdk, opts) => {
    return webTest.test(inputParams, nodejsAtomSdk, config.getTestConfig(opts));
};

