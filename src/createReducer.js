import * as types from './types';

const initialState = {
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
};

export default function createReducer(options) {
  return (state = initialState, action) => {
    if (!action.resxns || action.resxns !== options.name) {
      return state;
    }

    return options.reducer(resourceReducer(options, state, action), action);
  };
}

function resourceReducer(options, state = initialState, action) {
  function extend(nextState) {
    return { ...state, ...nextState, options };
  }

  switch (action.type) {
    case types.RESOURCE_RESET:
      return initialState;

    case types.RESOURCE_FIND_REQUEST:
      return extend({ isBusy: true, isFinding: true, items: [], lastError: undefined });

    case types.RESOURCE_FIND_SUCCESS:
      return extend({
        hasLoaded: true,
        isBusy: false,
        isFinding: false,
        items: state.items.concat(action.result),
      });

    case types.RESOURCE_GET_REQUEST:
      return extend({ isBusy: true, isGetting: true, entity: undefined, lastError: undefined });

    case types.RESOURCE_GET_SUCCESS:
      return extend({ isBusy: false, isGetting: false, entity: action.result });

    case types.RESOURCE_FIND_FAILURE:
      return extend({ lastError: action.error, isFinding: false, isBusy: false });
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

    case types.RESOURCE_CREATE_SUCCESS:
      return extend({
        lastError: undefined,
        entity: action.result,
        isCreating: false,
        isBusy: false,
      });

    case types.RESOURCE_UPDATE_SUCCESS:
      return extend({
        lastError: undefined,
        entity: action.result,
        isUpdating: false,
        isBusy: false,
      });

    case types.RESOURCE_PATCH_SUCCESS:
      return extend({
        lastError: undefined,
        entity: action.result,
        isPatching: false,
        isBusy: false,
      });

    case types.RESOURCE_REMOVE_SUCCESS:
      return extend({
        lastError: undefined,
        entity: action.result,
        isRemoving: false,
        isBusy: false,
      });

    default:
      return state;
  }
}

