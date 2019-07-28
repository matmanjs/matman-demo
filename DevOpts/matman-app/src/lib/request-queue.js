const urlHandle = require('url-handle');

module.exports = class RequestQueue {
    constructor(queue = []) {
        this.queue = queue;
    }

    isExistCGI(partialURL, query = {}) {
        let result = this.getRequestCGI(partialURL, query);

        // TODO 如果匹配多个怎么办呢
        return result.length > 0;
    }

    isExistPage(partialURL, query = {}) {
        let result = this.getRequestPage(partialURL, query);

        // TODO 如果匹配多个怎么办呢
        return result.length > 0;
    }

    getRequestCGI(partialURL, query = {}) {
        return this.queue.filter((item) => {
            if (item.eventName !== 'did-get-response-details') {
                return false;
            }
            if (!item.args || item.args.length < 4) {
                return false;
            }

            let originalURL = item.args[3];

            return isURLMatch(originalURL, partialURL, query);
        });
    }

    getRequestPage(partialURL, query = {}) {
        return this.queue.filter((item) => {
            if (item.eventName !== 'did-get-response-details') {
                return false;
            }
            if (!item.args || item.args.length < 4) {
                return false;
            }

            if (item.args[item.args.length - 1] !== 'mainFrame') {
                return;
            }

            let originalURL = item.args[3];

            return isURLMatch(originalURL, partialURL, query);
        });
    }
};

function isURLMatch(URLToCheck, partialURL, query = {}) {
    if (!URLToCheck) {
        return false;
    }

    if (URLToCheck.indexOf(partialURL) < 0) {
        return false;
    }

    let list = Object.keys(query);

    for (let i = 0, length = list.length; i < length; i++) {
        if (!isEqualOfLoose(urlHandle.query(list[i], URLToCheck), query[list[i]])) {
            return false;
        }
    }

    return true;
}

function isEqualOfLoose(a, b) {
    return a == b;
}
