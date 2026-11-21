// Web demo: the AI search off the UI thread (lib/web_demo/engine_search.dart).
// Its own engine instance (own wasm memory), so no SharedArrayBuffer, threads
// or COOP/COEP are needed. The engine is rust/src/web_worker.rs `web_search`.
// In:  [id, pos[15], timeMs, threads, repetition[], cashBonus, quietPlies]
// Out: [id, bestMove, score, depth, nodes, threadsUsed]  or  [id, 'error', msg]
importScripts('pkg/three_pebbles_engine.js');
const ready = wasm_bindgen({ module_or_path: 'pkg/three_pebbles_engine_bg.wasm' });
const big = (xs) => BigInt64Array.from(xs, (x) => BigInt(Math.trunc(x)));
onmessage = async (e) => {
  const [id, pos, timeMs, threads, rep, cash, quiet] = e.data;
  try {
    await ready;
    const r = wasm_bindgen.web_search(big(pos), timeMs, threads, big(rep), cash, quiet);
    postMessage([id, ...Array.from(r, Number)]);
  } catch (err) {
    postMessage([id, 'error', String(err)]);
  }
};
