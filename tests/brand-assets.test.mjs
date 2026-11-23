import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import sharp from 'sharp'

test('brand masters retain transparent background and solid lettering', async () => {
  for (const name of ['marfim', 'vinho']) {
    const path = `assets/brand/marca-iara-${name}.png`
    assert.ok(existsSync(path), `Missing prepared brand: ${path}`)
    const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    let empty = 0, solid = 0
    for (let i = 3; i < data.length; i += 4) { if (data[i] === 0) empty++; if (data[i] === 255) solid++ }
    assert.ok(empty > info.width * info.height * .5, 'The uniform background must be transparent')
    assert.ok(solid > 5000, 'The original solid lettering must remain present')
  }
})

test('prepared mark recomposes faithfully over the original wine background', async () => {
  assert.ok(existsSync('assets/brand/manifest.json'), 'Missing source/crop manifest')
  const manifest = JSON.parse(readFileSync('assets/brand/manifest.json', 'utf8'))
  const { data: source } = await sharp('assets/brand/referencia-original.png').extract(manifest.fullCrop).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { data: mark } = await sharp('assets/brand/marca-iara-marfim.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let error = 0
  for (let i = 0; i < source.length / 3; i++) {
    const alpha = mark[i * 4 + 3] / 255
    for (let c = 0; c < 3; c++) error += Math.abs(source[i * 3 + c] - (mark[i * 4 + c] * alpha + manifest.background[c] * (1 - alpha)))
  }
  assert.ok(error / source.length < 1.5, `Recomposition error too high: ${error / source.length}`)
})

test('responsive variants retain alpha and the source aspect ratio', async () => {
  assert.ok(existsSync('assets/brand/marca-iara-marfim.png'), 'Missing master')
  const master = await sharp('assets/brand/marca-iara-marfim.png').metadata()
  for (const name of ['marfim', 'vinho']) for (const width of [192, 384, 768]) {
    const path = `public/images/marca-iara-${name}-${width}.webp`
    assert.ok(existsSync(path), `Missing responsive brand: ${path}`)
    const meta = await sharp(path).metadata()
    assert.equal(meta.width, width)
    assert.equal(meta.hasAlpha, true)
    assert.ok(Math.abs(meta.height - width * master.height / master.width) < 1)
  }
})
