import React, { Component } from 'react';

import './index.less';

export default class PageDocument extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="page-document">
                hello, document
            </div>
        );
    }
}
