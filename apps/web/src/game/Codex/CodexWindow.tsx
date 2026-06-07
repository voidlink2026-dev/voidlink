import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { CODEX, getCodexEntry } from '@voidlink/core'
import type { CodexEntry, CodexCategory } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './CodexWindow.module.css'

const CATEGORY_ORDER: CodexCategory[] = ['factions', 'people', 'history', 'culture', 'terms']
const CATEGORY_LABEL: Record<CodexCategory, string> = {
  factions: 'FACTIONS',
  people: 'PEOPLE',
  history: 'HISTORY',
  culture: 'CULTURE',
  terms: 'TERMS',
}

/**
 * Render markdown-style **bold** to HTML. Lightweight to avoid pulling in a
 * full markdown lib.
 */
function renderBody(body: string) {
  const html = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return { __html: html }
}

export function CodexWindow() {
  const player          = useGameStore((s) => s.player)
  const codexFocusId    = useGameStore((s) => s.codexFocusId)
  const markCodexRead   = useGameStore((s) => s.markCodexRead)
  const setCodexFocusId = useGameStore((s) => s.setCodexFocusId)

  const [selectedId, setSelectedId] = useState<string | null>(null)

  // External deep-link (from notification toast)
  useEffect(() => {
    if (codexFocusId) {
      setSelectedId(codexFocusId)
      setCodexFocusId(null)
    }
  }, [codexFocusId, setCodexFocusId])

  const categorised = useMemo(() => {
    const map: Record<CodexCategory, CodexEntry[]> = {
      factions: [], people: [], history: [], culture: [], terms: [],
    }
    for (const e of CODEX) map[e.category].push(e)
    return map
  }, [])

  if (!player) return null

  const selected = selectedId ? getCodexEntry(selectedId) : null
  const isUnlocked = (e: CodexEntry) => e.unlockTrigger(player)
  const isUnread = (e: CodexEntry) =>
    !!player.activeFlags[`codex_unlocked_${e.id}`]
    && !player.activeFlags[`codex_read_${e.id}`]

  function handleSelect(e: CodexEntry) {
    if (!isUnlocked(e)) return
    setSelectedId(e.id)
    if (isUnread(e)) markCodexRead(e.id)
    AudioEngine.playSfx('click')
  }

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat}>
            <div className={styles.category}>{CATEGORY_LABEL[cat]}</div>
            {categorised[cat].map((e) => {
              const unlocked = isUnlocked(e)
              const unread = isUnread(e)
              const active = selectedId === e.id
              return (
                <div
                  key={e.id}
                  className={`${styles.entry} ${active ? styles.entryActive : ''} ${!unlocked ? styles.entryLocked : ''}`}
                  onClick={() => handleSelect(e)}
                >
                  <div className={`${styles.entryTitle} ${unread ? styles.entryUnread : ''}`}>
                    {unread && <span className={styles.unreadDot} />}
                    {unlocked ? e.title : '⊘  LOCKED ENTRY'}
                  </div>
                  <div className={styles.entryTagline}>
                    {unlocked ? e.tagline : 'Unlocks through play.'}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className={styles.reader}>
        {!selected ? (
          <div className={styles.readerEmpty}>
            VOIDLINK CODEX<br />
            Compiled by NIGHTOWL_22 from the Mesh.<br /><br />
            Select an entry to read.<br />
            Locked entries unlock as you encounter them in the world.
          </div>
        ) : !isUnlocked(selected) ? (
          <div className={styles.readerEmpty}>
            This entry has not been unlocked yet.<br />
            Continue your career to discover it.
          </div>
        ) : (
          <>
            <div className={styles.readerCategory}>{CATEGORY_LABEL[selected.category]}</div>
            <div className={styles.readerTitle}>{selected.title}</div>
            <div className={styles.readerTagline}>{selected.tagline}</div>
            <div className={styles.readerBody} dangerouslySetInnerHTML={renderBody(selected.body)} />
          </>
        )}
      </div>
    </div>
  )
}
