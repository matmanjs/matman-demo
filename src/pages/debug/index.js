import React from 'react';

import './index.less';

export default function PageSimple() {
    const ua = navigator.userAgent;

    return (
        <div id="container">
            <div id="ua" className="section">
                <code>{ua}</code>
            </div>
        </div>
    );
}
