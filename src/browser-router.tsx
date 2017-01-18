import * as React from 'react';
import Router, { initParams, initResult } from './router';
import { Context, stringifyQuery } from 'router-async';

export default class BrowserRouter extends Router {
    private history: any;
    private unlistenHistroy: any;
    constructor(props) {
        super(props);
        this.history = props.history;
    }
    static async init(opts: initParams): Promise<initResult> {
        opts.path = opts.history.location.pathname + opts.history.location.search + opts.history.location.hash;
        const result = await super.init(opts);
        return {
            ...result,
            Router: BrowserRouter
        };
    }
    static childContextTypes = {
        router: React.PropTypes.object
    };
    getChildContext() {
        return {
            router: this
        };
    }
    async navigate(path, ctx = new Context()) {
        const { redirect, error } = await this.router.resolve({ path, ctx });
        if (error === null) {
            if (redirect) {
                this.history.push(redirect);
            } else {
                this.history.push(path);
            }
        } else {
            this.history.push(path);
        }
    }
    async push(path) {
        // console.warn('Please use navigate method instead of push, it will be deprecated in future');
        if (typeof path === 'string') {
            await this.navigate(path);
        } else {
            let fullPath = path.pathname;
            if (path.query) fullPath += `?${stringifyQuery(path.query)}`;
            await this.navigate(fullPath);
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
    private _locationChanged = async ({ pathname, hash, search }) => {
        const path = pathname + search + hash;
        let { location, route, status, params, redirect, result, ctx, error } = await this.router.run({ path });
        if (error !== null) {
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
        const renderCallback = Router.makeCallback(this.router, { path, location, route, status, params, redirect, result, ctx });
        this.changeComponent({ Component: result, componentProps: props, path, location, error, renderCallback });
    };
    componentDidMount() {
        this.unlistenHistroy = this.history.listen(this._locationChanged)
    }
    componentWillUnmount() {
        this.unlistenHistroy();
    }
}