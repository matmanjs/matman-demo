/* eslint-disable no-use-before-define */
const {
    useJquery
} = require('web-crawl-util');

module.exports = () => {
    return {
        debugUA: getDebugUA(),
        info: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
};

/**
 * 规则说明
 */
function getDebugUA() {
    const parentSelector = '#debug-ua';

    const result = {
        isExist: useJquery.isExist(parentSelector)
    };

    if (result.isExist) {
        result.ua = useJquery.getText('.ua', parentSelector);
    }

    return result;
}
