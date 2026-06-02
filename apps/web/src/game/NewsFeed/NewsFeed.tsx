import { useGameStore } from '../../store/gameStore.ts'
import type { NewsItem } from '../../store/gameStore.ts'
import styles from './NewsFeed.module.css'

const CATEGORY_LABEL: Record<NewsItem['category'], string> = {
  corporate: 'CORPORATE',
  crime:     'CYBER CRIME',
  tech:      'TECHNOLOGY',
  player:    'INCIDENT',
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (days >= 1)  return `${days}d ago`
  if (hours >= 1) return `${hours}h ago`
  if (mins >= 1)  return `${mins}m ago`
  return 'just now'
}

export function NewsFeed() {
  const newsFeed = useGameStore((s) => s.newsFeed)

  if (newsFeed.length === 0) {
    return (
      <div className={styles.empty}>
        <span>No news items loaded.</span>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      {newsFeed.map((item) => (
        <article
          key={item.id}
          className={`${styles.item} ${item.isPlayerAction ? styles.itemPlayer : ''}`}
        >
          <div className={styles.itemHeader}>
            <span className={`${styles.category} ${styles[`cat_${item.category}`]}`}>
              {CATEGORY_LABEL[item.category]}
            </span>
            <span className={styles.timestamp}>{formatRelativeTime(item.timestamp)}</span>
          </div>
          <div className={styles.headline}>
            {item.isPlayerAction && <span className={styles.playerDot}>●</span>}
            {item.headline}
          </div>
          <div className={styles.body}>{item.body}</div>
        </article>
      ))}
    </div>
  )
}
