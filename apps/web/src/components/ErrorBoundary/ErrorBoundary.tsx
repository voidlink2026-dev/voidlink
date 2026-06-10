import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State {
  hasError: boolean
  error: Error | null
  componentStack: string
}

// Audit follow-up: previously, an exception inside any window crashed the
// entire desktop. This boundary catches the throw, renders a recoverable
// terminal-style panel, and lets the player copy the report to clipboard for
// a bug ticket. No telemetry — the player chooses to share, in line with the
// privacy notice.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, componentStack: '' }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    this.setState({ componentStack: info.componentStack ?? '' })

    console.error('[Voidlink crash]', error, info)
  }

  copyReport = async () => {
    const report = this.buildReport()
    try {
      await navigator.clipboard.writeText(report)
    } catch {
      // Browsers without clipboard permission — fall back to selecting the text
      const el = document.getElementById('voidlink-crash-report')
      if (el && 'createRange' in document) {
        const range = document.createRange()
        range.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }

  buildReport = () => {
    const { error, componentStack } = this.state
    return [
      '── VOIDLINK CRASH REPORT ──',
      `Timestamp: ${new Date().toISOString()}`,
      `URL:       ${typeof window !== 'undefined' ? window.location.href : 'n/a'}`,
      `UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a'}`,
      '',
      `Error: ${error?.name ?? 'Error'}: ${error?.message ?? '(no message)'}`,
      '',
      'Stack:',
      error?.stack ?? '(no stack)',
      '',
      'Component stack:',
      componentStack || '(none)',
    ].join('\n')
  }

  reset = () => this.setState({ hasError: false, error: null, componentStack: '' })

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#050505',
        color: '#d4d4d4',
        fontFamily: 'JetBrains Mono, monospace',
        padding: '40px 48px',
        display: 'flex', flexDirection: 'column', gap: 16,
        overflow: 'auto',
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.24em', color: '#ff2d20' }}>
          ── KERNEL FAULT ── UNRECOVERABLE OPERATION
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#00cfff', letterSpacing: '0.04em', margin: 0 }}>
          Something in the operative client crashed.
        </h1>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#a8a8a8', maxWidth: 720 }}>
          The game caught the fault before it took the rest of the desktop with it. Your save is on disk and
          will load fine on next launch. If you can spare the time, copying the crash report below and pasting
          it into a bug report would help close this hole.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={this.copyReport} style={btn}>COPY CRASH REPORT</button>
          <button onClick={this.reset} style={btn}>TRY TO CONTINUE</button>
          <button onClick={() => window.location.reload()} style={btn}>RELOAD CLIENT</button>
        </div>

        <pre id="voidlink-crash-report" style={{
          marginTop: 18, padding: 16,
          background: '#0a0a0a', border: '1px solid #1e1e1e',
          color: '#909090', fontSize: 11, lineHeight: 1.5,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          maxHeight: '50vh', overflow: 'auto',
        }}>{this.buildReport()}</pre>
      </div>
    )
  }
}

const btn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #00cfff',
  color: '#00cfff',
  padding: '8px 16px',
  fontFamily: 'inherit',
  fontSize: 10,
  letterSpacing: '0.18em',
  cursor: 'pointer',
}
