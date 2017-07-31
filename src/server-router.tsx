import * as React from 'react';
import * as PropTypes from 'prop-types';
import Router, { initParams, initResult } from './router';
import serialize from 'serialize-javascript';

export default class ServerRouter extends Router {
    static async init(opts: initParams): Promise<initResult> {
        const result = await super.init(opts);
        return {
            ...result,
            Router: ServerRouter
        };
    }
    static childContextTypes = {
        router: PropTypes.object
    };
    getChildContext() {
        return {
            router: this
        };
    }
    render() {
        return (
            <div>
                {this.props.children ? this.props.children : <this.state.Component {...this.state.componentProps} />}
                <script dangerouslySetInnerHTML={{ __html: `window.__REACT_ROUTER_ASYNC__=${serialize({
                    state: this.state
                }, {isJSON: true})};`}} />
            </div>
        )
    }
}
