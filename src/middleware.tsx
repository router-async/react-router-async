import * as React from 'react';
import * as PropTypes from 'prop-types';
import { jsxInstanceOf } from './helpers';
import * as Route from './route';
import * as Redirect from './redirect';

export interface Props {
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export default class Middleware extends React.Component<Props, State> {
    static propTypes = {
        children: PropTypes.oneOfType([
            jsxInstanceOf(Route),
            jsxInstanceOf(Redirect),
            PropTypes.arrayOf(PropTypes.oneOfType([
                jsxInstanceOf(Route),
                jsxInstanceOf(Redirect)
            ]))
        ]).isRequired,
        path: PropTypes.string.isRequired,
        action: PropTypes.func
    };
    render() {
        const childs = Array.isArray(this.props.children ? this.props.children : [this.props.children]);
        return React.Children.only(childs);
    }
}