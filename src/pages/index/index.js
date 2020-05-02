import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './index.less';

export default class PageIndex extends Component {

    render() {
        return (
            <div className="page-index">
             <p>欢迎运行我们的 demo 项目，代码仓库地址为： <a href="https://git.code.oa.com/dwt/web-test-demo" target="_blank"
                                               rel="noopener noreferrer">https://git.code.oa.com/dwt/web-test-demo</a>
                </p>

                <h2>1. 简单静态页面</h2>
                <ul>
                    <li><NavLink to={`/simple`}>/simple</NavLink></li>
                </ul>

                <h2>2. 单一接口展示型页面</h2>
                <p>注意，本页面需要走代理地址体验</p>
                <ul>
                    <li><a href="https://now.qq.com/transaction" target="_blank"
                           rel="noopener noreferrer">https://now.qq.com/transaction</a></li>
                </ul>
                
                <h2>hello, world!</h2>
                <ul>
                    <li><NavLink to={`/simple`}>简单静态页面</NavLink></li>
                    <li><NavLink to={`/transaction`}>单一接口展示型页面</NavLink></li>
                    <li><NavLink to={`/withdraw`}>重交互页面</NavLink></li>
                </ul>
            </div>
        );
    }
}
