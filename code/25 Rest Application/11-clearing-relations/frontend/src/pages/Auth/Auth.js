import React from 'react';

import './Auth.css';

function Auth(props) {
    return <section className="auth-form">{props.children}</section>;
}

export default Auth;
