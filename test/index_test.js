import test from 'tape';
import createResource, {
  isRequestAction,
  isSuccessAction,
  isErrorAction,
  types,
  DEFAULT_NS,
} from '../src';
import {initialState} from '../src/createReducer';

test('createResource', t => {
  const resource = createResource({name: 'ANYTHING'});
  t.deepEquals(
    Object.keys(resource),
    ['reducer', 'name', 'default', 'create'],
    'Returns resource components'
  );

  t.equals(resource.name, 'ANYTHING', 'Returns name of resource');

  t.end();
});

test('resource.default()', t => {
  const resource = createResource({name: 'ANYTHING'});
  const instance = resource.default();
  t.equals(instance.namespace, DEFAULT_NS, 'Default namespace used for default instance');

  const instance2 = resource.default();
  t.equals(instance, instance2, 'Reuses the default instance');
  t.end();
});

test('resource.create()', t => {
  let fakeState;
  const resource = createResource({name: 'ANYTHING'});

  const defaultR = resource.create();
  t.equals(defaultR.name, 'ANYTHING', 'Correct name');
  t.equals(defaultR.namespace, DEFAULT_NS, 'Default namespace used');

  t.deepEquals(defaultR.actions.find({test: 1}).ns, DEFAULT_NS, 'Correct namespace for actions');

  fakeState = {resources: {ANYTHING: {}}};
  t.deepEquals(defaultR.selector(fakeState), initialState, 'Returns a "fake" initial state');
  fakeState = {
    resources: {
      ANYTHING: {
        [DEFAULT_NS]: {test: 'passed'},
      },
    },
  };
  t.deepEquals(defaultR.selector(fakeState), {test: 'passed'}, 'Selects the state with namespace');

  const specialNS = '@special';
  const specialR = resource.create(specialNS);
  t.equals(specialR.name, 'ANYTHING', 'Correct name');
  t.equals(specialR.namespace, specialNS, 'Correct namespace used');

  t.deepEquals(specialR.actions.find({test: 1}).ns, specialNS, 'Correct namespace for actions');
  fakeState = {
    resources: {
      ANYTHING: {
        [DEFAULT_NS]: {test: 'failed'},
        [specialNS]: {test: 'passed'},
      },
    },
  };
  t.deepEquals(specialR.selector(fakeState), {test: 'passed'}, 'Selects the state with namespace');

  t.end();
});

test('isRequestAction', t => {
  types.requestTypes.forEach(type => {
    t.ok(isRequestAction({type}), `isRequestAction is true for '${type}'`);
  });

  types.successTypes.concat(types.errorTypes).forEach(type => {
    t.notOk(isRequestAction({type}), `isRequestAction is false for '${type}'`);
  });

  t.end();
});

test('isSuccessAction', t => {
  types.successTypes.forEach(type => {
    t.ok(isSuccessAction({type}), `isSuccessAction is true for '${type}'`);
  });

  types.requestTypes.concat(types.errorTypes).forEach(type => {
    t.notOk(isSuccessAction({type}), `isSuccessAction is false for '${type}'`);
  });

  t.end();
});

test('isErrorAction', t => {
  types.errorTypes.forEach(type => {
    t.ok(isErrorAction({type}), `isErrorAction is true for '${type}'`);
  });

  types.successTypes.concat(types.requestTypes).forEach(type => {
    t.notOk(isErrorAction({type}), `isErrorAction is false for '${type}'`);
  });

  t.end();
});
