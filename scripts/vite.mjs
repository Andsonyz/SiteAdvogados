import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { buildRuntimeEnv, inspectRuntime, printRuntime } from './runtime.mjs'

const report = inspectRuntime()
printRuntime(report)
if (report.status === 'critical') process.exit(1)

// Configure native pools before importing Vite or any Rust-based plugin.
const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)), ...process.argv.slice(2)], {
  cwd: fileURLToPath(new URL('..', import.meta.url)), env: buildRuntimeEnv(), stdio: 'inherit', windowsHide: true,
})
let stopping = false
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { stopping = true; child.kill(signal) })
child.once('error', error => { console.error(`Não foi possível iniciar o Vite: ${error.message}`); process.exitCode = 1 })
child.once('exit', (code, signal) => {
  if (!stopping && (code !== 0 || signal)) console.error('O Vite encerrou com erro. Execute npm run doctor e confira os recursos disponíveis antes de tentar novamente.')
  process.exitCode = stopping ? 0 : code ?? 1
})
