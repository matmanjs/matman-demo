const { expect } = require('chai');

const checkPage = require('../../../DevOps/matman-app/case_modules/page-hybrid-app/call-by-location');

describe('hybrid 页面：使用 location 方式调用 jsbridge', function () {
    this.timeout(30000);

    let result;

    before(function () {
        return checkPage({ show: false, doNotEnd: false, useRecorder: true })
            .then(function (matmanResult) {
                // console.log(JSON.stringify(result));
                result = matmanResult;
            });
    });

    describe('实际调用了 tnow://callByLocation?name=matman', function () {
        let data;

        before(function () {
            data = result.data;
        });

        it('tnow://callByLocation 匹配成功', function () {
            expect(result.isExistJSBridge('tnow://callByLocation')).to.be.true;
        });

        it('tnow://callByLocation?name=matman 匹配成功', function () {
            expect(result.isExistJSBridge('tnow://callByLocation?name=matman')).to.be.true;
        });

        it('tnow://callByLocation 且 {"name":"matman"} 匹配成功', function () {
            expect(result.isExistJSBridge('tnow://callByLocation', { 'name': 'matman' })).to.be.true;
        });

        it('tnow://callByLocationSomeOne 匹配失败', function () {
            expect(result.isExistJSBridge('tnow://callByLocationSomeOne')).to.be.false;
        });

        it('tnow://callByLocation?name=matman222 匹配失败', function () {
            expect(result.isExistJSBridge('tnow://callByLocation?name=matman222')).to.be.false;
        });

        it('tnow://callByLocation 且 {"name":"matman222"} 匹配失败', function () {
            expect(result.isExistJSBridge('tnow://callByLocation', { 'name': 'matman222' })).to.be.false;
        });
    });
});
