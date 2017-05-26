import * as types from './types';

export const initialState = {
  hasLoaded: false,
  isBusy: false,
  isFinding: false,
  isGetting: false,
  isCreating: false,
  isUpdating: false,
  isPatching: false,
  isRemoving: false,
  items: [],
  entity: undefined,
  lastError: undefined,
};

export default function createReducer(options) {
  return (state = {}, action) => {
    if (!action.resxns || action.resxns !== options.name) {
      return state;
    }

    if (action.type === types.RESOURCE_DESTROY_NS) {
      // Omit the whole ns key
      return Object.keys(state).reduce((acc, k) => (
        action.ns !== k ? Object.assign(acc, { [k]: state[k] }) : acc
      ), {});
    }

    const { ns } = action;

    const newNSState = options.reducer(
      resourceReducer(options, state[ns], action), action
    );

    if (newNSState !== state[ns]) {
      return Object.assign({}, state, { [ns]: newNSState });
    }

    return state;
  };
}

function resourceReducer(options, state = initialState, action) {
  function extend(nextState) {
    return { ...state, ...nextState, options };
  }

  const { resultReducers } = options;

  switch (action.type) {
    case types.RESOURCE_RESET:
      return initialState;

    case types.RESOURCE_FIND_REQUEST:
      return extend({ isBusy: true, isFinding: true, items: [], lastError: undefined });

    case types.RESOURCE_FIND_SUCCESS:
      return resultReducers.find ?
        resultReducers.find(state, action, options) :
        extend({
          hasLoaded: true,
          isBusy: false,
          isFinding: false,
          items: action.result,
        });

    case types.RESOURCE_GET_REQUEST:
      return extend({ isBusy: true, isGetting: true, entity: undefined, lastError: undefined });

    case types.RESOURCE_GET_SUCCESS:
      return resultReducers.get ?
        resultReducers.get(state, action, options) :
        extend({ isBusy: false, isGetting: false, entity: action.result });

    case types.RESOURCE_FIND_FAILURE:
      return extend({ hasLoaded: true, lastError: action.error, isFinding: false, isBusy: false });
    case types.RESOURCE_GET_FAILURE:
      return extend({ lastError: action.error, isGetting: false, isBusy: false });
    case types.RESOURCE_CREATE_FAILURE:
      return extend({ lastError: action.error, isCreating: false, isBusy: false });
    case types.RESOURCE_UPDATE_FAILURE:
      return extend({ lastError: action.error, isUpdating: false, isBusy: false });
    case types.RESOURCE_PATCH_FAILURE:
      return extend({ lastError: action.error, isPatching: false, isBusy: false });
    case types.RESOURCE_REMOVE_FAILURE:
      return extend({ lastError: action.error, isRemoving: false, isBusy: false });

    case types.RESOURCE_CREATE_REQUEST:
      return extend({ isBusy: true, isCreating: true, entity: undefined, lastError: undefined });

    case types.RESOURCE_CREATE_SUCCESS:
      return resultReducers.create ?
        resultReducers.create(state, action, options) :
        extend({
          lastError: undefined,
          entity: action.result,
          isCreating: false,
          isBusy: false,
        });

    case types.RESOURCE_UPDATE_REQUEST:
      return extend({ isBusy: true, isUpdating: true, entity: undefined, lastError: undefined });

    case types.RESOURCE_UPDATE_SUCCESS:
      return resultReducers.update ?
        resultReducers.update(state, action, options) :
        extend({
          lastError: undefined,
          entity: action.result,
          isUpdating: false,
          isBusy: false,
        });

    case types.RESOURCE_PATCH_REQUEST:
      return extend({ isBusy: true, isPatching: true, entity: undefined, lastError: undefined });

    case types.RESOURCE_PATCH_SUCCESS:
      return resultReducers.patch ?
        resultReducers.patch(state, action, options) :
        extend({
          lastError: undefined,
          entity: action.result,
          isPatching: false,
          isBusy: false,
        });


    case types.RESOURCE_REMOVE_REQUEST:
      return extend({ isBusy: true, isRemoving: true, entity: undefined, lastError: undefined });

    case types.RESOURCE_REMOVE_SUCCESS:
      return resultReducers.remove ?
        resultReducers.remove(state, action, options) :
        extend({
          lastError: undefined,
          entity: action.result,
          isRemoving: false,
          isBusy: false,
        });

    default:
      return state;
  }
}

