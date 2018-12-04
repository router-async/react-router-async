import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Router as RouterAsync, Context } from 'router-async';
import { deepMap } from './helpers';

export interface Props {
    Component: React.ReactElement<Props>,
    router: any,
    histroy: any,
    errorHandler: any,
    [propName: string]: any;
}
export interface State {
    Component?: React.ComponentClass<Props>,
    componentProps?: any;
    path?: any;
    location?: any;
    error?: any;
}
export interface Action {
    (): React.ReactElement<Props>;
}
export interface Childs {
    [index: number]: Route;
}
export interface Route {
    path?: string,
    action?: Action,
    status?: number,
    to?: string,
    childs?: Childs,
    [index: string]: any;
}
export interface initParams {
    path: string,
    routes: Array<Route>,
    hooks: any,
    history?: any,
    ctx: any,
    errors: any,
    isUniversal: boolean,
    helpers?: any,
    isCaseInsesitive?: boolean
}
export interface initResult {
    Router?: any,
    Component?: any,
    redirect?: any,
    status?: any,
    routerProps?: any,
    componentProps?: any,
    callback?: any,
    error?: any
}
export interface childContext {
    router: PropTypes.object
}

export default class Router extends React.Component<Props, State> {
    router: any;
    errors: any;
    path: string;
    location: any;
    private subscriber: any;
    private static clearSlashesRegex = /\/{2,}/g;
    constructor(props) {
        super(props);

        this.state = {
            Component     : props.Component,
            componentProps: props.componentProps,
            path          : props.path,
            location      : props.location,
            error         : props.componentProps.router.error
        };

        this.router = props.router;
        this.errors = props.errors;
        this.subscriber = null;
    }
    static async init(opts: initParams): Promise<initResult> {
        const { routes, hooks, history = null, ctx = new Context(), errors, isUniversal, helpers, isCaseInsesitive = false } = opts;
        let { path } = opts;
        let plainRoutes;

        path = path.replace(this.clearSlashesRegex, '/');
        
        if ((Array.isArray(routes) && React.isValidElement(routes[0])) || React.isValidElement(routes)) {
            plainRoutes = Router.buildRoutes(routes);
        } else {
            plainRoutes = routes;
        }

        const router = new RouterAsync({ routes: plainRoutes, hooks, helpers });

        if(isCaseInsesitive) {
            path = this.caseInsesitive(path, router.routes);
        }

        let routerResult: any = {};
        let callback = () => { /* noop */ };
        if (isUniversal) {
            routerResult = await router.resolve({ path, ctx });
        } else {
            routerResult = await router.run({ path, ctx });
        }
        let { location, route, status, params, redirect, result, error } = routerResult;
        if (!isUniversal) callback = this.makeCallback(router, router.currentTransition, { path, location, route, status, params, redirect, result, historyAction: null, ctx });

        if (error !== null) {
            result = Router.getErrorComponent(error, errors);
        }
        const componentProps = {
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

        return {
            Component: result,
            redirect,
            status,
            routerProps: {
                Component: result,
                componentProps,
                router,
                path,
                location,
                history,
                errors
            },
            componentProps,
            callback,
            error
        }
    }
    static caseInsesitive(path, routes) {
        for(const route of routes) {
            if(typeof route.path === 'object') {
                if(route.pattern.exec(path.toLowerCase())) {
                    return path.toLowerCase();
                }
            } else {
                if(route.path.toLowerCase() === path.toLowerCase() || route.pattern.exec(path)) {
                    return route.path;
                }
            }
        }

        return path;
    }
    static buildRoutes(routes) {
        if (!Array.isArray(routes)) routes = routes.props.children;
        return deepMap(routes, route => {
            const result: Route = {
                ...route.props
            };
            if (route.props.children) result.childs = Array.isArray(route.props.children) ? route.props.children : [route.props.children];
            return result;
        });
    }
    static makeCallback(router, currentTransition, options = {}) {
        return () => {
            return Router.runRenderHooks(router, currentTransition, options);
        }
    }
    static runRenderHooks(router, currentTransition, options = {}) {
        return router.runHooks('render', currentTransition, options);
    }
    subscribe(callback: Function) {
        this.subscriber = callback.bind(this);
    }
    static getErrorComponent(error, errors) {
        if (error.status in errors) {
            return errors[error.status];
        }
        if ('*' in errors) {
            return errors['*'];
        }
        return 'Internal error';
    }
    changeComponent({ Component, componentProps, path, location, error, renderCallback }) {
        if (this.subscriber) {
            this.subscriber({ Component, componentProps, path, location, error, renderCallback });
        } else {
            if (error !== null) {
                Component = Router.getErrorComponent(error, this.errors);
            }
            this.setState({
                path,
                location,
                Component,
                componentProps,
                error
            }, renderCallback);
        }
    }
    getState() {
        return this.state;
    }
    static childContextTypes: childContext = {
        router: PropTypes.object
    }
    getChildContext(): childContext {
        return {
            router: this
        };
    }
}
