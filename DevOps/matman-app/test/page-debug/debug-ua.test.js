const { expect } = require('chai');

const checkPage = require('../../case_modules/page-debug/debug-ua');

describe('debug 页面：调试UA', function () {
    this.timeout(30000);

    let resultData;

    before(function () {
        return checkPage({ show: false, doNotEnd: false, useRecorder: true })
            .then(function (result) {
                // console.log(JSON.stringify(result));
                resultData = result;
            });
    });

    describe('检查基本信息', function () {
        let data;

        before(function () {
            data = resultData.data;
        });

        it('ua符合预期（包含了自定义字符串 mycustomua）', function () {
            expect(data.ua).to.equal('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua');
        });
    });
});
