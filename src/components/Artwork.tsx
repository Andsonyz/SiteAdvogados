import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { PointerEvent } from 'react'
import type { MediaAsset } from '../data/site'

export default function Artwork({ asset, className = '', depth = false }: { asset: MediaAsset; className?: string; depth?: boolean }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 130, damping: 24 })
  const smoothY = useSpring(y, { stiffness: 130, damping: 24 })
  useEffect(() => { if (reduced) { x.set(0); y.set(0) } }, [reduced, x, y])
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!depth || reduced || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - box.left) / box.width - 0.5) * 12)
    y.set(((event.clientY - box.top) / box.height - 0.5) * 10)
  }
  return <div className={`artwork ${className}`} onPointerMove={onPointerMove} onPointerLeave={() => { x.set(0); y.set(0) }}>
    <motion.img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading="lazy" decoding="async" draggable={false} style={depth ? (reduced ? { x: 0, y: 0 } : { x: smoothX, y: smoothY }) : undefined} />
  </div>
}
