const path = require('path');

/**
 * 获得规则名称，默认为项目名字
 *
 * @return {String}
 */
function getRuleName() {
    const name = path.basename(path.join(__dirname, '../../../')) || '临时';

    return `[auto]${name}`;
}

module.exports = {
    getRuleName
};