import { inspectRuntime, printRuntime } from './runtime.mjs'

const report = inspectRuntime()
printRuntime(report)
if (report.status === 'critical') process.exitCode = 1
