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

    componentWillMount() {
        this.handleObserve();
    }

    componentWillUnmount() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    handleObserve = () => {
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('body');

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };

        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                } else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }

            try {
                // iframe
                // tnow://callByIframe
                console.log(mutationsList[0].removedNodes[0].src);
            } catch (e) {

            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        // observer.disconnect();

        this.observer = observer;
    };

    addLog(msg) {
        this.setState({
            logs: [`${msg}`, ...this.state.logs]
        });
    }

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
