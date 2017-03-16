# Redux API Resource creator (redus-resx)

Yet another Redux action creators, a reducer and middleware for resource-based APIs.

## Installation

```shell
npm install --save redux-resx
```

## Why

TODO: basically I wanted something I understood that is a better version of the way we
already do things.

## Features

* No magic (`redux` is the real hero)
* State Selectors
* Decoupled
* Namespaced actions (not even sure if this is good/bad)

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

```javascript
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { select as selectResource } from 'redux-resx';

import { user as userResx } from '../../resources';

const Home = React.createClass({
//....

  componentWillMount() {
    const { findUsers, resetUsers } = this.props;
    // XXX: Optional, you'll get old results before new ones are loaded if you don't do this.
    resetUsers();
    findUsers({ status: 'active' }); // params of request
  },

  render() {
    const { users } = this.props;

    return (
      <div>
        <button onClick={this.handleDoneClick}>Test</button>
        {user ? JSON.stringify(user) : null}
      </div>
    );
  },
});

function mapStateToProps(state) {
  // Select the resource state
  const {
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
    isBusy,
  };
}

const { find: findUsers, reset: resetUsers } = userResx.actions;

export default connect(mapStateToProps, {
  findUsers,
  resetUsers,
})(Home);

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

- redux-resx-feathers-middleware - uses `feathers-client` to make requests (TODO)
- redux-resx-saga - sagas to handle resource actions (TODO)

## Future Ideas

* Middleware that implements a cache using state
