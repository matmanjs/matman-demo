const dwt = require('devops-web-test');

const { getBootstrapConfig } = require('../config-dev');

const testConfig = getBootstrapConfig();

dwt.start(testConfig.dwtPath, testConfig)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

