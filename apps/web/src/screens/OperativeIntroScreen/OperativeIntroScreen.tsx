import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { GlyphDrift } from '../../components/GlyphDrift/GlyphDrift.tsx'
import { AudioEngine } from '../../game/Audio/audioEngine.ts'
import styles from './OperativeIntroScreen.module.css'

// M14r — the deep lore intro. Plays once after first signup. Mandatory on
// first run (the SKIP CHAPTER button advances within the intro, but you
// cannot exit to the desktop until the final chapter). Replayable via
// Settings → "Replay Operative Intro".
//
// Eight chapters. Each is a single screen with: motif glyph + chapter
// number + heading + body text (typewriter). Pace is deliberate — this is
// the player's induction into the world.

export const OPERATIVE_INTRO_SEEN_KEY = 'voidlink_operative_intro_seen'

interface Chapter {
  motif: string
  heading: string
  body: string
}

const CHARS_PER_SECOND = 42

function buildChapters(handle: string): Chapter[] {
  return [
    {
      motif: '✺',
      heading: 'YOU ARE BOUND',
      body:
        `${handle}.\n\n` +
        `Voidlink International confirms receipt of your hardware identity hash.\n\n` +
        `You are now an active operative on the network. The Compact you have signed is the only contract you will ever sign with us. It does not require renewal.`,
    },
    {
      motif: '◉',
      heading: 'WHERE YOU ARE',
      body:
        `You are in a one-room apartment in a dead-zone neighbourhood.\n\n` +
        `The lease is paid through a shell company. The walls are utility grey. The window faces a partially-rebuilt district under low sky. The internet connection is your Home Gateway — a standard residential Internic line registered to your civilian identity.\n\n` +
        `Most operatives will, eventually, upgrade to a Safehouse. You will too. Not tonight.`,
    },
    {
      motif: '✸',
      heading: 'WHAT YEAR IT IS',
      body:
        `It is January 2199. Twenty-five years since the October Event — the day every central bank ledger on Earth was rewritten in nine hours.\n\n` +
        `The old governments survived in name. They no longer govern. Four corporations — **Arunmor** (biotech), **Ares** (security), **Internic** (telecommunications), **Nexus** (banking) — are now larger than every country combined.\n\n` +
        `The Joint Cybersecurity Bureau — the JCB — is what passes for international law enforcement against operatives like you. They catch approximately 0.4% of us per year.\n\n` +
        `The ones they catch do not come back.`,
    },
    {
      motif: '⛓',
      heading: 'WHAT YOU DO',
      body:
        `Voidlink International is a contractor platform. Clients post contracts. Operatives — you, now — accept them. Voidlink takes twelve percent. Disputes go through Voidlink arbitration.\n\n` +
        `You will take contracts to steal files, delete accounts, corrupt databases, sabotage networks, plant evidence, perform corporate espionage. Every job leaves a trace. Every Cr you earn leaves a trail. The skill of the work is in the *not being found*.\n\n` +
        `You are not the only operative on the network. Approximately ninety thousand of us are active at any given moment. You will not meet most of them. You will hear about a few.`,
    },
    {
      motif: '⚿',
      heading: 'WHO YOU WILL HEAR FROM',
      body:
        `Several handles will reach you in your encrypted inbox over the coming sessions:\n\n` +
        `   **VoidLink Dispatch** — automated. Contract assignment.\n` +
        `   **CIPHER** — a senior operative, Underground-aligned. He will address you by your initials if he comes to trust you. He will stop greeting you if he stops.\n` +
        `   **NIGHTOWL_22** — independent broker. Lagos. Posts contracts other operatives have refused.\n` +
        `   **sys.ops** — Voidlink's internal automated billing.\n\n` +
        `Trust the tone, not the source. The tone of your inbox will tell you who you have become to the people writing to you.`,
    },
    {
      motif: '◆',
      heading: 'WHAT YOU SHOULD KNOW',
      body:
        `There is one entity in the world of 2199 that is not a person, not a corporation, not a government, and not extinct.\n\n` +
        `Its name is **REVELATION**. Arunmor built it. They claim it is contained.\n\n` +
        `It is not.\n\n` +
        `You will not encounter REVELATION yet. When you do, it will know your name. The one you do not give to clients.\n\n` +
        `Do not seek it out. It will find you.`,
    },
    {
      motif: '█',
      heading: 'WHAT YOU SHOULD DO',
      body:
        `Wake up. Check your inbox. Read your news feed. Look at the Mission Board. Build a relay chain on the World Map *before* you accept a contract — not after. Wipe your logs on every breached node. Time-stomp the wipes when you can afford the tool.\n\n` +
        `Do not bank where you breach. Pacific National has a beautiful APR and a memory like an elephant.\n\n` +
        `When the trace bar climbs past sixty percent, disconnect. The reward is not worth your career.\n\n` +
        `Sleep when you can.`,
    },
    {
      motif: '➤',
      heading: 'BEGIN',
      body:
        `The desktop is waiting.\n\n` +
        `Your first contract is in your inbox. Voidlink Dispatch has authorised it as part of your intake. CIPHER will follow up shortly after — he always does.\n\n` +
        `The world of Voidlink does not have a happy beginning or a tragic one. It has a *true* one. What you do from here is, in every sense that matters, yours.\n\n` +
        `Disconnect when you are ready.`,
    },
  ]
}

