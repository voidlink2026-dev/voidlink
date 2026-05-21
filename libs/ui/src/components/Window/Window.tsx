import { useCallback } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { clsx } from 'clsx'
import { zIndex } from '../../tokens/index.ts'
import styles from './Window.module.css'

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
  minWidth = 240,
  minHeight = 160,
  isActive = false,
  isMinimized = false,
  onFocus,
  onClose,
  onMinimize,
  className,
  zOrder = zIndex.window,
}: WindowProps) {
  const dragControls = useDragControls()

  const handlePointerDown = useCallback(() => {
    onFocus?.(id)
  }, [id, onFocus])

  if (isMinimized) return null

  return (
    <motion.div
      className={clsx(styles.window, isActive && styles.active, className)}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: initialX, y: initialY, opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.12 }}
      style={{
        width: initialWidth,
        minWidth,
        minHeight,
        zIndex: zOrder,
      }}
      onPointerDown={handlePointerDown}
      role="dialog"
      aria-label={title}
      aria-modal="false"
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
      <div className={styles.content} style={{ minHeight }}>
        {children}
      </div>

      {/* Active glow border */}
      {isActive && <div className={styles.activeBorder} aria-hidden="true" />}
    </motion.div>
  )
}
