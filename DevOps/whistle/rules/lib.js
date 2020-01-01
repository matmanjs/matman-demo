const path = require('path');

/**
 * 获得规则名称，默认为项目名字
 *
 * @param {String} [tag] 标记
 * @return {String}
 */
function getRuleName(tag) {
    const name = path.basename(path.join(__dirname, '../../../')) || '临时';

    return `[${tag || 'auto'}]${name}`;
}

/**
 * 获得项目根目录
 *
 * @return {String}
 */
function getProjectRootPath() {
    return path.resolve(path.join(__dirname, '../../../'));
}

module.exports = {
    getRuleName,
    getProjectRootPath
};