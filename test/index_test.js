import test from 'tape';
import createResource, { isRequestAction, isSuccessAction, isErrorAction, types } from '../src';

test('createResource', t => {
  const resource = createResource({ name: 'ANYTHING' });
  t.deepEquals(
    Object.keys(resource),
    ['actions', 'reducer', 'name', 'selector'],
    'Returns resource components'
  );

  t.equals(resource.name, 'ANYTHING', 'Returns name of resource');

  t.end();
});

test('isRequestAction', t => {
  types.requestTypes.forEach((type) => {
    t.ok(isRequestAction({ type }), `isRequestAction is true for '${type}'`);
  });

  types.successTypes.concat(types.errorTypes).forEach((type) => {
    t.notOk(isRequestAction({ type }), `isRequestAction is false for '${type}'`);
  });

  t.end();
});

test('isSuccessAction', t => {
  types.successTypes.forEach((type) => {
    t.ok(isSuccessAction({ type }), `isSuccessAction is true for '${type}'`);
  });

  types.requestTypes.concat(types.errorTypes).forEach((type) => {
    t.notOk(isSuccessAction({ type }), `isSuccessAction is false for '${type}'`);
  });

  t.end();
});

test('isErrorAction', t => {
  types.errorTypes.forEach((type) => {
    t.ok(isErrorAction({ type }), `isErrorAction is true for '${type}'`);
  });

  types.successTypes.concat(types.requestTypes).forEach((type) => {
    t.notOk(isErrorAction({ type }), `isErrorAction is false for '${type}'`);
  });

  t.end();
});
