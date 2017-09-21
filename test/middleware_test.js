import test from 'tape';
import {spy} from 'sinon';
import reduxMiddleware from '../src/middleware';
import createActions from '../src/createActions';

const fakeProvider = (result, error) =>
  spy(url => {
    return error ? Promise.reject(result) : Promise.resolve(result);
  });

test('middleware', t => {
  const actions = createActions('testns', {name: 'myNS', url: '/fakers'});
  const nextFn = spy();

  let provider = fakeProvider({real: 'api', response: true});

  let middleware = reduxMiddleware({
    baseUrl: '/myapi',
    provider,
  })()(nextFn);

  middleware({type: 'something-else'});
  t.ok(nextFn.called, 'Calls next function');
  t.deepEquals(nextFn.getCall(0).args, [{type: 'something-else'}], 'Passes the action on');

  provider.reset();
  middleware(actions.find({test: true}));
  t.ok(provider.called, 'find - Calls provider');
  t.deepEquals(
    provider.getCall(0).args,
    ['/myapi/fakers?test=true', {body: undefined, method: 'GET'}],
    'find - Url is correct'
  );

  provider.reset();
  middleware(actions.get('123', {test: true}, {options: {url: '/fakers/:id', name: 'myNS'}}));
  t.ok(provider.called, 'get - Calls provider');
  t.deepEquals(
    provider.getCall(0).args,
    ['/myapi/fakers/123?test=true', {body: undefined, method: 'GET'}],
    'get - Url is correct'
  );

  provider.reset();
  middleware(actions.create({test: true}, {my: 'params'}));
  t.ok(provider.called, 'create - Calls provider');
  t.deepEquals(
    provider.getCall(0).args,
    ['/myapi/fakers?my=params', {body: '{"test":true}', method: 'POST'}],
    'create - Url is correct'
  );

  provider.reset();
  middleware(actions.update('123', {test: true}, {params: {my: 'params'}}));
  t.ok(provider.called, 'update - Calls provider');
  t.deepEquals(
    provider.getCall(0).args,
    ['/myapi/fakers?my=params', {body: '{"test":true}', method: 'PUT'}],
    'update - Url is correct'
  );

  provider.reset();
  middleware(actions.patch('123', {test: true}, {params: {my: 'params'}}));
  t.ok(provider.called, 'patch - Calls provider');
  t.deepEquals(
    provider.getCall(0).args,
    ['/myapi/fakers?my=params', {body: '{"test":true}', method: 'PATCH'}],
    'patch - Url is correct'
  );

  provider.reset();
  middleware(actions.remove('123', {test: true}, {params: {my: 'params'}}));
  t.ok(provider.called, 'remove - Calls provider');
  t.deepEquals(
    provider.getCall(0).args,
    ['/myapi/fakers?my=params', {body: '{"test":true}', method: 'DELETE'}],
    'remove - Url is correct'
  );

  t.end();
});
