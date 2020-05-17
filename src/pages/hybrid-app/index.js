import React, { Component } from 'react';

import { callByIframe, callByLocaiton } from './util';

import './index.less';

export default class PageHybridApp extends Component {
    constructor(...props) {
        super(...props);

        this.state = {
            logs: []
        };
    }

    componentDidMount() {
        this.handleObserve();
    }

    addLog(msg) {
        this.setState({
            logs: [`${msg}`, ...this.state.logs]
        });
    }

    handleObserve = () => {
        var observe = new MutationObserver(function (mutations, observer) {
            console.log('===MutationObserver====');
            console.log('===mutations====', mutations);
            console.log('===observer====', observer);

            try {
                // iframe
                // tnow://callByIframe
                console.log(mutations[0].removedNodes[0].src);
            } catch (e) {

            }
        });

        var el = document.querySelector('body');
        var options = {
            'childList': true,
            'attributes': true
        };

        observe.observe(el, options);
    };

    testJSBridge = () => {
        const jsbridge = 'tnow://callByLocaiton';
        console.log('=====testJSBridge======', jsbridge);

        callByLocaiton(jsbridge);

        this.addLog(`点击调用： ${jsbridge}`);
    };

    testJSBridgeIframe = () => {
        const jsbridge = 'tnow://callByIframe';
        console.log('=====testJSBridgeIframe======', jsbridge);

        callByIframe(jsbridge);

        this.addLog(`点击调用： ${jsbridge}`);
    };

    testJumpUrl = () => {
        const url = 'https://www.baidu.com';
        console.log('=====testJumpUrl======', url);

        setTimeout(() => {
            window.location.href = 'https://now.qq.com';
        }, 500);

        this.addLog(`点击跳转： ${url}，延时 500ms 执行`);
    };

    render() {
        const { logs } = this.state;

        return (
            <div className="page-hybrid-app">
                <div className="btn" onClick={this.testJSBridge}>call JSBridge by location</div>
                <div className="btn" onClick={this.testJSBridgeIframe}>call JSBridge by iframe</div>
                <div className="btn" onClick={this.testJumpUrl}>url 跳转</div>

                <ul className="msg">
                    {
                        logs.map((log, index) => {
                            return <li key={index}>{log}</li>;
                        })
                    }
                </ul>
            </div>
        );
    }
}
