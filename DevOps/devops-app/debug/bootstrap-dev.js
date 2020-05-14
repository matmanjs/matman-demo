const { bootstrap } = require('../config-dev');

bootstrap()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

