import * as React from 'react';
import * as PropTypes from 'prop-types';
import Router from './router';

export interface Props {
    [propName: string]: any;
}
export interface State {
    Component?: React.ComponentClass<Props>,
    componentProps?: any;
    path?: any;
    location?: any;
}
export interface Context {
    router: Router
}
export default class Placeholder extends React.Component<Props, State> {
    context: Context;
    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    constructor({ Component, componentProps }) {
        super();
        this.state = {
            Component,
            componentProps
        };
    }
    componentDidMount() {
        this.context.router.subscribe(function ({ Component, componentProps, path, location, renderCallback }) {
            this.setState({
                path,
                location,
                Component,
                componentProps
            }, renderCallback);
        })
    }
    render() {
        const { Component, componentProps } = this.context.router.getState();
        if (this.props.render) {
            return this.props.render({ Component, componentProps });
        } else {
            return <Component key={componentProps.router.path} {...componentProps} />
        }
    }
}