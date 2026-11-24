import { freemem } from 'node:os'
import { spawnSync } from 'node:child_process'

const positiveInteger = value => /^[1-9]\d*$/.test(value ?? '')
export function buildRuntimeEnv(source = process.env) {
  const env = { ...source }
  for (const key of ['ROLLDOWN_WORKER_THREADS', 'RAYON_NUM_THREADS']) {
    if (!positiveInteger(env[key])) env[key] = '2'
  }
  return env
}

export function assessMemory({ physicalFreeMB, commitFreeMB }) {
  if (physicalFreeMB < 128 || commitFreeMB !== null && commitFreeMB < 256) return {
    status: 'critical', message: 'Memória crítica: o limite de comprometimento/paginação do Windows ou a RAM disponível não permite iniciar o compilador com segurança.',
  }
  if (commitFreeMB === null) return { status: 'unknown', message: 'Leitura do limite de comprometimento indisponível; não é possível confirmar a disponibilidade de memória virtual.' }
  if (physicalFreeMB < 512 || commitFreeMB < 1024) return { status: 'warning', message: 'Pouca memória disponível. Evite executar vários servidores ou navegadores de teste ao mesmo tempo.' }
  return { status: 'ok', message: 'Memória disponível no momento da verificação. Esta leitura não garante disponibilidade futura.' }
}

export function inspectRuntime() {
  let commitFreeMB = null
  if (process.platform === 'win32') {
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', '(Get-CimInstance Win32_OperatingSystem).FreeVirtualMemory'], { encoding: 'utf8', timeout: 8000, windowsHide: true })
    const value = Number(result.stdout?.trim())
    if (result.status === 0 && Number.isFinite(value) && value > 0) commitFreeMB = Math.floor(value / 1024)
  }
  const memory = { physicalFreeMB: Math.floor(freemem() / 1024 ** 2), commitFreeMB }
  const env = buildRuntimeEnv()
  return { node: process.version, ...memory, ...assessMemory(memory), threads: { rolldown: env.ROLLDOWN_WORKER_THREADS, rayon: env.RAYON_NUM_THREADS } }
}

export function printRuntime(report) {
  console.log(`[ambiente] Node ${report.node}; RAM livre: ${report.physicalFreeMB} MB; comprometimento livre: ${report.commitFreeMB ?? 'não verificado'} MB.`)
  console.log(`[ambiente] Rolldown: ${report.threads.rolldown} threads; Rayon: ${report.threads.rayon} threads.`)
  console.log(`[ambiente] ${report.message}`)
  if (report.status === 'critical' || report.status === 'warning') console.log('[ambiente] Feche aplicativos não utilizados e confira se o arquivo de paginação do Windows é gerenciado pelo sistema. A configuração do Windows não é alterada por este projeto.')
}
