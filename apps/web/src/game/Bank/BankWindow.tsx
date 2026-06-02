import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { BANKS, getBank } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './BankWindow.module.css'

export function BankWindow() {
  const player           = useGameStore((s) => s.player)
  const activeBankId     = useGameStore((s) => s.activeBankId)
  const openBankAccount  = useGameStore((s) => s.openBankAccount)
  const bankDeposit      = useGameStore((s) => s.bankDeposit)
  const bankWithdraw     = useGameStore((s) => s.bankWithdraw)
  const logTerminal      = useGameStore((s) => s.logTerminal)

  const [amountStr, setAmountStr] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Reset state when switching banks
  useEffect(() => { setAmountStr(''); setError(null) }, [activeBankId])

  if (!player) return null

  // No bank selected: list available banks
  if (!activeBankId) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>FINANCIAL INSTITUTIONS</div>
        <div className={styles.muted}>
          Click any BANK target on the WORLD MAP to connect. Banks let you securely deposit credits, earn passive interest, and protect against trace-loss seizure.
        </div>
        <div className={styles.bankGrid}>
          {BANKS.map((b) => {
            const acct = player.bankAccounts?.[b.id]
            return (
              <div key={b.id} className={styles.bankCard}>
                <div className={styles.bankName}>{b.name}</div>
                <div className={styles.bankMeta}>{b.region} · {(b.apr * 100).toFixed(2)}% APR</div>
                {acct
                  ? <div className={styles.bankBalance}>{Math.floor(acct.balance).toLocaleString()} Cr</div>
                  : <div className={styles.bankDim}>No account</div>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const bank = getBank(activeBankId)
  if (!bank) return <div className={styles.root}><div className={styles.error}>UNKNOWN BANK ID: {activeBankId}</div></div>

  const acct = player.bankAccounts?.[activeBankId]
  const amount = parseInt(amountStr.replace(/[^\d]/g, ''), 10) || 0

  function handleOpen() {
    const result = openBankAccount(bank!.id)
    if (result === 'insufficient_funds') { setError(`Need ${bank!.openCost} Cr to open an account.`); AudioEngine.playSfx('error') }
    else if (result === 'already_open') setError('Account already open at this institution.')
    else if (result === 'unknown_bank') setError('Bank not recognised.')
    else { setError(null); AudioEngine.playSfx('success') }
  }

  function handleDeposit() {
    if (amount <= 0) { setError('Enter an amount.'); return }
    const result = bankDeposit(bank!.id, amount)
    if (result === 'insufficient_funds') { setError('Insufficient credits on hand.'); AudioEngine.playSfx('error') }
    else if (result === 'no_account') setError('No account open.')
    else { setError(null); setAmountStr(''); AudioEngine.playSfx('click'); logTerminal(`Deposited ${amount.toLocaleString()} Cr at ${bank!.name}.`, 'system') }
  }

  function handleWithdraw() {
    if (amount <= 0) { setError('Enter an amount.'); return }
    const result = bankWithdraw(bank!.id, amount)
    if (result === 'insufficient_balance') { setError('Insufficient balance.'); AudioEngine.playSfx('error') }
    else if (result === 'no_account') setError('No account open.')
    else { setError(null); setAmountStr(''); AudioEngine.playSfx('click'); logTerminal(`Withdrew ${amount.toLocaleString()} Cr from ${bank!.name}.`, 'system') }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>{bank.name.toUpperCase()}</div>
      <div className={styles.flavour}>{bank.flavour}</div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>APR</div>
          <div className={styles.statValue}>{(bank.apr * 100).toFixed(2)}%</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>REGION</div>
          <div className={styles.statValue}>{bank.region}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>YOUR CASH</div>
          <div className={styles.statValue}>{player.credits.toLocaleString()} Cr</div>
        </div>
      </div>

      {!acct ? (
        <div className={styles.openSection}>
          <div className={styles.muted}>No account at this institution. Setup fee: <strong>{bank.openCost.toLocaleString()} Cr</strong>.</div>
          <button className={styles.primaryBtn} onClick={handleOpen} disabled={player.credits < bank.openCost}>
            OPEN ACCOUNT
          </button>
        </div>
      ) : (
        <>
          <div className={styles.balancePanel}>
            <div className={styles.balanceLabel}>ACCOUNT BALANCE</div>
            <div className={styles.balanceValue}>{Math.floor(acct.balance).toLocaleString()} Cr</div>
            <div className={styles.balanceMeta}>
              Interest earned: {Math.floor(acct.totalInterestEarned).toLocaleString()} Cr ·
              Account opened: {new Date(acct.openedAt).toLocaleDateString()}
            </div>
          </div>

          <div className={styles.txSection}>
            <input
              type="text"
              className={styles.input}
              placeholder="Amount (Cr)"
              value={amountStr}
              onChange={(e) => { setAmountStr(e.target.value); setError(null) }}
              inputMode="numeric"
            />
            <div className={styles.btnRow}>
              <button className={styles.depositBtn} onClick={handleDeposit} disabled={amount <= 0 || amount > player.credits}>
                DEPOSIT
              </button>
              <button className={styles.withdrawBtn} onClick={handleWithdraw} disabled={amount <= 0 || amount > Math.floor(acct.balance)}>
                WITHDRAW
              </button>
            </div>
            <div className={styles.btnRow}>
              <button className={styles.maxBtn} onClick={() => setAmountStr(String(player.credits))}>ALL CASH</button>
              <button className={styles.maxBtn} onClick={() => setAmountStr(String(Math.floor(acct.balance)))}>ALL SAVINGS</button>
            </div>
          </div>
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.footer}>
        FUNDS DEPOSITED IN BANKS ARE SAFE FROM TRACE-LOSS SEIZURE BUT MAY BE
        TARGETED BY RIVAL OPERATIVES. SPREAD WEALTH ACROSS INSTITUTIONS.
      </div>
    </div>
  )
}
