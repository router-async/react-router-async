import * as React from 'react';

export interface Props {
    to: any,
    [propName: string]: any;
}
export interface State {
    [propName: string]: any;
}

export default class Link extends React.Component<Props, State> {
    context: any;
    static contextTypes = {
        router: React.PropTypes.object
    };
    navigate = e => {
        this.context.router.navigate(this.props.to);
        e.preventDefault();
    };
    render() {
        return <a href={this.props.to} onClick={this.navigate}>{this.props.children}</a>;
    }
}