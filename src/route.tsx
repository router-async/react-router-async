import * as React from 'react';

export interface Props {
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export  default class Route extends React.Component<Props, State> {
    static propTypes = {
        path: React.PropTypes.string.isRequired,
        action: React.PropTypes.func.isRequired,
        status: React.PropTypes.oneOf([200, 404, 500])
    };
    render() {
        console.error('Route can\'t render');
        return null;
    }
}
