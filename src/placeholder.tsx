import * as React from 'react';
import Router from './router';

export interface Props {
    [propName: string]: any;
}
export interface State {
    Component?: React.ComponentClass<Props>,
    props?: any;
}
export interface Context {
    router: Router
}
export default class PlaceHolder extends React.Component<Props, State> {
    context: Context;
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };
    constructor(props) {
        super();
        this.state = {
            Component: props.Component,
            props: props.props
        };
    }
    componentDidMount() {
        this.context.router.subscribe((Component, props, renderCallback) => {
            this.setState({
                Component,
                props
            }, renderCallback);
        })
    }
    render() {
        return <this.state.Component router={this.state.props} />
    }
}