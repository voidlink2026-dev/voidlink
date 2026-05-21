export interface Corporation {
  id: string
  name: string
  sector: string
  netWorth: number
  reputationScore: number // how much the world trusts them
  ownedNetworkIds: string[]
  newsFeed: NewsArticle[]
}

export interface NewsArticle {
  id: string
  headline: string
  body: string
  publishedAt: number
  relatedCorporationIds?: string[]
  relatedMissionId?: string
  isPlayerGenerated: boolean
}

export interface WorldState {
  tick: number // increments on each world simulation step
  corporations: Record<string, Corporation>
  news: NewsArticle[]
  activeWorldEvents: WorldEvent[]
  marketPrices: Record<string, number> // toolId → current price
}

export interface WorldEvent {
  id: string
  type: string
  headline: string
  startedAt: number
  endsAt?: number
  effects: WorldEventEffect[]
}

export type WorldEventEffect =
  | { type: 'trace_speed_modifier'; networkArchetype: string; multiplier: number }
  | { type: 'price_modifier'; category: string; multiplier: number }
  | { type: 'unlock_mission'; missionId: string }
  | { type: 'faction_standing_shift'; factionId: string; delta: number }
