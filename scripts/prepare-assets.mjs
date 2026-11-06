// Lossless originals are retained; only format/size optimization is applied to production files.
import sharp from 'sharp'
import { copyFile, mkdir, writeFile, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const entries = [
  ['documento-relogio', 'Documento com relógio de aposentadoria.png', 900],
  ['acolhimento', 'Mãos acolhendo figuras humanas.png', 900],
  ['conversa', 'Balões de conversa jurídica.png', 900],
  ['livros-caneta', 'Livros jurídicos com caneta-tinteiro.png', 1100],
  ['balanca', 'Balança da justiça em latão envelhecido.png', 850],
  ['martelo', 'Martelo de julgamento em nogueira.png', 1100],
  ['justica', 'Justiça em bronze com balança e espada.png', 800],
  ['conjunto-juridico', 'Balança jurídica, livros e caneta-tinteiro.png', 1100],
]
await mkdir('assets/originals', { recursive: true })
await mkdir('output/qa', { recursive: true })
const inventory = []
for (const [id, name, maxWidth] of entries) {
  const original = `assets/originals/${id}.png`
  // Repeat from the retained originals if the Downloads folder is no longer available.
  try { await copyFile(path.join('C:/Users/anton/Downloads', name), original) } catch (error) { if (error.code !== 'ENOENT') throw error }
  const buffer = await readFile(original)
  const before = await sharp(buffer).metadata()
  const output = `public/images/${id}.webp`
  await sharp(buffer).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(output)
  const after = await sharp(output).metadata()
  const { data, info } = await sharp(output).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let x0=info.width,y0=info.height,x1=0,y1=0, transparent=0, opaque=0
  for (let y=0; y<info.height; y++) for (let x=0; x<info.width; x++) {
    const a=data[(y*info.width+x)*4+3]
    if (a===0) transparent++
    if (a===255) opaque++
    if (a>16) { x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y) }
  }
  inventory.push({ id, originalName:name, originalSize:[before.width,before.height], size:[after.width,after.height], sourceBytes:buffer.length, outputBytes:(await readFile(output)).length, hasAlpha:after.hasAlpha, transparent, opaque, contentBounds:[x0,y0,x1,y1], sourceSha256:createHash('sha256').update(buffer).digest('hex') })
}
// Preserve every original portrait pixel, including alpha and the face. No resizing or generative edit.
await sharp('public/images/iara-santos.png').webp({lossless:true,effort:6}).toFile('public/images/iara-santos.webp')
await sharp('public/images/iara-santos-logo.png').resize({width:512}).webp({lossless:true,effort:6}).toFile('public/images/iara-santos-logo.webp')
await writeFile('assets/inventory.json',JSON.stringify(inventory,null,2)+'\n')
await writeFile('output/qa/alpha-comparison.html',`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Comparação de alfa</title><style>body{font:16px sans-serif;margin:24px;background:#ddd}article{margin-bottom:30px}h2{font-size:18px}.row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.sample{padding:10px}.sample:nth-child(odd){background:#f4ede3}.sample:nth-child(even){background:#35251f;color:#f4ede3}img{display:block;width:100%;height:230px;object-fit:contain}</style><h1>Originais × WebP sobre marfim e marrom</h1>${inventory.map(item=>`<article><h2>${item.originalName}</h2><div class="row"><div class="sample">Original / marfim<img src="/assets/originals/${item.id}.png"></div><div class="sample">Original / marrom<img src="/assets/originals/${item.id}.png"></div><div class="sample">WebP / marfim<img src="/images/${item.id}.webp"></div><div class="sample">WebP / marrom<img src="/images/${item.id}.webp"></div></div></article>`).join('')}</html>`)
const comparison = await readFile('output/qa/alpha-comparison.html', 'utf8')
await writeFile('output/qa/alpha-comparison.html', comparison + ['iara-santos', 'iara-santos-logo'].map(id => `<article><h2>${id}</h2><div class="row"><div class="sample">PNG / marfim<img src="/images/${id}.png"></div><div class="sample">PNG / marrom<img src="/images/${id}.png"></div><div class="sample">WebP / marfim<img src="/images/${id}.webp"></div><div class="sample">WebP / marrom<img src="/images/${id}.webp"></div></div></article>`).join(''))
console.log(JSON.stringify(inventory.map(({id,size,sourceBytes,outputBytes,hasAlpha,contentBounds})=>({id,size,sourceBytes,outputBytes,hasAlpha,contentBounds}))))
