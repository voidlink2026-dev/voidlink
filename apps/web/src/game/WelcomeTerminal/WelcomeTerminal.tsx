import { useState } from 'react'
import { Terminal } from '@voidlink/ui'
import type { TerminalLine } from '@voidlink/ui'
import { useGameStore } from '../../store/gameStore.ts'

export function WelcomeTerminal() {
  const storeLines = useGameStore((s) => s.terminalLines)
  const [input, setInput] = useState('')
  const logTerminal = useGameStore((s) => s.logTerminal)
  const openWindow = useGameStore((s) => s.openWindow)

  const lines: TerminalLine[] = storeLines.map((l) => ({
    id: l.id,
    type: l.type as TerminalLine['type'],
    text: l.text,
  }))

  function handleSubmit(value: string) {
    const cmd = value.trim().toLowerCase()
    logTerminal(value, 'input')
    setInput('')

    if (!cmd) return

    if (cmd === 'help') {
      logTerminal('Available commands: help, missions, status, clear', 'system')
    } else if (cmd === 'missions') {
      openWindow({
        id: 'missions',
        title: 'MISSION BOARD',
        component: 'MissionBoard',
        x: 200,
        y: 100,
        width: 560,
        height: 480,
        isMinimized: false,
      })
      logTerminal('Opening mission board...', 'system')
    } else if (cmd === 'status') {
      logTerminal('Gateway: ONLINE | Trace: CLEAN | Credits: 5000 Cr', 'success')
    } else if (cmd === 'clear') {
      // clearing is handled by resetting store lines — simplified here
      logTerminal('Terminal cleared.', 'dim')
    } else {
      logTerminal(`Command not found: ${cmd}`, 'error')
    }
  }

  return (
    <Terminal
      lines={lines}
      inputValue={input}
      onInputChange={setInput}
      onInputSubmit={handleSubmit}
    />
  )
}
