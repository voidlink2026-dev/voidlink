// XP curve: totalXpForLevel(n) = floor(50 * n^1.7)
// Level 100 ≈ 125K XP (~250 missions), Level 1000 ≈ 10M XP (prestige territory)

export const MAX_LEVEL = 1000

export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(50 * Math.pow(level, 1.7))
}

export function xpForNextLevel(level: number): number {
  return totalXpForLevel(level + 1) - totalXpForLevel(level)
}

export function levelFromXp(xp: number): number {
  let lo = 1
  let hi = MAX_LEVEL
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2)
    if (totalXpForLevel(mid) <= xp) lo = mid
    else hi = mid - 1
  }
  return lo
}

export function xpProgressPercent(xp: number, level: number): number {
  if (level >= MAX_LEVEL) return 100
  const base = totalXpForLevel(level)
  const next = totalXpForLevel(level + 1)
  return Math.round(((xp - base) / (next - base)) * 100)
}

// XP awarded per mission: base scales with difficulty * 120, story missions get a 4× bonus
export function missionXpReward(difficulty: number, isStory: boolean): number {
  const base = Math.max(80, difficulty * 120)
  return isStory ? base * 4 : base
}

// Rank titles — one per 50 levels, 20 tiers
const RANK_TITLES: [number, string][] = [
  [1,   'SCRIPT KIDDIE'],
  [10,  'NOVICE OPERATIVE'],
  [25,  'JUNIOR OPERATIVE'],
  [50,  'OPERATIVE'],
  [75,  'SENIOR OPERATIVE'],
  [100, 'SPECIALIST'],
  [150, 'ELITE OPERATIVE'],
  [200, 'GHOST'],
  [275, 'CIPHER'],
  [350, 'PHANTOM'],
  [450, 'SHADOWMANCER'],
  [550, 'ZERO-DAY'],
  [650, 'APEX PREDATOR'],
  [750, 'LEGEND'],
  [850, 'MYTH'],
  [950, 'TRANSCENDENT'],
  [1000, 'VOIDWALKER'],
]

export function levelTitle(level: number): string {
  let title = RANK_TITLES[0][1]
  for (const [threshold, name] of RANK_TITLES) {
    if (level >= threshold) title = name
    else break
  }
  return title
}

export { RANK_TITLES }
