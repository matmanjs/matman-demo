import axios from 'axios';

const STATUS = 'storeStatus';

export const CALL_API = 'Call API';

function getFullUrl(url) {
    if (url.indexOf('http') === 0) {
        return url;
    }

    if (url.indexOf('//') === 0) {
        return url;
    }

    return `${window.location.protocol}//${window.location.hostname}${url}`;
}

export default store => next => action => {
    /**
     * opts 字段说明：
     *  url: CGI请求地址
     *  types: action的type值数组，按顺序依次代表: requestType, successType, failureType
     *  type: ajax的类型，get或者post
     *  data: 请求的参数对象
     *  convert: 自定义处理数据的函数
     *
     * @type {{url:String, types:String[], type:String, data:Object}}
     */
    const opts = action[CALL_API];

    if (typeof opts === 'undefined') {
        return next(action);
    }

    // 二次处理请求的opts中的参数
    const { type } = opts,
        [requestType, successType, failureType] = opts.types;

    opts.type = (type ? type : 'get').toLowerCase();

    /**
     * 触发action
     * @param {Object} _action
     * @returns {*}
     */
    function actionWith(_action) {
        _action = Object.assign(action, _action);

        //'wait' 'fetching' 'success' 'fail'
        let obj = {
            [STATUS]: 'fetching'
        };

        switch (_action.type) {
            case successType:
                obj[STATUS] = 'success';
                break;
            case failureType:
                obj[STATUS] = 'fail';
                break;
            default:
                break;
        }

        if (obj[STATUS] !== 'fetching') {
            _action.data = Object.assign(_action.data || {}, obj);
        } else {
            _action.data = {};
        }

        const finalAction = _action;

        delete finalAction[CALL_API];

        return finalAction;
    }

    // 在请求发送之前，首先会触发 request 的action，表示要发送请求了
    let data = Object.assign({}, opts.data);
    next(actionWith({
        type: requestType,
        data
    }));

    let requestURL = getFullUrl(opts.url);

    const requestPromise = (opts.type === 'get') ? axios.get(requestURL, {
        params: opts.data
    }) : axios.post(requestURL, opts.data);

    return requestPromise
        .then((res) => {
            function convertData(data) {
                if (typeof opts.convert === 'function') {
                    return opts.convert(data);
                } else {
                    return data;
                }
            }

            let finalAction = actionWith({
                type: successType,
                data: convertData(res.data)
            });

            next(finalAction);

            return finalAction;
        })
        .catch((err) => {
            // ios8下面 stack会存在
            if (err && err.stack && !err.errno) {
                // error
                setTimeout(function () {
                    throw err;
                }, 0);
            } else {
                let finalAction = actionWith({
                    type: failureType,
                    error: err
                });

                next(finalAction);

                return Promise.reject(finalAction);
            }
        });
}
