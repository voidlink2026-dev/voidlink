export const colors = {
  bg: {
    base: '#0a0a0a',
    surface: '#111111',
    elevated: '#1a1a1a',
    overlay: '#222222',
  },
  accent: {
    green: '#39ff14',
    greenDim: '#1a7a00',
    cyan: '#00cfff',
    cyanDim: '#006080',
    amber: '#ff9900',
    red: '#ff2d20',
    white: '#e8e8e8',
  },
  text: {
    primary: '#e8e8e8',
    secondary: '#888888',
    muted: '#444444',
    green: '#39ff14',
    danger: '#ff2d20',
  },
  border: {
    default: '#2a2a2a',
    active: '#39ff14',
    danger: '#ff2d20',
  },
} as const

export const fonts = {
  mono: '"JetBrains Mono", "Courier New", monospace',
  display: '"Rajdhani", "Orbitron", sans-serif',
  body: '"Inter", system-ui, sans-serif',
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const

export const radii = {
  sm: '2px',
  md: '4px',
  lg: '8px',
} as const

export const shadows = {
  greenGlow: '0 0 8px rgba(57,255,20,0.4), 0 0 20px rgba(57,255,20,0.15)',
  cyanGlow: '0 0 8px rgba(0,207,255,0.4), 0 0 20px rgba(0,207,255,0.15)',
  redGlow: '0 0 8px rgba(255,45,32,0.5)',
  window: '0 4px 32px rgba(0,0,0,0.8)',
} as const

export const zIndex = {
  base: 0,
  window: 100,
  windowActive: 200,
  modal: 1000,
  tooltip: 1100,
  notification: 1200,
} as const

export const animation = {
  durationFast: 120,
  durationNormal: 220,
  durationSlow: 400,
  easeOut: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
  easeInOut: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
} as const
