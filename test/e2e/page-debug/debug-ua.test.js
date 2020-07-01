const {expect} = require('chai');

const checkPage = require('../../../DevOps/matman-app/case_modules/page-debug/debug-ua');

describe('debug 页面：调试UA', function () {
  this.timeout(30000);

  let matmanResult;

  before(async function () {
    matmanResult = await checkPage({
      show: false,
      doNotCloseBrowser: false,
      useRecorder: true,
    });
  });

  describe('检查基本信息', function () {
    let data;

    before(function () {
      data = matmanResult.get('init');
    });

    it('ua符合预期（包含了自定义字符串 mycustomua）', function () {
      expect(data.ua).to.equal(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36 mycustomua',
      );
    });
  });
});
