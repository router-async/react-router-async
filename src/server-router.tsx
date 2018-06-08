import * as React from 'react';
import Router, { initParams, initResult } from './router';
import * as serialize from 'serialize-javascript';

export default class ServerRouter extends Router {
    static async init(opts: initParams): Promise<initResult> {
        const result = await super.init(opts);
        return {
            ...result,
            Router: ServerRouter
        };
    }
    
    render() {
        return (
            <React.Fragment>
                {this.props.children ? this.props.children : <this.state.Component {...this.state.componentProps} />}
                <script id="__react-router-async" dangerouslySetInnerHTML={{ __html: `window.__REACT_ROUTER_ASYNC__=${serialize({
                    state: this.state
                }, { isJSON: true })};`}} />
            </React.Fragment>
        )
    }
}
