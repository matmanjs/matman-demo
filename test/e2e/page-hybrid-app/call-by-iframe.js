const { expect } = require('chai');

const checkPage = require('../../../DevOps/matman-app/case_modules/page-hybrid-app/call-by-iframe');

describe('hybrid 页面：使用 iframe 方式调用 jsbridge', function () {
    this.timeout(30000);

    let result;

    before(function () {
        return checkPage({ show: false, doNotEnd: false, useRecorder: true })
            .then(function (matmanResult) {
                // console.log(JSON.stringify(result));
                result = matmanResult;
            });
    });

    describe('实际调用了 tnow://callByIframe?name=matman', function () {
        let data;

        before(function () {
            data = result.data;
        });

        it('tnow://callByIframe 匹配成功', function () {
            expect(result.isExistJSBridge('tnow://callByIframe')).to.be.true;
        });

        it('tnow://callByIframe?name=matman 匹配成功', function () {
            expect(result.isExistJSBridge('tnow://callByIframe?name=matman')).to.be.true;
        });

        it('tnow://callByIframe 且 {"name":"matman"} 匹配成功', function () {
            expect(result.isExistJSBridge('tnow://callByIframe', { 'name': 'matman' })).to.be.true;
        });

        it('tnow://callByIframeSomeOne 匹配失败', function () {
            expect(result.isExistJSBridge('tnow://callByIframeSomeOne')).to.be.false;
        });

        it('tnow://callByIframe?name=matman222 匹配失败', function () {
            expect(result.isExistJSBridge('tnow://callByIframe?name=matman222')).to.be.false;
        });

        it('tnow://callByIframe 且 {"name":"matman222"} 匹配失败', function () {
            expect(result.isExistJSBridge('tnow://callByIframe', { 'name': 'matman222' })).to.be.false;
        });
    });
});
