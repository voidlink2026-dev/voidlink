import { describe, it, expect } from 'vitest'
import { classifyClient, flagForCompletedContract, flagForRefusedContract } from './clientFaction.ts'

describe('clientFaction classifier', () => {
  it('classifies Big Four handles as corporate', () => {
    expect(classifyClient('ARES_DIVISION')).toBe('corporate')
    expect(classifyClient('ARC_Internal')).toBe('corporate')
    expect(classifyClient('NEXUS_BANK')).toBe('corporate')
    expect(classifyClient('Arunmor_HR')).toBe('corporate')
  })

  it('classifies JCB / government handles as government', () => {
    expect(classifyClient('JCB_Liaison')).toBe('government')
    expect(classifyClient('GOV_OPS')).toBe('government')
  })

  it('classifies Underground handles as underground', () => {
    expect(classifyClient('Cipher')).toBe('underground')
    expect(classifyClient('NightOwl_22')).toBe('underground')
    expect(classifyClient('Null_Trader')).toBe('underground')
    expect(classifyClient('Shadow_Broker')).toBe('underground')
  })

  it('classifies Voidlink internal as neutral', () => {
    expect(classifyClient('VoidlinkSupport')).toBe('neutral')
    expect(classifyClient('YOURSELF')).toBe('neutral')
  })

  it('classifies unknown handles as independent', () => {
    expect(classifyClient('Random_Broker_42')).toBe('independent')
  })

  it('maps completed contract to correct flag', () => {
    expect(flagForCompletedContract('ARES_DIVISION')).toBe('choice_corp_contract_taken')
    expect(flagForCompletedContract('Cipher')).toBe('choice_underground_contract_taken')
    expect(flagForCompletedContract('JCB_Liaison')).toBe('choice_gov_contract_taken')
    expect(flagForCompletedContract('VoidlinkSupport')).toBeNull()
    expect(flagForCompletedContract('Random_Broker_42')).toBeNull()
  })

  it('maps refused corporate contract to resistor flag', () => {
    expect(flagForRefusedContract('ARES_DIVISION')).toBe('choice_corp_contract_refused')
    expect(flagForRefusedContract('Cipher')).toBeNull()
  })
})
