import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { formatWorldClock } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './EmailInbox.module.css'

const CAT_CLASS: Record<string, string> = {
  mission: styles.catMission,
  contact: styles.catContact,
  faction: styles.catFaction,
  system:  styles.catSystem,
  darknet: styles.catDarknet,
  rival:   styles.catRival,
}

function cipherArt(seed: string): string {
  // Deterministic gibberish from the message id — gives each ENCRYPTED row a
  // unique cipher appearance. Block-cipher-ish 4×4 hex grid.
  const chars = 'ABCDEF0123456789█▓▒░'
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const out: string[] = []
  for (let row = 0; row < 4; row++) {
    const line: string[] = []
    for (let col = 0; col < 16; col++) {
      h = (h * 1103515245 + 12345) >>> 0
      line.push(chars[h % chars.length])
    }
    out.push(line.join(' '))
  }
  return out.join('\n')
}

export function EmailInbox() {
  const inbox            = useGameStore((s) => s.inbox)
  const markRead         = useGameStore((s) => s.markInboxRead)
  const toggleStar       = useGameStore((s) => s.toggleInboxStar)
  const deleteMessage    = useGameStore((s) => s.deleteInboxMessage)
  const markAllRead      = useGameStore((s) => s.markAllInboxRead)
  const seedStarterInbox = useGameStore((s) => s.seedStarterInbox)

  // Seed first time the inbox renders for a fresh account
  useEffect(() => { seedStarterInbox() }, [seedStarterInbox])

  const [selectedId, setSelectedId] = useState<string | null>(
    inbox.find((m) => !m.isRead)?.id ?? inbox[0]?.id ?? null,
  )
  const [decrypted, setDecrypted] = useState<Record<string, true>>({})

  const selected = inbox.find((m) => m.id === selectedId) ?? null
  const unreadCount = inbox.filter((m) => !m.isRead).length
  const showDecrypted = selected && (!selected.encrypted || decrypted[selected.id])

  function handleSelect(id: string) {
    setSelectedId(id)
    markRead(id)
    AudioEngine.playSfx('click')
  }

  function handleDecrypt() {
    if (!selected) return
    setDecrypted((d) => ({ ...d, [selected.id]: true }))
    AudioEngine.playSfx('success')
  }

  return (
    <div className={styles.root}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <div className={styles.sidebar}>
        <div className={styles.toolbar}>
          <span style={{ flex: 1, fontSize: 9, letterSpacing: '0.16em', color: '#909090' }}>
            INBOX{unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
          </span>
          <button
            className={styles.toolBtn}
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >MARK READ</button>
        </div>

        <div className={styles.list}>
          {inbox.length === 0 && (
            <div style={{ padding: '20px 12px', color: '#606060', fontSize: 10, textAlign: 'center' }}>
              No messages. Inbox seeded on first login.
            </div>
          )}
          {inbox.map((m) => (
            <div
              key={m.id}
              className={`${styles.row} ${m.isRead ? styles.rowRead : styles.rowUnread} ${selectedId === m.id ? styles.rowActive : ''}`}
              onClick={() => handleSelect(m.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={styles.rowFrom}>{m.from}</span>
                <button
                  className={`${styles.star} ${m.isStarred ? styles.starOn : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleStar(m.id) }}
                  aria-label="Star message"
                >★</button>
              </div>
              <div className={styles.rowSubject}>
                {m.encrypted && !decrypted[m.id] ? '[ENCRYPTED] ' : ''}{m.subject}
              </div>
              <div className={styles.rowMeta}>
                <span className={`${styles.catTag} ${CAT_CLASS[m.category]}`}>
                  {m.category.toUpperCase()}
                </span>
                <span>{formatWorldClock(m.receivedAt).split(' ')[1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Reader ──────────────────────────────────────────────────── */}
      <div className={styles.reader}>
        {!selected && (
          <div className={styles.readerEmpty}>SELECT A MESSAGE</div>
        )}

        {selected && (
          <>
            <div className={styles.readerHeader}>
              <div className={styles.readerSubject}>{selected.subject}</div>
              <div className={styles.readerFrom}>FROM: {selected.from}</div>
              {selected.fromFingerprint && (
                <div className={styles.readerFingerprint}>PGP: {selected.fromFingerprint}</div>
              )}
              <div className={styles.readerMeta}>
                <span>{formatWorldClock(selected.receivedAt)} VST</span>
                <span className={`${styles.catTag} ${CAT_CLASS[selected.category]}`}>
                  {selected.category.toUpperCase()}
                </span>
              </div>
            </div>

            <div className={styles.readerBody}>
              {showDecrypted ? (
                selected.body
              ) : (
                <>
                  <div className={styles.cipherOverlay}>{cipherArt(selected.id)}</div>
                  <button className={styles.decryptBtn} onClick={handleDecrypt}>
                    DECRYPT WITH KEY
                  </button>
                </>
              )}
            </div>

            <div className={styles.readerActions}>
              <button
                className={styles.toolBtn}
                onClick={() => {
                  deleteMessage(selected.id)
                  setSelectedId(null)
                }}
              >DELETE</button>
              <button
                className={styles.toolBtn}
                onClick={() => toggleStar(selected.id)}
              >{selected.isStarred ? 'UNSTAR' : 'STAR'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
