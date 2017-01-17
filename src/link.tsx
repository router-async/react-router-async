import * as React from 'react';

export interface Props {
    to: any,
    className: any,
    onBeforeClick: any,
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
    static isActive(to, path, activeOnlyWhenExact) {
        return activeOnlyWhenExact ? path === to : path.indexOf(to) === 0;
    };
    navigate = e => {
        if (this.props.onBeforeClick) this.props.onBeforeClick(e, this.props);
        this.context.router.navigate(this.props.to);
        e.preventDefault();
    };
    render() {
        const {
            to,
            className,
            activeClassName,
            activeOnlyWhenExact,
            onClick,
            ...rest
        } = this.props;
        const isActive = Link.isActive(to, this.context.router.getState().location.pathname, activeOnlyWhenExact);

        return (
            <a
                {...rest}
                href={to}
                onClick={onClick || this.navigate}
                className={isActive ? [className, activeClassName].join(' ').trim() : className}
            />
        );
    }
}
