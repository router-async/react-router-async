import * as React from 'react';
import { jsxInstanceOf } from './helpers';
import * as Route from './route';
import * as Middleware from './middleware';
import * as Redirect from './redirect';
import * as PropTypes from 'prop-types';

export interface Props {
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export default class RootRoute extends React.Component<Props, State> {
    static propTypes = {
        children: PropTypes.oneOfType([
            jsxInstanceOf(Route),
            jsxInstanceOf(Middleware),
            jsxInstanceOf(Redirect),
            PropTypes.arrayOf(PropTypes.oneOfType([
                jsxInstanceOf(Route),
                jsxInstanceOf(Middleware),
                jsxInstanceOf(Redirect)
            ]))
        ]).isRequired
    };
    render() {
        return React.Children.only(this.props.children);
    }
}