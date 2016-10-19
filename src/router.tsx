import RouterAsync from 'router-async';
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
    location: any,
    Component: React.ReactElement<Props>;
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

export default class Router extends React.Component<Props, State> {
    private router: any;
    private history: any;
    private unlistenHistroy: any;
    constructor(props) {
        super();
        this.state = {
            Component: props.Component,
            location: props.history.location
        };

        this.router = props.router;
        this.history = props.history;
    }
    static async init({ path, routes, hooks }) {
        const plainRoutes = Router.buildRoutes(routes);
        const router = new RouterAsync({ routes: plainRoutes, hooks });
        const { result, redirect, status } = await router.resolve({ path });
        return {
            Router,
            Component: result,
            redirect,
            status,
            router,
            callback: this.makeCallback(router)
        }
    }
    static buildRoutes(routes) {
        if (!Array.isArray(routes)) {
            routes = routes.props.children;
        }
        return deepMap(routes, route => {
            const result: Route = {};
            if (route.props.path) {
                result.path = route.props.path;
            }
            if (route.props.action) {
                result.action = route.props.action;
            }
            if (route.props.status) {
                result.status = route.props.status;
            }
            if (route.props.to) {
                result.to = route.props.to;
            }
            if (route.props.children) {
                result.childs = Array.isArray(route.props.children) ? route.props.children : [route.props.children];
            }
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
    static childContextTypes = {
        router: React.PropTypes.object
    };
    getChildContext() {
        return {
            router: this
        };
    }
    get location() {
        return this.state.location;
    }
    async navigate(path) {
        try {
            const { redirect } = await this.router.match({ path, ctx: {} });
            if (redirect) {
                this.history.push(redirect);
            } else {
                this.history.push(path);
            }
        } catch (error) {
            if (this.props.errorHandler) {
                this.props.errorHandler(error, this);
            } else {
                console.error('Navigate Error', error);
                throw error;
            }
        }
    }
    private _locationChanged = async (location, action) => {
        const { result } = await this.router.resolve({ path: location.pathname, ctx: {} });
        this.setState({
            Component: result,
            location
        }, Router.makeCallback(this.router));
    };
    componentDidMount() {
        this.unlistenHistroy = this.history.listen(this._locationChanged)
    }
    componentWillUnmount() {
        this.unlistenHistroy();
    }
    render() {
        return <this.state.Component/>
    }
}
