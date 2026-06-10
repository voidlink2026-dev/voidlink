import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import styles from './DiaryWindow.module.css'

// P2 — Operative Diary. Renders the player's entries newest-first. Marks
// the unread count as zero on mount so the taskbar pulse settles.

function formatDate(ms: number): string {
  const d = new Date(ms)
  const day = d.getUTCDate().toString().padStart(2, '0')
  const month = (d.getUTCMonth() + 1).toString().padStart(2, '0')
  const year = d.getUTCFullYear()
  const hh = d.getUTCHours().toString().padStart(2, '0')
  const mm = d.getUTCMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} · ${hh}:${mm} VST`
}

function renderBody(body: string): React.ReactNode {
  // Allow *italic markers* inline. No other markup.
  const parts = body.split(/(\*[^*]+\*)/g)
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*')
      ? <em key={i}>{p.slice(1, -1)}</em>
      : <span key={i}>{p}</span>,
  )
}

export function DiaryWindow() {
  const player = useGameStore((s) => s.player)
  const markRead = useGameStore((s) => s.markDiaryRead)

  useEffect(() => {
    markRead()
  }, [markRead])

  const entries = player?.diary ?? []
  // Render newest first.
  const sorted = [...entries].sort((a, b) => b.writtenAt - a.writtenAt)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.title}>OPERATIVE DIARY</div>
        <div className={styles.subtitle}>
          {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'} · written by the operative client when something changed
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className={styles.empty}>
          The diary is empty. Entries will be written as the world changes around you.<br />
          <br />
          Take a contract.
        </div>
      ) : (
        <div className={styles.list}>
          {sorted.map((entry) => (
            <div key={entry.id} className={styles.entry}>
              <div className={styles.entryDate}>{formatDate(entry.writtenAt)}</div>
              <div className={styles.entryBody}>{renderBody(entry.body)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
