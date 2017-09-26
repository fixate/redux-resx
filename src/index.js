import createActions from './createActions';
import createReducer, {initialState} from './createReducer';
import * as types from './types';

export {createActions, createReducer, types};

export const DEFAULT_NS = '@DEFAULT';

const defaultOptions = {
  baseSelector: s => s.resources,
  reducer: s => s,
  resultReducers: {},
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
  const selector = ns => state => {
    const base = options.baseSelector(state);
    // XXX: Selector will return the initial state even if it doesn't actually exist in the store.
    // This is because I don't want the resource.create method to need
    // the dispatch method and do a seperate initialize action.
    // This state will be initialized when the first action is called.
    // This could cause unforseen problems, so the above is the contingincy plan
    // for now I want to try this approach and understand implications, if any.
    // I just hope it doesn't confuse anyone.
    return base ? base[options.name][ns] || initialState : null;
  };

  let _instance = null;

  return {
    reducer: createReducer(options),
    name: options.name,
    default() {
      if (_instance) {
        return _instance;
      }
      return (_instance = this.create());
    },
    create(namespace = DEFAULT_NS) {
      return {
        name: options.name,
        namespace,
        actions: createActions(namespace, options),
        selector: selector(namespace),
      };
    },
    options,
  };
}

export function reducer(resources) {
  return Object.keys(resources).reduce((acc, r) => {
    const {name, reducer} = resources[r];
    return Object.assign(acc, {[name]: reducer});
  }, {});
}
