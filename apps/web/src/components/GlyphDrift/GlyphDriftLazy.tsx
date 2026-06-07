import { lazy, Suspense, type CSSProperties } from 'react'

// L6 — Lazy wrapper around the GlyphDrift / Neon Data Globe. Three.js +
// topojson-client are roughly 600KB raw and only get used as an ambient
// background. Lazy-loading lets the boot/prologue/login paint without them,
// then they stream in behind the scenes once the user has interacted.
// Suspense fallback is `null` — the absence of the globe for one tick is
// invisible in practice and would otherwise be a layout-shift hazard.

const GlyphDriftImpl = lazy(async () => {
  const mod = await import('./GlyphDrift.tsx')
  return { default: mod.GlyphDrift }
})

interface GlyphDriftLazyProps {
  opacity?: number
  density?: number
  className?: string
  style?: CSSProperties
}

export function GlyphDrift(props: GlyphDriftLazyProps) {
  return (
    <Suspense fallback={null}>
      <GlyphDriftImpl {...props} />
    </Suspense>
  )
}
