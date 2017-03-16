import * as types from './types';

export default function createResourceActionCreators(options) {
  const { name: resxns } = options;
  return {
    reset() {
      return { type: types.RESOURCE_RESET, resxns };
    },

    find(params, extra) {
      return { type: types.RESOURCE_FIND_REQUEST, resxns, params, options, ...extra };
    },

    findReceive(result) {
      return { type: types.RESOURCE_FIND_SUCCESS, resxns, result };
    },

    findError(error) {
      return { type: types.RESOURCE_FIND_FAILURE, resxns, error };
    },

    get(id, params, extra) {
      return { type: types.RESOURCE_GET_REQUEST, resxns, id, params, options, ...extra };
    },

    getReceive(result) {
      return { type: types.RESOURCE_GET_SUCCESS, resxns, result };
    },

    getError(error) {
      return { type: types.RESOURCE_GET_FAILURE, resxns, error };
    },

    create(data, params, extra) {
      return { type: types.RESOURCE_CREATE_REQUEST, resxns, data, params, options, ...extra };
    },

    createReceive(result) {
      return { type: types.RESOURCE_CREATE_SUCCESS, resxns, result };
    },

    createError(error) {
      return { type: types.RESOURCE_CREATE_FAILURE, resxns, error };
    },

    update(id, data, extra) {
      return { type: types.RESOURCE_UPDATE_REQUEST, resxns, id, data, options, ...extra };
    },

    updateReceive(result) {
      return { type: types.RESOURCE_UPDATE_SUCCESS, resxns, result };
    },

    updateError(error) {
      return { type: types.RESOURCE_UPDATE_FAILURE, resxns, error };
    },

    patch(id, data, extra) {
      return { type: types.RESOURCE_UPDATE_REQUEST, resxns, id, data, options, ...extra };
    },

    patchReceive(result) {
      return { type: types.RESOURCE_UPDATE_SUCCESS, resxns, result };
    },

    patchError(error) {
      return { type: types.RESOURCE_UPDATE_FAILURE, resxns, error };
    },

    remove(id, extra) {
      return { type: types.RESOURCE_REMOVE_REQUEST, resxns, id, options, ...extra };
    },

    removeReceive(result) {
      return { type: types.RESOURCE_REMOVE_SUCCESS, resxns, result };
    },

    removeError(error) {
      return { type: types.RESOURCE_REMOVE_FAILURE, resxns, error };
    },
  };
}

