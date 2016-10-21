import * as React from 'react';
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
        children: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
            jsxInstanceOf(Route),
            jsxInstanceOf(Redirect)
        ])).isRequired,
        path: React.PropTypes.string.isRequired,
        action: React.PropTypes.func
    };
    render() {
        const childs = Array.isArray(this.props.children ? this.props.children : [this.props.children]);
        return React.Children.only(childs);
    }
}