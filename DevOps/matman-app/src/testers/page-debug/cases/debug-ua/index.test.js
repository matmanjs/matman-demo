const expect = require('chai').expect;

const checkPage = require('.');

describe('debug 页面：用于调试的页面', function () {
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

        it('基本信息正确', function () {
            expect(data).to.eql({
                'info': { 'height': 378, 'width': 800 },
                'debugUA': {
                    'isExist': true,
                    'ua': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 nightmare mydevice'
                }
            });
        });
    });
});
