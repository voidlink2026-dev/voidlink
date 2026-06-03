import { useGameStore } from '../../store/gameStore.ts'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './MissionChoiceOverlay.module.css'

// M14o — Mid-mission decision overlay.
// When a phase completes and the phase had choices, the mission's
// pendingChoiceFromPhaseIndex is set. We show a modal asking the player to pick.

export function MissionChoiceOverlay() {
  const activeMissionId = useGameStore((s) => s.activeMissionId)
  const missions = useGameStore((s) => s.missions)
  const chooseMissionOption = useGameStore((s) => s.chooseMissionOption)

  const mission = missions.find((m) => m.id === activeMissionId)
  const pendingIdx = mission?.pendingChoiceFromPhaseIndex
  if (mission === undefined || pendingIdx === undefined) return null

  const phase = mission.phases?.[pendingIdx]
  if (!phase?.choices) return null

  function pick(choiceId: string) {
    chooseMissionOption(choiceId)
    AudioEngine.playSfx('success')
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="choice-title">
      <div className={styles.panel}>
        <div className={styles.title} id="choice-title">
          ◆ DECISION POINT
        </div>
        <div className={styles.subtitle}>
          PHASE {pendingIdx + 1} — {phase.label.toUpperCase()} COMPLETE
        </div>
        <div className={styles.prompt}>
          You've reached a fork in this operation. Choose your next move.
          Each choice has consequences — factions, reputation, and the path the mission takes from here.
        </div>

        <div className={styles.choices}>
          {phase.choices.map((c) => (
            <button
              key={c.id}
              className={styles.choiceBtn}
              onClick={() => pick(c.id)}
            >
              <div className={styles.choiceLabel}>{c.label}</div>
              <div className={styles.choiceDesc}>{c.description}</div>
              {c.effects && (
                <div className={styles.choiceEffects}>
                  {c.effects.repDelta && (
                    <span className={c.effects.repDelta > 0 ? styles.effectGood : styles.effectBad}>
                      {c.effects.repDelta > 0 ? '+' : ''}{c.effects.repDelta} REP
                    </span>
                  )}
                  {c.effects.factionDeltas && Object.entries(c.effects.factionDeltas).map(([fid, delta]) => (
                    <span key={fid} className={delta > 0 ? styles.effectGood : styles.effectBad}>
                      {delta > 0 ? '+' : ''}{delta} {fid.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
