const path = require('path');

const ivwebDevopsWebTest = require('@tencent/dwt-ivweb');

function getTestConfig(opts) {
    const common = ivwebDevopsWebTest.getTestConfig(__dirname, {
        shouldRunE2ETest: true,
        shouldRunUnitTest: true,
        getWhistleRules: function (testRecord, opts) {
            const whistleSetting = require(path.join(__dirname, '../whistle'));

            return whistleSetting.getDevRules({
                projectRootPath: opts.projectRootPath,
                shouldUseMockstar: opts.shouldUseMockstar,
                mockstarPort: opts.mockstarPort,
                name: opts.name
            });
        },
        customPluginParams: {
            project: {
                usePort: true,
                buildCmd: function (port, testRecord) {
                    return port ? `npx cross-env PORT=${port} npm start` : 'npm start';
                },
                buildCompleteCheck: function (data) {
                    return data && data.indexOf('Compiled successfully') > -1;
                }
            }
        }
    });

    return Object.assign(common, opts);
}

module.exports = {
    getTestConfig
};