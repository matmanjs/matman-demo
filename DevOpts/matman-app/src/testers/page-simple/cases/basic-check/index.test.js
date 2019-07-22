const expect = require('chai').expect;

const checkPage = require('.');

describe('simple.html：常规检查-普通静态页面', function () {
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

        it('顶层图片检查通过', function () {
            expect(data.topImageInfo).to.eql({
                'anchor1': '//pic.url.cn/hy_personal/33ab1df8c733dfb724654cb8d9b8fe91647fc4ed4ade9ec4002d92f0e8867248/640',
                'anchor2': 'http://pic.url.cn/hy_personal/e308b9c90742cc3c5c67334b6db49b19f891e8d507212fde3af431b8b8597b02/640',
                'isExist': true
            });
        });

        it('规则文案检查通过', function () {
            expect(data.middleRule).to.eql({
                'isExist': true,
                'text': '规则说明：1.第一条规则；2.第二条规则；3.第三条规则，这条规则很长，会自动换行展示自动换行展示自动换行展示自动换行展示自动换行展示；同意不同意'
            });
        });

        it('按钮样式检查通过', function () {
            expect(data.buttonCondition).to.eql({
                'isExist': true,
                'active_btn': '同意',
                'disable_btn': '不同意'
            });
        });

        it('文字单行检查通过', function () {
            expect(data.oneLineText).to.eql({
                'isExist': true,
                'isOneLine': false,
                'text': '我简单说两句，我很长，但是不能够换行不能够换行不能够换行不能够换行不能够换行不能够换行不能够换行'
            });
        });
    });
});
