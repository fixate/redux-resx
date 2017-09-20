# Redux API Resource creator (redux-resx)

[![Build Status](https://travis-ci.org/fixate/redux-resx.svg?branch=master)](https://travis-ci.org/fixate/redux-resx)

Yet another Redux action creators, a reducer and middleware for resource-based APIs.

## Installation

```shell
npm install --save redux-resx
```

## Usage

### Resource definition

```javascript
// somewhere like src/resources/user.js
import createResource from 'redux-resx';

export default createResource({
  // Required:
  name: '@resx/USER', // Unique namespace for actions and reducer
  url: '/users',

  // Optional (defaults shown)
  // This function should return the root object of where you mount your state
  baseSelector: s => s.resources,
  // Use this to add extra reducers which receive the state after the built-in reducer
  // has done it's thing - this can perhaps be used in conjunction with custom middleware
  // It only receives resource actions, not every action
  reducer: (state, _action) => state,
});


// src/resources/index.js
export default as user from './user';
```

### Reducer

```javascript
import { combineReducers } from 'redux';

import * as resources from '../resources';
import { reducer as resourceReducer } from 'redux-resx';

export default combineReducers({
  resources: combineReducers(resourceReducer(resources)),
});
```

Lets break this down a bit:

```javascript
export default combineReducers({
  // 'resources' can be anywhere, you just need to specify a base selector that selects it in
  // create resource
  resources: combineReducers(
    // resourceReducer is really just transforms the object to something that combineReducers can use
    // Give it { users: [result of createResource] } and it will return { users: reducerFn } - simple
    resourceReducer(resources)
  ),
});


// Another way you could do this

import userResource from '../resources/users';
...
resources: combineReducers({
  myUser: userResource.reducer,
  //etc
})
```

### Component

*Please see the NB comments*

```javascript
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { user as userResx } from '../resources';

// NB: New in 1.0.0+
// *************************************************************************
// You need to provide a namespace for your 'instance' (any string) that you want to use.
// This is so you can call a resource in multiple components without interferance.
const myUserResx = userResx.create('@HOME');
// If you omit the namespace, a default one will be used (essentially the same behaviour prior to 1.0.0)
// const myUserResx = userResx.create();

const Home = React.createClass({
//....

  componentWillMount() {
    const { getUser, findUsers, resetUsers } = this.props;
    // XXX: Optional, you'll get old results before new ones are loaded if you don't do this.
    // New in 1.0.0: If your resource is only used in this component and you destroy on unmount,
    // you definitely/obviously won't need to use reset.
    resetUsers();
    findUsers({ status: 'active' }); // params of request
    getUser(123).then(...); // id=123 NB: only if middleware returns a promise
  },

  // NB: New in 1.0.0 - will remove the namespaced data entirely
  componentWillUnmount() {
    this.props.destroyResx();
  }

  render() {
    const { users, user } = this.props;

    return (
      <div>
        {users ? JSON.stringify(users) : null}
        {user ? JSON.stringify(user) : null}
      </div>
    );
  },
});

function mapStateToProps(state) {
  // Select the resource state
  const {
    hasLoaded, // true when find has been loaded before
    isBusy, // true when any of the following are true
    isFinding,
    isGetting,
    isCreating,
    isUpdating,
    isPatching,
    isRemoving,

    // Result for find - always an array (initial value: [])
    items,

    // Last result for create, get, update, patch, remove
    entity, // (initial value: undefined)
  } = userResx.selector(state);

  return {
    users: items,
    user: entity,
    isBusy,
  };
}

const { find: findUsers, get: getUser, reset: resetUsers, destroy: destroyResx } = myUserResx.actions;

export default connect(mapStateToProps, {
  findUsers,
  getUser,
  resetUsers,
  destroyResx,
})(Home);
```

## Middlewares

The middleware's job is to "handle" the actions coming in from resource action creators. This
is where the side-effects are. A middleware is included which calls endpoints like
you would expect, but you can implement your own or use e.g. sagas.

### Builtin middleware

Add middleware to store in the normal way

```javascript
// NB: Only bundled if you are using it
import middleware from 'redux-resx/middleware';
import fetch from 'isomorphic-fetch';
//... other imports

const resxMiddleware = middleware({
  baseUrl: '/api',
  provider: fetch, // could write adapter to convert fetch params to e.g. request/jquery
});

export default function createApplicationStore() {
  return createStore(
    reducers,
    compose(applyMiddleware(resxMiddleware))
  );
}
```

### Other middleware

- [redux-resx-feathers-middleware](https://github.com/fixate/redux-resx-feathers-middleware) - uses `feathers-client` to make requests
- redux-resx-saga - sagas to handle resource actions (TODO)

## TODO

* Example

## Future Ideas

* Middleware (separate package) that implements a decoupled cache using state
