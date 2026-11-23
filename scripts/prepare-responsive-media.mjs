import sharp from 'sharp'
import { mkdir, stat, writeFile } from 'node:fs/promises'

// The supplied portrait remains untouched; these are only resized/encoded derivatives.
const report = []
for (const name of ['documento-relogio', 'acolhimento', 'conversa', 'livros-caneta', 'balanca', 'martelo', 'justica', 'conjunto-juridico']) {
  for (const width of [320, 640]) {
    const output = `public/images/${name}-${width}.webp`
    await sharp(`assets/originals/${name}.png`).resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 100, effort: 5 }).toFile(output)
    report.push({ file: output, width, bytes: (await stat(output)).size, hasAlpha: (await sharp(output).metadata()).hasAlpha })
  }
}
// The current brand has its own faithful preparation pipeline: prepare-brand.mjs.
for (const width of [360, 480, 640, 1050]) {
  const output = `public/images/iara-santos-${width}.webp`
  await sharp('public/images/iara-santos.png').resize({ width, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(output)
  report.push({ file: output, width, bytes: (await stat(output)).size, hasAlpha: (await sharp(output).metadata()).hasAlpha })
}
for (const name of ['contato', 'conversa', 'documentos']) {
  const output = `public/images/atendimento-${name}.webp`
  await sharp(`assets/generated/atendimento-${name}.png`)
    .resize(480, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(output)
  report.push({ file: output, width: 480, bytes: (await stat(output)).size, hasAlpha: (await sharp(output).metadata()).hasAlpha })
}
await mkdir('output/mobile-redesign', { recursive: true })
await writeFile('output/mobile-redesign/media.json', JSON.stringify(report, null, 2))
console.log(report)
