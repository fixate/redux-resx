import * as types from './types';

export default function createResourceActionCreators(ns, options) {
  const { name: resxns } = options;
  return {
    reset() {
      return { type: types.RESOURCE_RESET, resxns, ns };
    },

    find(params, extra) {
      return { type: types.RESOURCE_FIND_REQUEST, resxns, ns, params, options, ...extra };
    },

    findReceive(result) {
      return { type: types.RESOURCE_FIND_SUCCESS, resxns, ns, result };
    },

    findError(error) {
      return { type: types.RESOURCE_FIND_FAILURE, resxns, ns, error };
    },

    get(id, params, extra) {
      return { type: types.RESOURCE_GET_REQUEST, resxns, ns, id, params, options, ...extra };
    },

    getReceive(result) {
      return { type: types.RESOURCE_GET_SUCCESS, resxns, ns, result };
    },

    getError(error) {
      return { type: types.RESOURCE_GET_FAILURE, resxns, ns, error };
    },

    create(data, params, extra) {
      return { type: types.RESOURCE_CREATE_REQUEST, resxns, ns, data, params, options, ...extra };
    },

    createReceive(result) {
      return { type: types.RESOURCE_CREATE_SUCCESS, resxns, ns, result };
    },

    createError(error) {
      return { type: types.RESOURCE_CREATE_FAILURE, resxns, ns, error };
    },

    update(id, data, extra) {
      return { type: types.RESOURCE_UPDATE_REQUEST, resxns, ns, id, data, options, ...extra };
    },

    updateReceive(result) {
      return { type: types.RESOURCE_UPDATE_SUCCESS, resxns, ns, result };
    },

    updateError(error) {
      return { type: types.RESOURCE_UPDATE_FAILURE, resxns, ns, error };
    },

    patch(id, data, extra) {
      return { type: types.RESOURCE_PATCH_REQUEST, resxns, ns, id, data, options, ...extra };
    },

    patchReceive(result) {
      return { type: types.RESOURCE_PATCH_SUCCESS, resxns, ns, result };
    },

    patchError(error) {
      return { type: types.RESOURCE_PATCH_FAILURE, resxns, ns, error };
    },

    remove(id, data, extra) {
      return { type: types.RESOURCE_REMOVE_REQUEST, resxns, ns, id, data, options, ...extra };
    },

    removeReceive(result) {
      return { type: types.RESOURCE_REMOVE_SUCCESS, resxns, ns, result };
    },

    removeError(error) {
      return { type: types.RESOURCE_REMOVE_FAILURE, resxns, ns, error };
    },

    destroy() {
      return { type: types.RESOURCE_DESTROY_NS, resxns, ns };
    },
  };
}

