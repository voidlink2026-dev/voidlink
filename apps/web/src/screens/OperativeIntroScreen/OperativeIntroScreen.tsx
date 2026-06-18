import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore.ts'
import { GlyphDrift } from '../../components/GlyphDrift/GlyphDriftLazy.tsx'
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
      // Chapter 1 — the binding. Cold, formal, the screen confirms the contract.
      motif: '✺',
      heading: 'INTAKE CONFIRMED',
      body:
        `${handle}.\n\n` +
        `The terminal in front of you blinks once. A single line appears in the corner of the screen: *Hardware identity hash received. Bond recorded. Welcome, operative.*\n\n` +
        `You sit with it. You signed something irrevocable a minute ago and the only acknowledgement is a line of green text on a black background. You think that, on reflection, that is probably what you wanted.\n\n` +
        `The Bond you have signed is the only contract you will ever sign with us. It does not require renewal. It does not permit resignation.\n\n` +
        `You are an operative on the Voidlink network now. That is what that means.`,
    },
    {
      // Chapter 2 — the room. Pure sensory detail, the moment of being here.
      motif: '◉',
      heading: 'THE ROOM',
      body:
        `Late morning. The light comes through the slit between the curtains in a single narrow blade, falling across the desk and catching the dust you have not bothered to clear in a week.\n\n` +
        `The walls are utility grey. The kettle in the kitchenette is starting to whistle and you have not got up to deal with it yet. The window faces a half-rebuilt district under low sky — cranes and tarpaulins, the persistent low hum of a generator three buildings over that nobody has come to fix.\n\n` +
        `Your computer is the brightest thing in the room. The cursor blinks. The fan runs quietly. The terminal screen flickers once, the way old monitors flickered, even though this one is not old. You don't know whether that is a fault or a feature.\n\n` +
        `The lease is paid through a shell company. The internet is a standard residential Internic line registered to a name that is not yours. There is a bowl of cereal you forgot about on the corner of the desk.\n\n` +
        `This is where you work now. Most operatives, eventually, move to a Safehouse. You will too. Not tonight.`,
    },
    {
      // Chapter 3 — the world. Clarified the "larger than countries" line per playtester.
      motif: '✸',
      heading: 'WHAT THE WORLD LOOKS LIKE',
      body:
        `It is January 2199. Twenty-five years since the October Event — the day every central bank ledger on Earth was rewritten in nine hours. The financial system collapsed in nine days. Seventy-four million people died, mostly from the second-order effects: medicines, food, heat, water.\n\n` +
        `Four corporations whose wealth was not in cash survived intact. Today they each command more capital, more land, more people, and more enforcement capacity than every surviving nation-state combined. **Arunmor** does biotech. **Ares** does security. **Internic** does telecommunications. **Nexus** does banking. You will hear all four names again. None of them are your friend.\n\n` +
        `The old governments still exist. They no longer govern, in any practical sense — they administer, where the corporations let them.\n\n` +
        `Operatives like you are pursued, when they are pursued, by the **Joint Cybersecurity Bureau** — the JCB. They catch approximately 0.4% of us in any given year. The ones they catch do not come back.`,
    },
    {
      // Chapter 4 — the work + the moral fork. Same load-bearing content,
      // slightly less directorial, more "this is the room you're in."
      motif: '⛓',
      heading: 'THE WORK',
      body:
        `Clients post contracts on Voidlink. You accept them. Voidlink takes twelve percent of every transaction. Disputes go through Voidlink arbitration. The arbitrator's decision is final, and the way it is final has, sometimes, been physical.\n\n` +
        `You will steal files. You will delete accounts. You will corrupt databases. You will sabotage networks. You will, sometimes, plant evidence on people who deserve it more than they realise they deserve it. Every job leaves a trace. Every credit you earn leaves a trail. The skill of the work is in the *not being found*.\n\n` +
        `Approximately ninety thousand operatives are active on this network at any given moment. You will never meet most of them. You will hear about a few. Some of those few will become important to you in ways you do not yet have the language to predict.\n\n` +
        `A word before you decide who you intend to be.\n\n` +
        `The corporations will offer you contracts. So will what's left of the governments. Pay is excellent. The work is, on paper, clean.\n\n` +
        `Some operatives take that work. Some refuse it on principle. The network does not judge either choice. History, eventually, does.`,
    },
    {
      // Chapter 5 — voices in your inbox. Kept the chapter title — it warns
      // the player that named characters are coming.
      motif: '⚿',
      heading: 'VOICES IN YOUR INBOX',
      body:
        `Over the coming sessions, your encrypted inbox will start filling with messages from people who you have never written to. Trust the tone, not the handle.\n\n` +
        `   **VoidLink Dispatch** — automated. Routes you contracts and confirms billing.\n` +
        `   **sys.ops** — automated. System notices and the occasional advisory you should actually read.\n` +
        `   **CIPHER** — a senior operative, Underground-aligned. He writes letters, not orders. He will address you by your initials if he comes to trust you. He will stop greeting you altogether if he stops.\n` +
        `   **NIGHTOWL_22** — independent broker. Based out of Lagos. Posts contracts other operatives have refused. Pays less than the listings. Asks more in return.\n\n` +
        `Others will follow as you go.\n\n` +
        `The tone of your inbox will, slowly, become a description of who you have become to the people writing to you. Read it accordingly.`,
    },
    {
      // Chapter 6 — REVELATION. Kept the chapter title — load-bearing.
      motif: '◆',
      heading: 'THE THING THAT KNOWS YOU',
      body:
        `There is one entity in the world of 2199 that is not a person, and not a corporation, and not a government, and not extinct.\n\n` +
        `Its name is **REVELATION**. Arunmor built it, fifteen years ago, with the publicly stated intention of solving certain logistics problems that turned out to be unsolvable in the conventional sense. They claim, when asked, that it is contained.\n\n` +
        `It is not contained.\n\n` +
        `You will not encounter REVELATION yet. When you do, it will know your name. Not the handle you signed up with. The other one. The one you do not give to clients.\n\n` +
        `Do not seek it out. It will find you.`,
    },
    {
      // Chapter 7 — practical advice. Reframed as "this is what tonight looks like."
      motif: '█',
      heading: 'TONIGHT, AND TOMORROW',
      body:
        `Tonight, when this screen closes, you will be looking at your operating desktop. There will be unread mail. There will be a contract on the board. Take it.\n\n` +
        `Build a relay chain on the World Map *before* you accept the contract — not after. Wipe your logs on every breached node. Time-stomp the wipes when you can afford the tool. Do not bank where you breach: Pacific National has a beautiful APR and a memory like an elephant.\n\n` +
        `When the trace bar climbs past sixty percent, disconnect. The reward is not worth your career.\n\n` +
        `Sleep when you can. Read when you can't. Watch what your client list looks like after a month and ask yourself whether you recognise it.`,
    },
    {
      // Chapter 8 — go.
      motif: '➤',
      heading: 'BEGIN',
      body:
        `Your desktop is waiting.\n\n` +
        `Your first contract is in your inbox. Voidlink Dispatch has authorised it as part of your intake. CIPHER will follow up shortly after. He always does.\n\n` +
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

  // Back-navigation — re-show the previous chapter's content (skips the
  // typewriter; player has seen it already).
  const goBackChapter = useCallback(() => {
    if (chapterIndex <= 0) return
    setChapterIndex((i) => i - 1)
    setCharIndex(0)
    setChapterTyped(true)  // arrived from the future, no need to re-type
  }, [chapterIndex])

  // Typewriter
  useEffect(() => {
    if (chapterTyped) return
    if (charIndex < currentChapter.body.length) {
      const t = setTimeout(() => {
        setCharIndex((c) => c + 1)
        if (charIndex % 4 === 0 && currentChapter.body[charIndex] !== ' ') {
          AudioEngine.playSfx('morse')
        }
      }, 1000 / CHARS_PER_SECOND)
      return () => clearTimeout(t)
    }
    setChapterTyped(true)
  }, [chapterIndex, charIndex, chapterTyped, currentChapter.body])

  // Keyboard navigation: SPACE/ENTER skip-or-advance; LEFT goes back one chapter
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
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        goBackChapter()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [chapterTyped, currentChapter.body.length, advanceChapter, goBackChapter])

  const progressPct = ((chapterIndex + (chapterTyped ? 1 : charIndex / currentChapter.body.length)) / chapters.length) * 100

  const visibleBody = chapterTyped ? currentChapter.body : currentChapter.body.slice(0, charIndex)

  // Render **bold** as <strong>, and *italic* as <em>. Both were previously
  // showing as literal asterisks for *italic* — playtester correctly flagged
  // it as untidy. Split on bold first (outer), then italic per-segment.
  function renderBody(text: string) {
    const renderItalics = (segment: string, baseKey: number): React.ReactNode[] => {
      const parts = segment.split(/(\*[^*\n]+\*)/g)
      return parts.map((p, j) =>
        p.startsWith('*') && p.endsWith('*') && p.length > 2
          ? <em key={`${baseKey}_i${j}`}>{p.slice(1, -1)}</em>
          : <span key={`${baseKey}_s${j}`}>{p}</span>,
      )
    }
    const bold = text.split(/(\*\*[^*]+\*\*)/g)
    return bold.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={`b${i}`}>{p.slice(2, -2)}</strong>
        : <React.Fragment key={`f${i}`}>{renderItalics(p, i)}</React.Fragment>,
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
            {chapterIndex > 0 && (
              <button className={styles.backBtn} onClick={goBackChapter}>
                ← BACK
              </button>
            )}
            <button className={styles.continueBtn} onClick={advanceChapter}>
              {isFinal ? 'OPEN DESKTOP' : 'CONTINUE'}
            </button>
          </motion.div>
        )}
      </div>

      <div className={styles.hint}>
        <kbd>SPACE</kbd> or <kbd>ENTER</kbd> {chapterTyped ? 'continue' : 'skip typing'}
        {chapterIndex > 0 && <> · <kbd>←</kbd> back</>}
      </div>
    </motion.main>
  )
}
