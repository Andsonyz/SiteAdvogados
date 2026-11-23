import sharp from 'sharp'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'

// The approved mark is never redrawn. Recover its alpha from the two source colors.
const directory = 'assets/brand'
await mkdir(directory, { recursive: true })
await mkdir('public/images', { recursive: true })
const sourcePath = `${directory}/referencia-original.png`
if (process.argv[2]) await copyFile(process.argv[2], sourcePath)
const background = [101, 61, 61] // #653D3D, sampled from the supplied reference.
const foreground = [243, 237, 223] // #F3EDDF.
const delta = foreground.map((v, c) => v - background[c])
const denominator = delta.reduce((sum, v) => sum + v * v, 0)
const { data, info } = await sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const alpha = new Uint8Array(info.width * info.height)
for (let i = 0; i < alpha.length; i++) {
  const projection = delta.reduce((sum, v, c) => sum + (data[i * 3 + c] - background[c]) * v, 0) / denominator
  alpha[i] = projection < .02 ? 0 : Math.round(Math.min(1, projection) * 255)
}
function bounds(region, padding) {
  let left = info.width, top = info.height, right = 0, bottom = 0
  for (let y = region.top; y < region.top + region.height; y++) for (let x = region.left; x < region.left + region.width; x++) {
    if (alpha[y * info.width + x] < 24) continue
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y)
  }
  left = Math.max(0, left - padding); top = Math.max(0, top - padding)
  right = Math.min(info.width - 1, right + padding); bottom = Math.min(info.height - 1, bottom + padding)
  return { left, top, width: right - left + 1, height: bottom - top + 1 }
}
const fullCrop = bounds({ left: 0, top: 0, width: info.width, height: info.height }, 18)
// This region contains only the original IS, above the name and signature.
const monogramCrop = bounds({ left: 500, top: 260, width: 600, height: 360 }, 18)
function raster(color) {
  const output = Buffer.alloc(info.width * info.height * 4)
  for (let i = 0; i < alpha.length; i++) {
    for (let c = 0; c < 3; c++) output[i * 4 + c] = color[c]
    output[i * 4 + 3] = alpha[i]
  }
  return sharp(output, { raw: { width: info.width, height: info.height, channels: 4 } })
}
for (const [name, color] of [['marfim', foreground], ['vinho', background]]) {
  const master = await raster(color).extract(fullCrop).png().toBuffer()
  await writeFile(`${directory}/marca-iara-${name}.png`, master)
  for (const width of [192, 384, 768]) await sharp(master).resize({ width, withoutEnlargement: true }).webp({ quality: 95, alphaQuality: 100, effort: 6 }).toFile(`public/images/marca-iara-${name}-${width}.webp`)
}
const monogram = await raster(foreground).extract(monogramCrop).png().toBuffer()
await writeFile(`${directory}/monograma-original.png`, monogram)
const icon = await sharp(monogram).resize({ width: 96, height: 96, fit: 'contain', background: '#00000000' }).png().toBuffer()
await writeFile('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="6" fill="#653d3d"/><image x="6" y="6" width="52" height="52" href="data:image/png;base64,${icon.toString('base64')}"/></svg>\n`)
const manifest = { source: 'referencia-original.png', background, foreground, fullCrop, monogramCrop, responsiveWidths: [192, 384, 768], method: 'Two-color alpha projection; no regenerated or redrawn glyphs.' }
await writeFile(`${directory}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify(manifest))
