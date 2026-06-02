import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore.ts'
import { BANKS, STOCKS, getBank, getStock } from '@voidlink/core'
import { AudioEngine } from '../Audio/audioEngine.ts'
import styles from './BankWindow.module.css'

type Tab = 'savings' | 'loan' | 'trade' | 'stocks'

export function BankWindow() {
  const player           = useGameStore((s) => s.player)
  const activeBankId     = useGameStore((s) => s.activeBankId)
  const openBankAccount  = useGameStore((s) => s.openBankAccount)
  const bankDeposit      = useGameStore((s) => s.bankDeposit)
  const bankWithdraw     = useGameStore((s) => s.bankWithdraw)
  const takeLoan         = useGameStore((s) => s.takeLoan)
  const repayLoan        = useGameStore((s) => s.repayLoan)
  const tradeCurrency    = useGameStore((s) => s.tradeCurrency)
  const buyStock         = useGameStore((s) => s.buyStock)
  const sellStock        = useGameStore((s) => s.sellStock)
  const darkcoinRate     = useGameStore((s) => s.darkcoinExchangeRate)
  const stockPrices      = useGameStore((s) => s.stockPrices)

  const [tab, setTab] = useState<Tab>('savings')
  const [amountStr, setAmountStr] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setAmountStr(''); setError(null); setTab('savings') }, [activeBankId])

  if (!player) return null

  // No bank selected — list available
  if (!activeBankId) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>FINANCIAL INSTITUTIONS</div>
        <div className={styles.muted}>
          Click any BANK target on the WORLD MAP to connect.
        </div>
        <div className={styles.bankGrid}>
          {BANKS.map((b) => {
            const acct = player.bankAccounts?.[b.id]
            return (
              <div key={b.id} className={`${styles.bankCard} ${b.offshore ? styles.bankCardOffshore : ''}`}>
                <div className={styles.bankName}>{b.name} {b.offshore && <span className={styles.offshoreTag}>OFFSHORE</span>}</div>
                <div className={styles.bankMeta}>{b.region} · {(b.apr * 100).toFixed(2)}% APR · {b.features.join(' / ').toUpperCase()}</div>
                {acct
                  ? <div className={styles.bankBalance}>{Math.floor(acct.balance).toLocaleString()} Cr {acct.loanPrincipal ? <span className={styles.loanTag}> -{Math.ceil(acct.loanPrincipal).toLocaleString()} loan</span> : null}</div>
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
    if (result === 'insufficient_funds') { setError(`Need ${bank!.openCost.toLocaleString()} Cr.`); AudioEngine.playSfx('error') }
    else if (result === 'already_open') setError('Account already open.')
    else if (result === 'unknown_bank') setError('Bank not recognised.')
    else { setError(null); AudioEngine.playSfx('success') }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {bank.name.toUpperCase()}
        {bank.offshore && <span className={styles.offshoreTag}>OFFSHORE</span>}
      </div>
      <div className={styles.flavour}>{bank.flavour}</div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>APR</div>
          <div className={styles.statValue}>{(bank.apr * 100).toFixed(2)}%</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>YOUR CASH</div>
          <div className={styles.statValue}>{player.credits.toLocaleString()} Cr</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>DARKCOIN</div>
          <div className={styles.statValue}>{(player.darkcoin ?? 0).toFixed(4)} DC</div>
        </div>
      </div>

      {!acct ? (
        <div className={styles.openSection}>
          <div className={styles.muted}>No account. Setup fee: <strong>{bank.openCost.toLocaleString()} Cr</strong>.</div>
          <button className={styles.primaryBtn} onClick={handleOpen} disabled={player.credits < bank.openCost}>
            OPEN ACCOUNT
          </button>
        </div>
      ) : (
        <>
          {/* Tab strip — only show tabs available at this bank */}
          <div className={styles.tabs}>
            {bank.features.includes('savings') && <TabBtn label="SAVINGS" active={tab === 'savings'} onClick={() => setTab('savings')} />}
            {bank.features.includes('loans')   && <TabBtn label="LOAN"    active={tab === 'loan'}    onClick={() => setTab('loan')} />}
            {bank.features.includes('trade')   && <TabBtn label="TRADE"   active={tab === 'trade'}   onClick={() => setTab('trade')} />}
            {bank.features.includes('stocks')  && <TabBtn label="STOCKS"  active={tab === 'stocks'}  onClick={() => setTab('stocks')} />}
          </div>

          {tab === 'savings' && (
            <SavingsTab
              acct={acct} bankId={bank.id} cash={player.credits}
              amountStr={amountStr} setAmountStr={setAmountStr}
              amount={amount} setError={setError}
              bankDeposit={bankDeposit} bankWithdraw={bankWithdraw}
            />
          )}

          {tab === 'loan' && (
            <LoanTab
              acct={acct} bank={bank} cash={player.credits}
              amountStr={amountStr} setAmountStr={setAmountStr}
              amount={amount} setError={setError}
              takeLoan={takeLoan} repayLoan={repayLoan}
            />
          )}

          {tab === 'trade' && (
            <TradeTab
              cash={player.credits} darkcoin={player.darkcoin ?? 0}
              rate={darkcoinRate} setError={setError}
              tradeCurrency={tradeCurrency}
            />
          )}

          {tab === 'stocks' && (
            <StocksTab
              player={player} stockPrices={stockPrices}
              setError={setError}
              buyStock={buyStock} sellStock={sellStock}
            />
          )}
        </>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.footer}>
        {bank.offshore
          ? 'OFFSHORE ACCOUNT — DEPOSITS REDUCE HEAT. AUTHORITIES CANNOT TRACE BALANCES WITHOUT A WARRANT.'
          : 'DEPOSITS SAFE FROM TRACE-LOSS SEIZURE. SPREAD WEALTH ACROSS INSTITUTIONS.'}
      </div>
    </div>
  )
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`${styles.tabBtn} ${active ? styles.tabBtnActive : ''}`} onClick={onClick}>{label}</button>
  )
}

// ── Savings tab ────────────────────────────────────────────────────────────
function SavingsTab({
  acct, bankId, cash, amountStr, setAmountStr, amount, setError, bankDeposit, bankWithdraw,
}: {
  acct: import('@voidlink/core').BankAccount
  bankId: string; cash: number; amountStr: string
  setAmountStr: (v: string) => void; amount: number
  setError: (s: string | null) => void
  bankDeposit: (id: string, amt: number) => string
  bankWithdraw: (id: string, amt: number) => string
}) {
  function deposit() {
    if (amount <= 0) { setError('Enter an amount.'); return }
    const r = bankDeposit(bankId, amount)
    if (r === 'insufficient_funds') { setError('Insufficient credits.'); AudioEngine.playSfx('error') }
    else { setError(null); setAmountStr(''); AudioEngine.playSfx('click') }
  }
  function withdraw() {
    if (amount <= 0) { setError('Enter an amount.'); return }
    const r = bankWithdraw(bankId, amount)
    if (r === 'insufficient_balance') { setError('Insufficient balance.'); AudioEngine.playSfx('error') }
    else { setError(null); setAmountStr(''); AudioEngine.playSfx('click') }
  }
  return (
    <>
      <div className={styles.balancePanel}>
        <div className={styles.balanceLabel}>ACCOUNT BALANCE</div>
        <div className={styles.balanceValue}>{Math.floor(acct.balance).toLocaleString()} Cr</div>
        <div className={styles.balanceMeta}>
          Interest earned: {Math.floor(acct.totalInterestEarned).toLocaleString()} Cr
        </div>
      </div>
      <div className={styles.txSection}>
        <input type="text" className={styles.input} placeholder="Amount (Cr)" value={amountStr}
          onChange={(e) => { setAmountStr(e.target.value); setError(null) }} inputMode="numeric" />
        <div className={styles.btnRow}>
          <button className={styles.depositBtn} onClick={deposit}  disabled={amount <= 0 || amount > cash}>DEPOSIT</button>
          <button className={styles.withdrawBtn} onClick={withdraw} disabled={amount <= 0 || amount > Math.floor(acct.balance)}>WITHDRAW</button>
        </div>
        <div className={styles.btnRow}>
          <button className={styles.maxBtn} onClick={() => setAmountStr(String(cash))}>ALL CASH</button>
          <button className={styles.maxBtn} onClick={() => setAmountStr(String(Math.floor(acct.balance)))}>ALL SAVINGS</button>
        </div>
      </div>
    </>
  )
}

// ── Loan tab ───────────────────────────────────────────────────────────────
function LoanTab({
  acct, bank, cash, amountStr, setAmountStr, amount, setError, takeLoan, repayLoan,
}: {
  acct: import('@voidlink/core').BankAccount
  bank: import('@voidlink/core').BankDef
  cash: number; amountStr: string
  setAmountStr: (v: string) => void; amount: number
  setError: (s: string | null) => void
  takeLoan: (id: string, amt: number) => string
  repayLoan: (id: string, amt: number) => string
}) {
  const hasLoan = (acct.loanPrincipal ?? 0) > 0
  const principal = Math.ceil(acct.loanPrincipal ?? 0)
  const collateral = Math.max(cash + acct.balance, 1000)
  const maxLoan = Math.floor(collateral * bank.maxLoanMultiplier)

  function handleTake() {
    if (amount <= 0) { setError('Enter an amount.'); return }
    const r = takeLoan(bank.id, amount)
    if (r === 'over_limit') { setError(`Max loan: ${maxLoan.toLocaleString()} Cr.`); AudioEngine.playSfx('error') }
    else if (r === 'has_loan') { setError('Existing loan must be repaid first.'); AudioEngine.playSfx('error') }
    else { setError(null); setAmountStr(''); AudioEngine.playSfx('success') }
  }

  function handleRepay() {
    if (amount <= 0) { setError('Enter an amount.'); return }
    const r = repayLoan(bank.id, amount)
    if (r === 'insufficient_funds') { setError('Insufficient credits on hand.'); AudioEngine.playSfx('error') }
    else { setError(null); setAmountStr(''); AudioEngine.playSfx('click') }
  }

  if (!hasLoan) {
    return (
      <div className={styles.loanSection}>
        <div className={styles.balanceLabel}>LOAN AVAILABLE</div>
        <div className={styles.balanceValueAmber}>UP TO {maxLoan.toLocaleString()} Cr</div>
        <div className={styles.balanceMeta}>
          Interest rate: {(bank.loanRate * 100).toFixed(2)}% APR (compounds continuously). Repay at any time.
        </div>
        <input type="text" className={styles.input} placeholder="Loan amount (Cr)" value={amountStr}
          onChange={(e) => { setAmountStr(e.target.value); setError(null) }} inputMode="numeric" />
        <button className={styles.primaryBtn} onClick={handleTake} disabled={amount <= 0 || amount > maxLoan}>BORROW</button>
        <button className={styles.maxBtn} onClick={() => setAmountStr(String(maxLoan))}>MAX</button>
      </div>
    )
  }

  return (
    <div className={styles.loanSection}>
      <div className={styles.balancePanel} style={{ borderColor: 'rgba(255,51,51,0.3)' }}>
        <div className={styles.balanceLabel}>OUTSTANDING PRINCIPAL</div>
        <div className={styles.balanceValueRed}>{principal.toLocaleString()} Cr</div>
        <div className={styles.balanceMeta}>
          Rate: {((acct.loanRate ?? 0) * 100).toFixed(2)}% APR ·
          Interest accrued: {Math.floor(acct.loanTotalInterestAccrued ?? 0).toLocaleString()} Cr
        </div>
      </div>
      <input type="text" className={styles.input} placeholder="Repayment (Cr)" value={amountStr}
        onChange={(e) => { setAmountStr(e.target.value); setError(null) }} inputMode="numeric" />
      <div className={styles.btnRow}>
        <button className={styles.depositBtn} onClick={handleRepay} disabled={amount <= 0 || amount > cash}>REPAY</button>
        <button className={styles.maxBtn} onClick={() => setAmountStr(String(Math.min(cash, principal)))}>MAX AFFORD</button>
        <button className={styles.maxBtn} onClick={() => setAmountStr(String(principal))}>FULL</button>
      </div>
    </div>
  )
}

// ── Currency trade tab ─────────────────────────────────────────────────────
function TradeTab({
  cash, darkcoin, rate, setError, tradeCurrency,
}: {
  cash: number; darkcoin: number; rate: number
  setError: (s: string | null) => void
  tradeCurrency: (dir: 'buy_dc' | 'sell_dc', amt: number) => string
}) {
  const [crAmount, setCrAmount] = useState('')
  const [dcAmount, setDcAmount] = useState('')

  function buyDc() {
    const n = parseInt(crAmount.replace(/[^\d]/g, ''), 10) || 0
    if (n <= 0) { setError('Enter Cr amount.'); return }
    const r = tradeCurrency('buy_dc', n)
    if (r === 'insufficient_funds') { setError('Insufficient credits.'); AudioEngine.playSfx('error') }
    else { setError(null); setCrAmount(''); AudioEngine.playSfx('click') }
  }
  function sellDc() {
    const n = parseFloat(dcAmount) || 0
    if (n <= 0) { setError('Enter DC amount.'); return }
    const r = tradeCurrency('sell_dc', n * 10000)
    if (r === 'insufficient_funds') { setError('Insufficient Darkcoin.'); AudioEngine.playSfx('error') }
    else { setError(null); setDcAmount(''); AudioEngine.playSfx('click') }
  }

  return (
    <div className={styles.tradeSection}>
      <div className={styles.balancePanel}>
        <div className={styles.balanceLabel}>EXCHANGE RATE — LIVE</div>
        <div className={styles.balanceValue}>1 DC = {rate.toFixed(2)} Cr</div>
        <div className={styles.balanceMeta}>0.99× spread on both sides. Rate updates every ~1.5s.</div>
      </div>

      <div className={styles.tradeBlock}>
        <div className={styles.sliderLabel}>BUY DARKCOIN</div>
        <input type="text" className={styles.input} placeholder="Cr to spend" value={crAmount}
          onChange={(e) => { setCrAmount(e.target.value); setError(null) }} inputMode="numeric" />
        <div className={styles.balanceMeta}>≈ {((parseInt(crAmount, 10) || 0) * 0.99 / rate).toFixed(4)} DC</div>
        <button className={styles.depositBtn} onClick={buyDc}
          disabled={(parseInt(crAmount, 10) || 0) <= 0 || (parseInt(crAmount, 10) || 0) > cash}>BUY DC</button>
      </div>

      <div className={styles.tradeBlock}>
        <div className={styles.sliderLabel}>SELL DARKCOIN</div>
        <input type="text" className={styles.input} placeholder="DC to sell (e.g. 1.5)" value={dcAmount}
          onChange={(e) => { setDcAmount(e.target.value); setError(null) }} />
        <div className={styles.balanceMeta}>≈ {Math.floor((parseFloat(dcAmount) || 0) * rate * 0.99).toLocaleString()} Cr</div>
        <button className={styles.withdrawBtn} onClick={sellDc}
          disabled={(parseFloat(dcAmount) || 0) <= 0 || (parseFloat(dcAmount) || 0) > darkcoin}>SELL DC</button>
      </div>
    </div>
  )
}

// ── Stocks tab ─────────────────────────────────────────────────────────────
function StocksTab({
  player, stockPrices, setError, buyStock, sellStock,
}: {
  player: import('@voidlink/core').PlayerProfile
  stockPrices: Record<string, number>
  setError: (s: string | null) => void
  buyStock: (id: string, n: number) => string
  sellStock: (id: string, n: number) => string
}) {
  const [selected, setSelected] = useState<string>(STOCKS[0].id)
  const [sharesStr, setSharesStr] = useState('')

  const stock = getStock(selected)
  const price = stockPrices[selected] ?? stock!.basePrice
  const holding = player.stockHoldings?.[selected]
  const shares = parseInt(sharesStr, 10) || 0
  const cost = Math.ceil(price * shares)

  function buy() {
    if (shares <= 0) { setError('Enter share count.'); return }
    const r = buyStock(selected, shares)
    if (r === 'insufficient_funds') { setError('Insufficient credits.'); AudioEngine.playSfx('error') }
    else if (r === 'invalid_amount') setError('Invalid amount.')
    else { setError(null); setSharesStr(''); AudioEngine.playSfx('click') }
  }
  function sell() {
    if (shares <= 0) { setError('Enter share count.'); return }
    const r = sellStock(selected, shares)
    if (r === 'insufficient_shares') { setError('You don\'t own that many shares.'); AudioEngine.playSfx('error') }
    else { setError(null); setSharesStr(''); AudioEngine.playSfx('click') }
  }

  return (
    <div className={styles.stocksSection}>
      <div className={styles.stockGrid}>
        {STOCKS.map((s) => {
          const p = stockPrices[s.id] ?? s.basePrice
          const drift = ((p - s.basePrice) / s.basePrice) * 100
          const h = player.stockHoldings?.[s.id]
          return (
            <button key={s.id}
              className={`${styles.stockRow} ${selected === s.id ? styles.stockRowActive : ''}`}
              onClick={() => setSelected(s.id)}>
              <span className={styles.stockTicker}>{s.ticker}</span>
              <span className={styles.stockName}>{s.name}</span>
              <span className={styles.stockPrice}>{p.toFixed(2)} Cr</span>
              <span className={drift >= 0 ? styles.stockUp : styles.stockDown}>
                {drift >= 0 ? '▲' : '▼'} {Math.abs(drift).toFixed(2)}%
              </span>
              {h && <span className={styles.stockOwned}>{h.shares}×</span>}
            </button>
          )
        })}
      </div>

      <div className={styles.tradeBlock}>
        <div className={styles.sliderLabel}>
          {stock!.ticker} — {price.toFixed(2)} Cr/share
        </div>
        {holding && (
          <div className={styles.balanceMeta}>
            Held: {holding.shares} shares · Cost basis: {Math.floor(holding.costBasis / holding.shares).toLocaleString()} Cr/share · Mkt value: {Math.floor(price * holding.shares).toLocaleString()} Cr
          </div>
        )}
        <input type="text" className={styles.input} placeholder="Number of shares" value={sharesStr}
          onChange={(e) => { setSharesStr(e.target.value); setError(null) }} inputMode="numeric" />
        <div className={styles.balanceMeta}>≈ {cost.toLocaleString()} Cr total</div>
        <div className={styles.btnRow}>
          <button className={styles.depositBtn} onClick={buy} disabled={shares <= 0 || cost > player.credits}>BUY</button>
          <button className={styles.withdrawBtn} onClick={sell} disabled={shares <= 0 || !holding || holding.shares < shares}>SELL</button>
        </div>
      </div>
    </div>
  )
}
