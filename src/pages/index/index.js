import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './index.less';

export default class PageIndex extends Component {

    render() {
        return (
            <div className="page-index">
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
