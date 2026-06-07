import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { GlyphDrift } from '../../components/GlyphDrift/GlyphDriftLazy.tsx'
import { AudioEngine } from '../../game/Audio/audioEngine.ts'
import styles from './PrologueScreen.module.css'

const PROLOGUE_LINES: string[] = [
  'It is January 2199.',
  'Twenty-five years ago, every central bank ledger on Earth was rewritten in nine hours.',
  'Nobody has ever claimed responsibility. The historians call it the October Event.',
  'The financial system collapsed in nine days. Seventy-four million people died.',
  'Four corporations whose wealth was not in cash survived. They now own more land, more people, and are responsible for more violence than every nation-state combined.',
  'The old governments are still there. Most of them do not, in any practical sense, govern anything.',
  'In the gaps between the new powers, in the unmapped places, there are people who do their work in the dark.',
  'They take contracts no one else can afford to take. They steal data. They erase identities. They sabotage. They disappear without trace.',
  'They call themselves operatives. They are the last truly independent people alive.',
  'There is a network that connects them. It is called Voidlink International.',
  'It has one contract. Four rules. They call it the Bond.',
  'You are about to sign it.',
  'Welcome to the only career in 2199 that nobody owns.',
]

const CHARS_PER_SECOND = 38  // typewriter speed
const PAUSE_BETWEEN_LINES_MS = 600
const FINAL_PAUSE_MS = 1200

// M14r — the prologue gate is "have they signed the Bond" (i.e. have they
// ever completed signup), NOT "have they seen the prologue once". This means
// the intro replays every visit until the player commits — which is correct,
// because the world setup is part of the *decision* to sign up.
export const BOND_SIGNED_KEY = 'voidlink_bond_signed'

export function PrologueScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [done, setDone] = useState(false)

  const finish = useCallback(() => {
    // Note: we do NOT set the "compact signed" flag here. The prologue is the
    // *invitation* to sign — the flag is only set when the player actually
    // completes signup. This makes the prologue replay every visit until
    // they commit, which is the intended design.
    setScreen('login')
  }, [setScreen])

  // Typewriter advance
  useEffect(() => {
    if (done) return
    if (lineIndex >= PROLOGUE_LINES.length) {
      const t = setTimeout(() => setDone(true), FINAL_PAUSE_MS)
      return () => clearTimeout(t)
    }
    const currentLine = PROLOGUE_LINES[lineIndex]
    if (charIndex < currentLine.length) {
      const t = setTimeout(() => {
        setCharIndex((c) => c + 1)
        // Morse blip on roughly every 4th character — feels like a CW radio
        // signal coming through, not a typewriter.
        if (charIndex % 4 === 0 && currentLine[charIndex] !== ' ') {
          AudioEngine.playSfx('morse')
        }
      }, 1000 / CHARS_PER_SECOND)
      return () => clearTimeout(t)
    }
    // Pause before advancing to next line
    const t = setTimeout(() => {
      setLineIndex((i) => i + 1)
      setCharIndex(0)
    }, PAUSE_BETWEEN_LINES_MS)
    return () => clearTimeout(t)
  }, [lineIndex, charIndex, done])

  // Skip on space/enter/click anywhere
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault()
        if (done) finish()
        else { setLineIndex(PROLOGUE_LINES.length); setCharIndex(0); setDone(true) }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [done, finish])

  function handleClick() {
    if (done) finish()
    else { setLineIndex(PROLOGUE_LINES.length); setCharIndex(0); setDone(true) }
  }

  return (
    <motion.main
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.6 }}
      onClick={handleClick}
    >
      <div className={styles.globe}>
        <GlyphDrift opacity={0.55} density={1.2} />
      </div>

      <div className={styles.panel}>
        <div className={styles.heading}>VOIDLINK INTERNATIONAL — OPERATIVE BRIEFING</div>

        {PROLOGUE_LINES.map((line, i) => {
          const isCurrent = i === lineIndex && !done
          const isPast = i < lineIndex || done
          const visibleText = isCurrent
            ? line.slice(0, charIndex)
            : isPast ? line : ''
          if (!isPast && !isCurrent) return null
          return (
            <div key={i} className={styles.line}>
              {visibleText}
              {isCurrent && <span className={styles.cursor}>█</span>}
            </div>
          )
        })}

        {done && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={styles.continueBtn}
            onClick={(e) => { e.stopPropagation(); finish() }}
          >
            SIGN THE BOND
          </motion.button>
        )}
      </div>

      <div className={styles.skipHint}>
        <kbd>SPACE</kbd> or click to {done ? 'continue' : 'skip'}
      </div>
    </motion.main>
  )
}
