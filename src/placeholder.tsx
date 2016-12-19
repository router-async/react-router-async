import * as React from 'react';
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
export default class PlaceHolder extends React.Component<Props, State> {
    context: Context;
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    constructor({ Component, componentProps }) {
        super();
        this.state = {
            Component,
            componentProps
        };
    }
    componentDidMount() {
        this.context.router.subscribe(({ Component, componentProps, path, location, renderCallback }) => {
            this.setState({
                path,
                location,
                Component,
                componentProps
            }, renderCallback);
        })
    }
    render() {
        return <this.state.Component {...this.state.componentProps} />
    }
}