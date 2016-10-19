import * as React from 'react';

export interface Props {
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export  default class Redirect extends React.Component<Props, State> {
    static propTypes = {
        path: React.PropTypes.string.isRequired,
        to: React.PropTypes.string.isRequired,
        status: React.PropTypes.oneOf([301, 302])
    };
    static defaultProps = {
        status: 302
    };
    render() {
        console.error('Redirect can\'t render');
        return null;
    }
}