export function OperativeIntroScreen() {
  const setScreen = useGameStore((s) => s.setScreen)
  const player    = useGameStore((s) => s.player)

  const chapters = useMemo(() => buildChapters(player?.handle ?? 'OPERATIVE'), [player?.handle])

  const [chapterIndex, setChapterIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [chapterTyped, setChapterTyped] = useState(false)

  const currentChapter = chapters[chapterIndex]
  const isFinal = chapterIndex === chapters.length - 1

  const finish = useCallback(() => {
    try { localStorage.setItem(OPERATIVE_INTRO_SEEN_KEY, String(Date.now())) } catch { /**/ }
    setScreen('desktop')
  }, [setScreen])

  const advanceChapter = useCallback(() => {
    if (isFinal) {
      finish()
    } else {
      setChapterIndex((i) => i + 1)
      setCharIndex(0)
      setChapterTyped(false)
    }
  }, [isFinal, finish])

  // Typewriter
  useEffect(() => {
    if (chapterTyped) return
    if (charIndex < currentChapter.body.length) {
      const t = setTimeout(() => {
        setCharIndex((c) => c + 1)
        if (charIndex % 4 === 0 && currentChapter.body[charIndex] !== ' ') {
          AudioEngine.playSfx('tick')
        }
      }, 1000 / CHARS_PER_SECOND)
      return () => clearTimeout(t)
    }
    setChapterTyped(true)
  }, [chapterIndex, charIndex, chapterTyped, currentChapter.body])

  // Keyboard skip
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (!chapterTyped) {
          // First keypress completes the current chapter's typing
          setCharIndex(currentChapter.body.length)
          setChapterTyped(true)
        } else {
          // Second advances to next chapter
          advanceChapter()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [chapterTyped, currentChapter.body.length, advanceChapter])

  const progressPct = ((chapterIndex + (chapterTyped ? 1 : charIndex / currentChapter.body.length)) / chapters.length) * 100

  const visibleBody = chapterTyped ? currentChapter.body : currentChapter.body.slice(0, charIndex)

  // Render **bold** as cyan
  function renderBody(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>,
    )
  }

  return (
    <motion.main
      className={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.bg}>
        <GlyphDrift opacity={0.5} density={1.1} />
      </div>
      <div className={styles.scanlines} />

      <div className={styles.panel}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
        </div>

        <div className={styles.chapter}>
          CHAPTER {String(chapterIndex + 1).padStart(2, '0')} OF {String(chapters.length).padStart(2, '0')}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={chapterIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
          >
            <div className={styles.motif}>{currentChapter.motif}</div>
            <h1 className={styles.heading}>{currentChapter.heading}</h1>
            <div className={styles.body}>
              {renderBody(visibleBody)}
              {!chapterTyped && <span className={styles.cursor}>█</span>}
            </div>
          </motion.div>
        </AnimatePresence>

        {chapterTyped && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <button className={styles.continueBtn} onClick={advanceChapter}>
              {isFinal ? 'OPEN DESKTOP' : 'CONTINUE'}
            </button>
          </motion.div>
        )}
      </div>

      <div className={styles.hint}>
        <kbd>SPACE</kbd> or <kbd>ENTER</kbd> to {chapterTyped ? 'continue' : 'skip typing'}
      </div>
    </motion.main>
  )
}
