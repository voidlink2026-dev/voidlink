import { useCallback, useState, useRef } from 'react'
import { motion, useDragControls, useMotionValue } from 'framer-motion'
import { clsx } from 'clsx'
import { zIndex } from '../../tokens/index.ts'
import styles from './Window.module.css'

type ResizeDir = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: 'ns-resize', ne: 'nesw-resize', e: 'ew-resize', se: 'nwse-resize',
  s: 'ns-resize', sw: 'nesw-resize', w: 'ew-resize', nw: 'nwse-resize',
}

export interface WindowProps {
  id: string
  title: string
  children: React.ReactNode
  initialX?: number
  initialY?: number
  initialWidth?: number
  initialHeight?: number
  minWidth?: number
  minHeight?: number
  isActive?: boolean
  isMinimized?: boolean
  onFocus?: (id: string) => void
  onClose?: (id: string) => void
  onMinimize?: (id: string) => void
  onMove?: (id: string, x: number, y: number, width: number, height: number) => void
  className?: string
  zOrder?: number
}

export function Window({
  id,
  title,
  children,
  initialX = 100,
  initialY = 100,
  initialWidth = 480,
  initialHeight = 400,
  minWidth = 240,
  minHeight = 160,
  isActive = false,
  isMinimized = false,
  onFocus,
  onClose,
  onMinimize,
  onMove,
  className,
  zOrder = zIndex.window,
}: WindowProps) {
  const dragControls = useDragControls()
  const motionX = useMotionValue(initialX)
  const motionY = useMotionValue(initialY)
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const sizeRef = useRef(size)
  sizeRef.current = size

  const handlePointerDown = useCallback(() => {
    onFocus?.(id)
  }, [id, onFocus])

  function startResize(e: React.PointerEvent, dir: ResizeDir) {
    e.stopPropagation()
    e.preventDefault()
    const startClientX = e.clientX
    const startClientY = e.clientY
    const startW = sizeRef.current.width
    const startH = sizeRef.current.height
    const startX = motionX.get()
    const startY = motionY.get()

    function onPointerMove(me: PointerEvent) {
      const dx = me.clientX - startClientX
      const dy = me.clientY - startClientY
      let newW = startW
      let newH = startH
      let newX = startX
      let newY = startY

      if (dir.includes('e')) newW = Math.max(minWidth, startW + dx)
      if (dir.includes('s')) newH = Math.max(minHeight, startH + dy)
      if (dir.includes('w')) {
        newW = Math.max(minWidth, startW - dx)
        newX = startX + (startW - newW)
      }
      if (dir.includes('n')) {
        newH = Math.max(minHeight, startH - dy)
        newY = startY + (startH - newH)
      }

      motionX.set(newX)
      motionY.set(newY)
      setSize({ width: newW, height: newH })
      sizeRef.current = { width: newW, height: newH }
    }

    function onUp() {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onUp)
      // Persist the new size + position once the resize gesture finishes
      onMove?.(id, motionX.get(), motionY.get(), sizeRef.current.width, sizeRef.current.height)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onUp)
  }

  if (isMinimized) return null

  return (
    <motion.div
      className={clsx(styles.window, isActive && styles.active, className)}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      style={{
        x: motionX,
        y: motionY,
        width: size.width,
        height: size.height,
        minWidth,
        minHeight,
        zIndex: zOrder,
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.12 }}
      onPointerDown={handlePointerDown}
      onDragEnd={() => onMove?.(id, motionX.get(), motionY.get(), sizeRef.current.width, sizeRef.current.height)}
      role="dialog"
      aria-label={title}
      aria-modal="false"
      data-window-id={id}
    >
      {/* Title bar — drag handle */}
      <div
        className={styles.titleBar}
        onPointerDown={(e) => dragControls.start(e)}
        style={{ cursor: 'grab' }}
      >
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          {onMinimize && (
            <button
              className={clsx(styles.controlBtn, styles.minimize)}
              onClick={() => onMinimize(id)}
              aria-label={`Minimize ${title}`}
            />
          )}
          {onClose && (
            <button
              className={clsx(styles.controlBtn, styles.close)}
              onClick={() => onClose(id)}
              aria-label={`Close ${title}`}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Resize handles — all 8 edges/corners */}
      {(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as ResizeDir[]).map((dir) => (
        <div
          key={dir}
          className={`${styles.resizeHandle} ${styles[`resize_${dir}`]}`}
          style={{ cursor: RESIZE_CURSORS[dir] }}
          onPointerDown={(e) => startResize(e, dir)}
        />
      ))}

      {/* Active glow border */}
      {isActive && <div className={styles.activeBorder} aria-hidden="true" />}
    </motion.div>
  )
}
