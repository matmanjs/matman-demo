const { bootstrap } = require('../config');

bootstrap()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

