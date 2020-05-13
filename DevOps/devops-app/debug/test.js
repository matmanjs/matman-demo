// const dwt = require('devops-web-test');
//
// const { getTestConfig } = require('../config-prod');
//
// const testConfig = getTestConfig();
//
// dwt.start(testConfig.dwtPath, testConfig)
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

const { run } = require('../start');

const opts = {};

run(opts)
    .then((data) => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch((err) => {
        console.error(err);
    });