import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adquirirAtualizacao, executarFila } from './filaCfcs.ts';

const deferred = () => {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  return { promise, resolve };
};
const flush = () => new Promise(r => setImmediate(r));
const options = (extra = {}) => ({
  itens: [1, 2, 3], signal: new AbortController().signal,
  atualizar: async item => item, aoIniciar() {}, aoConcluir() {}, ...extra,
});

test('strict sequence, progress and interval only between completed items', async () => {
  const writes = [deferred(), deferred(), deferred()];
  const pauses = [deferred(), deferred()];
  const started = [], completed = [];
  let intervals = 0;
  const run = executarFila(options({
    atualizar: item => { started.push(item); return writes[item - 1].promise; },
    aoConcluir: (item, count) => completed.push([item, count]),
    esperar: () => pauses[intervals++].promise,
  }));
  assert.deepEqual(started, [1]);
  writes[0].resolve(1); await flush();
  assert.deepEqual(started, [1]);
  assert.deepEqual(completed, [[1, 1]]);
  pauses[0].resolve(); await flush();
  assert.deepEqual(started, [1, 2]);
  writes[1].resolve(2); await flush();
  pauses[1].resolve(); await flush();
  writes[2].resolve(3);
  assert.deepEqual(await run, { feitos: 3, cancelado: false });
  assert.deepEqual(completed, [[1, 1], [2, 2], [3, 3]]);
  assert.equal(intervals, 2);
});

test('cancel/unmount waits for active write and retains its completion', async () => {
  const controller = new AbortController(), write = deferred();
  const started = [], completed = [];
  let settled = false;
  const run = executarFila(options({ signal: controller.signal,
    atualizar: item => { started.push(item); return write.promise; },
    aoConcluir: item => completed.push(item),
  })).finally(() => { settled = true; });
  controller.abort(); await flush();
  assert.equal(settled, false);
  write.resolve(1);
  assert.deepEqual(await run, { feitos: 1, cancelado: true });
  assert.deepEqual(started, [1]); assert.deepEqual(completed, [1]);
});

test('cancel during real interval prevents next write promptly', async () => {
  const controller = new AbortController();
  const started = [];
  const run = executarFila(options({ signal: controller.signal,
    atualizar: async item => { started.push(item); return item; },
  }));
  await flush(); controller.abort();
  assert.deepEqual(await run, { feitos: 1, cancelado: true });
  assert.deepEqual(started, [1]);
});

test('default interval is five seconds', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const started = [];
  const run = executarFila(options({ itens: [1, 2],
    atualizar: async item => { started.push(item); return item; },
  }));
  await flush(); t.mock.timers.tick(4999); await flush();
  assert.deepEqual(started, [1]);
  t.mock.timers.tick(1); await run;
  assert.deepEqual(started, [1, 2]);
});

test('uncertain write error stops queue without retry', async () => {
  const started = [], completed = [];
  await assert.rejects(executarFila(options({
    atualizar: async item => { started.push(item); if (item === 2) throw new Error('PUT incerto'); return item; },
    aoConcluir: item => completed.push(item), esperar: async () => {},
  })), /PUT incerto/);
  assert.deepEqual(started, [1, 2]); assert.deepEqual(completed, [1]);
});

test('shared lock blocks individual updates and remounted queues until settlement', async () => {
  const release = adquirirAtualizacao();
  const controller = new AbortController(), write = deferred();
  const run = executarFila(options({ signal: controller.signal, atualizar: () => write.promise })).finally(release);
  assert.equal(adquirirAtualizacao(), null);
  controller.abort(); await flush();
  assert.equal(adquirirAtualizacao(), null);
  write.resolve(1); await run;
  const next = adquirirAtualizacao(); assert.equal(typeof next, 'function'); next();
});

test('pre-cancelled queue never starts', async () => {
  const controller = new AbortController(); controller.abort();
  const result = await executarFila(options({ signal: controller.signal, atualizar: () => assert.fail('started') }));
  assert.equal(result.feitos, 0);
});

