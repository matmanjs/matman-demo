const { start } = require('../config-dev');

const opts = {};

start(opts)
    .then((data) => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch((err) => {
        console.error(err);
    });