import createActions from './createActions';
import createReducer from './createReducer';

export * as types from './types';

const defaultOptions = {
  baseSelector: s => s.resources,
  reducer: s => s,
};

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
