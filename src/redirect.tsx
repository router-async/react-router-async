import * as React from 'react';
import * as PropTypes from 'prop-types';

export interface Props {
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export  default class Redirect extends React.Component<Props, State> {
    static propTypes = {
        path: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        status: PropTypes.oneOf([301, 302])
    };
    static defaultProps = {
        status: 302
    };
    render() {
        console.error('Redirect can\'t render');
        return null;
    }
}
