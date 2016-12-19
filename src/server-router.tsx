import * as React from 'react';
import Router, { initParams, initResult } from './router';

export default class ServerRouter extends Router {
    static async init(opts: initParams): Promise<initResult> {
        const result = await super.init(opts);
        return {
            ...result,
            Router: ServerRouter
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
}