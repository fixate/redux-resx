import createActions from './createActions';
import createReducer from './createReducer';
import * as types from './types';

export {
  createActions,
  createReducer,
  types,
};

const defaultOptions = {
  baseSelector: s => s.resources,
  reducer: s => s,
};

export function isRequestAction(action) {
  return types.requestTypes.indexOf(action.type) > -1;
}

export function isSuccessAction(action) {
  return types.successTypes.indexOf(action.type) > -1;
}

export function isErrorAction(action) {
  return types.errorTypes.indexOf(action.type) > -1;
}

export default function createResource(opts) {
  const options = Object.assign({}, defaultOptions, opts);
  const selector = (state) => {
    const base = options.baseSelector(state);
    return base ? base[options.name] : null;
  };

  return {
    actions: createActions(options),
    reducer: createReducer(options),
    name: options.name,
    selector,
  };
}

export function reducer(resources) {
  return Object.keys(resources)
    .reduce((acc, r) => {
      const { name, reducer } = resources[r];
      return Object.assign(acc, { [name]: reducer });
    }, {});
}
