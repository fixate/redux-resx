import createActions from './createActions';
import * as types from './types';
import { isRequestAction } from './';

const { encodeURIComponent, fetch } = global;

const defaultOptions = {
  baseUrl: '',
  provider: fetch,
};

function pathJoin(...paths) {
  return paths
    .map((path, i) => {
      let p = path;
      if (i > 0 && p[0] === '/') {
        p = p.slice(1);
      }
      if (p[p.length - 1] === '/') {
        p = p.slice(0, p.length - 1);
      }
      return p;
    }).join('/');
}

function getQueryString(query) {
  return Object.keys(query)
    .reduce((acc, k) => acc.concat(`${k}=${encodeURIComponent(query[k])}`), [])
    .join('&');
}

const API_ACTIONS = {
  [types.RESOURCE_FIND_REQUEST]: ['GET', 'findReceive', 'findError'],
  [types.RESOURCE_GET_REQUEST]: ['GET', 'getReceive', 'getError'],
  [types.RESOURCE_CREATE_REQUEST]: ['POST', 'createReceive', 'createError'],
  [types.RESOURCE_UPDATE_REQUEST]: ['PUT', 'updateReceive', 'updateError'],
  [types.RESOURCE_PATCH_REQUEST]: ['PATCH', 'patchReceive', 'patchError'],
  [types.RESOURCE_REMOVE_REQUEST]: ['DELETE', 'removeReceive', 'removeError'],
};

function substitute(url, params) {
  if (!params) return url;
  const urlParts = url.split('/');
  return urlParts.map(part => (
    part[0] === ':' ? encodeURIComponent((params[part.substring(1)] || part)) : part)
  ).join('/');
}

export default function createApiMiddleware(opts) {
  const options = Object.assign({}, defaultOptions, opts);

  function getUrl(pUrl, params, query) {
    const url = substitute(pUrl, params);
    let result;

    if (options.baseUrl) {
      result = url ? pathJoin(options.baseUrl, url) : options.baseUrl;
    } else {
      result = url;
    }

    const queryStr = getQueryString(query);
    if (!queryStr) {
      return result;
    }

    return `${result}?${queryStr}`;
  }

  return () => next => (action) => {
    if (!isRequestAction(action)) {
      return next(action);
    }

    const actions = createActions({ name: action.resxns });
    const { data, params, request, id, options: actionOptions } = action;
    const { url, params: baseParams, request: baseRequest } = actionOptions;
    const [method, receiverMethod, errorMethod] = API_ACTIONS[action.type];

    return options.provider(getUrl(url, { id }, Object.assign({}, baseParams, params)), {
      method,
      body: JSON.stringify(data),
      ...Object.assign({}, baseRequest, request),
    })
      .then(r => r.json())
      .then((result) => {
        const receiverFn = actions[receiverMethod];
        next(receiverFn(result));
        return result;
      })
      .catch((err) => {
        const errorFn = actions[errorMethod];
        next(errorFn(err));
        return Promise.reject(err);
      });
  };
}
