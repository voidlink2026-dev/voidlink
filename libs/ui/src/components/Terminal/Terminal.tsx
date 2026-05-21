import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import styles from './Terminal.module.css'

export type TerminalLineType = 'output' | 'input' | 'error' | 'success' | 'system' | 'dim'

export interface TerminalLine {
  id: string
  type: TerminalLineType
  text: string
  timestamp?: number
}

export interface TerminalProps {
  lines: TerminalLine[]
  prompt?: string
  inputValue?: string
  onInputChange?: (value: string) => void
  onInputSubmit?: (value: string) => void
  className?: string
  autoScroll?: boolean
}

export function Terminal({
  lines,
  prompt = '> ',
  inputValue = '',
  onInputChange,
  onInputSubmit,
  className,
  autoScroll = true,
}: TerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines, autoScroll])

  return (
    <div
      className={clsx(styles.terminal, className)}
      onClick={() => inputRef.current?.focus()}
      role="log"
      aria-live="polite"
      aria-label="Terminal output"
    >
      <div ref={scrollRef} className={styles.output}>
        {lines.map((line) => (
          <div key={line.id} className={clsx(styles.line, styles[line.type])}>
            {line.type === 'input' && <span className={styles.inputPrefix}>{prompt}</span>}
            <span>{line.text}</span>
          </div>
        ))}
      </div>

      {onInputChange && (
        <div className={styles.inputRow}>
          <span className={styles.promptLabel} aria-hidden="true">
            {prompt}
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onInputSubmit) {
                onInputSubmit(inputValue)
              }
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
          />
          <span className={styles.cursor} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
