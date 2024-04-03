import React from 'react';

import './MobileToggle.css';

function MobileToggle(props) {
    return (
        <button className="mobile-toggle" onClick={props.onOpen}>
            <span className="mobile-toggle__bar" />
            <span className="mobile-toggle__bar" />
            <span className="mobile-toggle__bar" />
        </button>
    );
}

export default MobileToggle;
