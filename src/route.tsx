import * as React from 'react';
import * as PropTypes from 'prop-types';

export interface Props {
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export  default class Route extends React.Component<Props, State> {
    static propTypes = {
        path: PropTypes.string.isRequired,
        action: PropTypes.func.isRequired,
        status: PropTypes.oneOf([200, 404, 500])
    };
    render() {
        console.error('Route can\'t render');
        return null;
    }
}
