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
}
export interface Action {
    (): React.ReactElement<Props>;
}
interface Childs {
    [index: number]: Route;
}
export interface Route {
    path?: string,
    action?: Action,
    status?: number,
    to?: string,
    childs?: Childs
}
export interface initParams {
    path: string,
    routes: Array<Route>,
    hooks: any,
    history?: any,
    silent?: boolean,
    ctx: any
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
    path: string;
    location: any;
    private subscriber: any;
    constructor({ Component, componentProps, router, path, location }) {
        super();
        this.state = {
            Component,
            componentProps,
            path,
            location
        };

        this.router = router;
        this.subscriber = null;
    }
    static async init(opts: initParams): Promise<initResult> {
        const { path, routes, hooks, history = null, silent = false, ctx = new Context() } = opts;
        const plainRoutes = Router.buildRoutes(routes);
        const router = new RouterAsync({ routes: plainRoutes, hooks });
        const { location, route, status, params, redirect, result } = await router.run({ path, ctx, silent });
        const componentProps = {
            router: {
                path,
                location,
                route,
                status,
                params,
                redirect,
                ctx
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
                history
            },
            componentProps,
            callback: this.makeCallback(router, { path, route, status, params, redirect, result, ctx })
        }
    }
    static buildRoutes(routes) {
        if (!Array.isArray(routes)) routes = routes.props.children;
        return deepMap(routes, route => {
            const result: Route = {};
            if (route.props.path) result.path = route.props.path;
            if (route.props.action) result.action = route.props.action;
            if (route.props.status) result.status = route.props.status;
            if (route.props.to) result.to = route.props.to;
            if (route.props.children) result.childs = Array.isArray(route.props.children) ? route.props.children : [route.props.children];
            return result;
        });
    }
    static makeCallback(router, options = {}) {
        return () => {
            return Router.runRenderHooks(router, options);
        }
    }
    static runRenderHooks(router, options = {}) {
        return router.runHooks('render', options);
    }
    subscribe(callback: Function) {
        this.subscriber = callback.bind(this);
    }
    changeComponent({ Component, componentProps, path, location, renderCallback }) {
        if (this.subscriber) {
            this.subscriber({ Component, componentProps, path, location, renderCallback });
        } else {
            this.setState({
                path,
                location,
                Component,
                componentProps
            }, renderCallback);
        }
    }
    replaceComponent(Component, componentProps) {
        if (this.subscriber) {
            this.subscriber({ Component, componentProps, path: this.path, location: this.location })
        } else {
            this.setState({
                Component,
                componentProps
            });
        }
    }
    getState() {
        return this.state;
    }
    render() {
        if (this.props.children) {
            return React.Children.only(this.props.children)
        } else {
            return <this.state.Component {...this.state.componentProps} />
        }
    }
}
