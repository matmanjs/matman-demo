const expect = require('chai').expect;

const RequestQueue = require('../../../../lib/request-queue');

const checkPage = require('.');

describe.only('withdraw：验证提现失败逻辑', function () {
    this.timeout(30000);

    let resultData;
    let e2eQueue;

    before(function () {
        return checkPage({
            show: false, doNotEnd: false, useRecorder: true, mockerMap: {
                'withdraw_money': 'error_21_active_close'
            }
        })
            .then(function (result) {
                // console.log(JSON.stringify(result));
                resultData = result;
                e2eQueue = new RequestQueue(resultData.globalInfo.recorder.queue);
            });
    });

    describe('第一步：开始操作之前', function () {
        let data;

        before(function () {
            data = resultData.data[0];
        });

        it('数据快照校验通过', function () {
            expect(data).to.eql({
                'alertInfo': { 'isExist': false },
                'noticeInfo': { 'isExist': true, 'txt': '活动提现截止至2019年6月30日' },
                'ruleInfo': {
                    'count': 3,
                    'isExist': true,
                    'rule0': { 'rules': ['1. 规则说明一；', '2. 规则说明二；', '3. 规则说明三；'], 'title': '提现及税费规则' },
                    'rule1': { 'rules': ['这是税费说明。'], 'title': '税费说明' },
                    'rule2': { 'rules': ['这是代缴方案说明。'], 'title': '代缴方案' }
                },
                'toastInfo': { 'isExist': false },
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

        it('【5元】按钮未被选中', function () {
            expect(data.withdrawInfo.quota0.isSelected).to.be.false;
        });

        it('没有扣税提示', function () {
            expect(data.withdrawInfo.taxedTips).to.be.empty;
        });

        it('【确定】按钮为非激活态，即不可点击', function () {
            expect(data.withdrawInfo.isSubmitActive).to.be.false;
        });
    });

    describe('第二步：选中【5元】', function () {
        let data;

        before(function () {
            data = resultData.data[1];
        });

        it('数据快照校验通过', function () {
            expect(data).to.eql({
                'alertInfo': { 'isExist': false },
                'noticeInfo': { 'isExist': true, 'txt': '活动提现截止至2019年6月30日' },
                'ruleInfo': {
                    'count': 3,
                    'isExist': true,
                    'rule0': { 'rules': ['1. 规则说明一；', '2. 规则说明二；', '3. 规则说明三；'], 'title': '提现及税费规则' },
                    'rule1': { 'rules': ['这是税费说明。'], 'title': '税费说明' },
                    'rule2': { 'rules': ['这是代缴方案说明。'], 'title': '代缴方案' }
                },
                'toastInfo': { 'isExist': false },
                'withdrawInfo': {
                    'balanceTips': '可提现余额(元)：168.88',
                    'isExist': true,
                    'isSubmitActive': true,
                    'quota0': { 'isAvailable': true, 'isSelected': true, 'text': '5元' },
                    'quota1': { 'isAvailable': true, 'isSelected': false, 'text': '15元' },
                    'quota2': { 'isAvailable': true, 'isSelected': false, 'text': '30元' },
                    'quotaCount': 3,
                    'quotaTitle': '提现金额(元)',
                    'submitTxt': '确定',
                    'taxedTips': '实际到账：4元(根据国家税务总局规定收取20%红包个人所得税)',
                    'walletTips': '提现到QQ钱包：123456'
                }
            });
        });

        it('【5元】按钮已被选中', function () {
            expect(data.withdrawInfo.quota0.isSelected).to.be.true;
        });

        it('扣税提示：实际到账4元', function () {
            expect(data.withdrawInfo.taxedTips).to.equal('实际到账：4元(根据国家税务总局规定收取20%红包个人所得税)');
        });

        it('【确定】按钮为激活态，即可点击', function () {
            expect(data.withdrawInfo.isSubmitActive).to.be.true;
        });

        it('余额提示： 168.88', function () {
            expect(data.withdrawInfo.balanceTips).to.equal('可提现余额(元)：168.88');
        });
    });

    describe('第三步：点击【确定】按钮', function () {
        let data;

        before(function () {
            data = resultData.data[2];
        });

        it('数据快照校验通过', function () {
            expect(data).to.eql({
                'alertInfo': {
                    'btnTxt': '确定',
                    'content': '一/二/三期红包活动已结束，请关注参与下期红包活动',
                    'isExist': true
                },
                'noticeInfo': { 'isExist': true, 'txt': '活动提现截止至2019年6月30日' },
                'ruleInfo': {
                    'count': 3,
                    'isExist': true,
                    'rule0': { 'rules': ['1. 规则说明一；', '2. 规则说明二；', '3. 规则说明三；'], 'title': '提现及税费规则' },
                    'rule1': { 'rules': ['这是税费说明。'], 'title': '税费说明' },
                    'rule2': { 'rules': ['这是代缴方案说明。'], 'title': '代缴方案' }
                },
                'toastInfo': { 'isExist': false },
                'withdrawInfo': {
                    'balanceTips': '可提现余额(元)：168.88',
                    'isExist': true,
                    'isSubmitActive': true,
                    'quota0': { 'isAvailable': true, 'isSelected': true, 'text': '5元' },
                    'quota1': { 'isAvailable': true, 'isSelected': false, 'text': '15元' },
                    'quota2': { 'isAvailable': true, 'isSelected': false, 'text': '30元' },
                    'quotaCount': 3,
                    'quotaTitle': '提现金额(元)',
                    'submitTxt': '确定',
                    'taxedTips': '实际到账：4元(根据国家税务总局规定收取20%红包个人所得税)',
                    'walletTips': '提现到QQ钱包：123456'
                }
            });
        });

        it('弹出提示框，提示成功', function () {
            expect(data.alertInfo.content).to.equal('一/二/三期红包活动已结束，请关注参与下期红包活动');
        });

        it('请求了 withdraw_money 接口（提现接口）', function () {
            const result = e2eQueue.isExistCGI('//cgi.now.qq.com/cgi-bin/a/b/withdraw_money', {
                activeid: 10001,
                amount: 500
            });

            expect(result).to.be.true;
        });
    });

    describe('第四步：点击弹窗中的【确定】按钮', function () {
        let data;

        before(function () {
            data = resultData.data[3];
        });

        it('数据快照校验通过', function () {
            expect(data).to.eql({
                'alertInfo': { 'isExist': false },
                'noticeInfo': { 'isExist': true, 'txt': '活动提现截止至2019年6月30日' },
                'ruleInfo': {
                    'count': 3,
                    'isExist': true,
                    'rule0': { 'rules': ['1. 规则说明一；', '2. 规则说明二；', '3. 规则说明三；'], 'title': '提现及税费规则' },
                    'rule1': { 'rules': ['这是税费说明。'], 'title': '税费说明' },
                    'rule2': { 'rules': ['这是代缴方案说明。'], 'title': '代缴方案' }
                },
                'toastInfo': { 'isExist': false },
                'withdrawInfo': {
                    'balanceTips': '可提现余额(元)：168.88',
                    'isExist': true,
                    'isSubmitActive': true,
                    'quota0': { 'isAvailable': true, 'isSelected': true, 'text': '5元' },
                    'quota1': { 'isAvailable': true, 'isSelected': false, 'text': '15元' },
                    'quota2': { 'isAvailable': true, 'isSelected': false, 'text': '30元' },
                    'quotaCount': 3,
                    'quotaTitle': '提现金额(元)',
                    'submitTxt': '确定',
                    'taxedTips': '实际到账：4元(根据国家税务总局规定收取20%红包个人所得税)',
                    'walletTips': '提现到QQ钱包：123456'
                }
            });
        });

        it('提示框被关闭', function () {
            expect(data.alertInfo.isExist).to.be.false;
        });

        it('余额提示： 168.88', function () {
            expect(data.withdrawInfo.balanceTips).to.equal('可提现余额(元)：168.88');
        });
    });
});
