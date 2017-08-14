import { Router as RouterAsync, Context } from 'router-async';
import * as React from 'react';
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
    errors: any
}
export interface initResult {
    Router?: any,
    Component?: any,
    redirect?: any,
    status?: any,
    routerProps?: any,
    componentProps?: any,
    callback?: any
}

export default class Router extends React.Component<Props, State> {
    router: any;
    errors: any;
    path: string;
    location: any;
    private subscriber: any;
    constructor({ Component, componentProps, router, path, location, errors }) {
        super();
        this.state = {
            Component,
            componentProps,
            path,
            location,
            error: componentProps.router.error
        };

        this.router = router;
        this.errors = errors;
        this.subscriber = null;
    }
    static async init(opts: initParams): Promise<initResult> {
        const { path, routes, hooks, history = null, ctx = new Context(), errors } = opts;
        let plainRoutes;
        if ((Array.isArray(routes) && React.isValidElement(routes[0])) || React.isValidElement(routes)) {
            plainRoutes = Router.buildRoutes(routes);
        } else {
            plainRoutes = routes;
        }
        const router = new RouterAsync({ routes: plainRoutes, hooks });
        let { location, route, status, params, redirect, result, error } = await router.run({ path, ctx });
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
            callback: this.makeCallback(router, router.currentTransition, { path, location, route, status, params, redirect, result, historyAction: null, ctx }),
            error
        }
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
}
