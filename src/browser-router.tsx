import * as React from 'react';
import Router, { initParams, initResult } from './router';
import { Context, stringifyQuery } from 'router-async';
import * as serialize from 'serialize-javascript';

export default class BrowserRouter extends Router {
    private history: any;
    private unlistenHistroy: any;
    private stateFromServer: any;
    private __CTX__: any;
    constructor(props) {
        super(props);
        this.history = props.history;
        this.stateFromServer = null;
        this.__CTX__ = null;
        if (window && '__REACT_ROUTER_ASYNC__' in window) {
            this.stateFromServer = window['__REACT_ROUTER_ASYNC__'].state;
            if (this.stateFromServer.error !== null) {
                this.state = {
                    ...this.stateFromServer,
                    Component: BrowserRouter.getErrorComponent(this.stateFromServer.error, this.errors)
                }
            }
        }
    }
    static async init(opts: initParams): Promise<initResult> {
        opts.path = opts.history.location.pathname + opts.history.location.search + opts.history.location.hash;
        const result = await super.init(opts);
        return {
            ...result,
            Router: BrowserRouter
        };
    }
    async navigate(path, ctx = new Context()) {
        // if (this.router.isRunning) this.router.cancel(false);
        const { redirect, error } = await this.router.resolve({ path, ctx });
        if (!(error && error.message === 'Cancelled')) {
            this.__CTX__ = ctx;
            if (redirect) {
                this.history.push(redirect);
            } else {
                this.history.push(path);
            }
        }
    }
    async push(path, ctx = new Context()) {
        // console.warn('Please use navigate method instead of push, it will be deprecated in future');
        if (typeof path === 'string') {
            await this.navigate(path, ctx);
        } else {
            let fullPath = path.pathname;
            if (path.query) fullPath += `?${stringifyQuery(path.query)}`;
            await this.navigate(fullPath, ctx);
        }
    }
    // TODO: maybe we need to make this history methods works through navigate?
    goBack() {
        this.history.goBack();
    }
    goForward() {
        this.history.goForward();
    }
    go(n) {
        this.history.go(n);
    }
    private _locationChanged = async ({ pathname, hash, search, state }, historyAction) => {
        const path = pathname + search + hash;
        if (this.router.isRunning) this.router.cancel();
        let opts = { path, ctx: new Context() };
        if (this.__CTX__) {
            opts.ctx = this.__CTX__;
            this.__CTX__ = null;
        }
        let { location, route, status, params, redirect, result, ctx, error } = await this.router.run(opts);
        if (error && error.message === 'Cancelled') return;
        if (error !== null && error.message !== 'Cancelled') {
            result = Router.getErrorComponent(error, this.errors);
        }
        const props = {
            router: {
                path,
                location,
                route,
                status,
                params,
                redirect,
                ctx,
                error
            }
        };
        const renderCallback = Router.makeCallback(this.router, this.router.currentTransition, { path, location, route, status, params, redirect, result, historyAction, ctx });
        this.changeComponent({ Component: result, componentProps: props, path, location, error, renderCallback });
    };
    componentDidMount() {
        this.unlistenHistroy = this.history.listen(this._locationChanged)
    }
    componentWillUnmount() {
        this.unlistenHistroy();
    }

    render() {
        return (
            <div>
                {this.props.children ? this.props.children : <this.state.Component {...this.state.componentProps} />}
                {this.stateFromServer !== null ?
                    <script dangerouslySetInnerHTML={{ __html: `window.__REACT_ROUTER_ASYNC__=${serialize({
                        state: this.stateFromServer
                    }, {isJSON: true})};`}} /> : null
                }
            </div>
        )
    }
}
