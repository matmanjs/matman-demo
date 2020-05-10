const dwt = require('devops-web-test');

const { getTestConfig } = require('../config-prod');

const testConfig = getTestConfig();

dwt.start(testConfig.dwtPath, testConfig)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

