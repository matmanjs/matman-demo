const { expect } = require('chai');

const checkPage = require('../../../DevOps/matman-app/case_modules/page-withdraw/basic-check');

describe('withdraw 页面：常规检查(168.88元)', function () {
    this.timeout(30000);

    let resultData;

    before(function () {
        return checkPage({
            show: false,
            doNotEnd: false,
            useRecorder: true,
            queryDataMap: {
                'get_balance': 'success_16888'
            }
        })
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
                'alertInfo': {
                    'isExist': false
                },
                'toastInfo': {
                    'isExist': false
                },
                'noticeInfo': { 'isExist': true, 'txt': '活动提现截止至2019年6月30日' },
                'ruleInfo': {
                    'count': 3,
                    'isExist': true,
                    'rule0': { 'rules': ['1. 规则说明一；', '2. 规则说明二；', '3. 规则说明三；'], 'title': '提现及税费规则' },
                    'rule1': { 'rules': ['这是税费说明。'], 'title': '税费说明' },
                    'rule2': { 'rules': ['这是代缴方案说明。'], 'title': '代缴方案' }
                },
                'withdrawInfo': {
                    'balanceTips': '可提现余额(元)：168.88',
                    'isExist': true,
                    'isSubmitActive': false,
                    'quota0': { 'isAvailable': true, 'isSelected': false, 'text': '5元' },
                    'quota1': { 'isAvailable': true, 'isSelected': false, 'text': '15元' },
                    'quota2': { 'isAvailable': true, 'isSelected': false, 'text': '30元' },
                    'quotaCount': 3,
                    'quotaTitle': '提现金额(元)',
                    'submitTxt': '确定',
                    'taxedTips': '',
                    'walletTips': '提现到QQ钱包：123456'
                }
            });
        });

        it('【5元】按钮可被选择', function () {
            expect(data.withdrawInfo.quota0.isAvailable).to.be.true;
        });

        it('【15元】按钮可被选择', function () {
            expect(data.withdrawInfo.quota1.isAvailable).to.be.true;
        });

        it('【30元】按钮可被选择', function () {
            expect(data.withdrawInfo.quota2.isAvailable).to.be.true;
        });
    });

    describe('检查接口请求及数据上报等情况', function () {
        it('请求了 get_balance 接口（获取余额信息）', function () {
            const result = resultData.isExistXHR('//cgi.now.qq.com/cgi-bin/a/b/get_balance', {
                activeid: 10001
            }, 200);

            expect(result).to.be.true;
        });

        it('请求了 get_verify_status 接口（获取认证状态）', function () {
            const result = resultData.isExistXHR('//cgi.now.qq.com/cgi-bin/a/b/get_verify_status', {}, 200);

            expect(result).to.be.true;
        });

        it('上报了页面曝光', function () {
            const result = resultData.isExistXHR('/maybe/report/pv', {
                report_id: 987
            }, 200);

            expect(result).to.be.true;
        });
    });
});
