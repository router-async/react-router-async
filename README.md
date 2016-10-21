# React Router Async
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
[![Latest Stable Version](https://img.shields.io/npm/v/react-router-async.svg?style=flat-square)](https://www.npmjs.com/package/react-router-async)
[![License](https://img.shields.io/npm/l/react-router-async.svg?style=flat-square)](https://www.npmjs.com/package/react-router-async)

``IMPORTANT NOTE! STATUS FOR THIS PROJECT IS EXPERIMENTAL AND THINGS CAN CHANGE, IT'S NOT READY FOR PRODUCTION``

React Router Async is ultimate routing solution for your React applications, especially it's good in universal applications.

![logo](https://router-async.github.io/react-router-async/logo.svg)

## Installation
```bash
yarn add react-router-async
```

## Usage
On client:
```javascript 
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-async';
import { routes, hooks } from './common';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();
const mountNode = document.getElementById('app');

Router.init({ path: history.location.pathname, routes, hooks }).then(({ Router, Component, router, callback }) => {
    ReactDOM.render(<Router {...{ Component, router, history }} />, mountNode, callback);
}).catch(error => console.log(error));
```

On server (for example as express middleware):
```javascript 
export default function (req, res, next) {
    Router.init({ path: req.path, routes, hooks }).then(({ Component, status, redirect }) => {
        if (redirect) {
            res.redirect(status, redirect);
        } else {
            const html = ReactDOM.renderToStaticMarkup(HtmlComponent({
                markup: ReactDOM.renderToString(<Component />),
                assets: assets
            }));
            res.status(status).send('<!DOCTYPE html>' + html);
        }
    }).catch(error => {
        if (error.name === 'RouterError') {
            res.status(error.code).send(error.message);
        } else {
            res.status(500).send('Internal error');
        }
    });
}
```

