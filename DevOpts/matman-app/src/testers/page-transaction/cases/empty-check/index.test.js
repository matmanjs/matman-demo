const expect = require('chai').expect;
const checkPage = require('.');

describe('transaction.html：无流水信息检查', function () {
    this.timeout(30000);

    let resultData;

    before(function () {
        return checkPage({ show: false, doNotEnd: false, useRecorder: false })
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

        it('数据快照校验通过', function () {
            expect(data).to.eql({
                'transactionListInfo': {
                    // 'emptyPic': 'http://now.qq.com/img/nopkdata@2x_c3c9fbba.png',
                    'emptyWording': '暂无流水记录',
                    'isExist': true,
                    'list': [],
                    'total': 0
                }
            });
        });
    });
});
