const path = require('path');
const dwt = require('devops-web-test');
const pipelines = require('../pipelines');

const dwtPath = path.join(__dirname, '../');

const testConfig = pipelines.getTestConfig(dwtPath, {
    getWhistleRules: function (testRecord, opts) {
        const whistleSetting = require(path.join(__dirname, '../../whistle'));

        return whistleSetting.getProdRules({
            projectRootPath: opts.projectRootPath,
            shouldUseMockstar: opts.shouldUseMockstar,
            mockstarPort: opts.mockstarPort,
            name: opts.name
        });
    }
});

console.log(testConfig);
// return;

dwt.start(testConfig.dwtPath, testConfig)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

