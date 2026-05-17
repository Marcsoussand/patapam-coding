import type { ActionId } from '../types/game'
import { ACTIONS } from '../data/levels'

const BG = '#2979d4'
const FG = '#ffffff'
const S  = 32   // viewBox size
const SW = 3    // stroke width

// Right arrow (swim) — same style, explicit SVG so all 3 are visually identical
function SwimIcon() {
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ display: 'block' }}>
      <rect width={S} height={S} rx="6" fill={BG}/>
      {/* Shaft: 5→22, Arrowhead: fork at 15 */}
      <line x1="5" y1="16" x2="22" y2="16" stroke={FG} strokeWidth={SW} strokeLinecap="round"/>
      <polyline points="15,9 22,16 15,23" fill="none" stroke={FG} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Jump: starts from BOTTOM, goes UP then turns RIGHT  (equal 16px branches, elbow at top-left)
function JumpIcon() {
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ display: 'block' }}>
      <rect width={S} height={S} rx="6" fill={BG}/>
      {/* L-path: (10,26) → (10,10) → (26,10) — each branch = 16px */}
      <polyline points="10,26 10,10 26,10" fill="none" stroke={FG} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrowhead pointing right at (26,10) */}
      <polyline points="20,4 26,10 20,16" fill="none" stroke={FG} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Dive: starts from TOP, goes down → then turns RIGHT  (equal 16px branches, elbow at bottom-left)
function DiveIcon() {
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ display: 'block' }}>
      <rect width={S} height={S} rx="6" fill={BG}/>
      {/* L-path: (10,6) → (10,22) → (26,22) — each branch = 16px */}
      <polyline points="10,6 10,22 26,22" fill="none" stroke={FG} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrowhead pointing right at (26,22) */}
      <polyline points="20,16 26,22 20,28" fill="none" stroke={FG} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const SVG_ICONS: Partial<Record<ActionId, () => JSX.Element>> = {
  swim:  SwimIcon,
  jump:  JumpIcon,
  dive:  DiveIcon,
}

interface ActionIconProps {
  actionId: ActionId
  size?: number
}

export default function ActionIcon({ actionId }: ActionIconProps) {
  const SvgComp = SVG_ICONS[actionId]
  if (SvgComp) return <SvgComp />
  const action = ACTIONS[actionId]
  return <span>{action.icon}</span>
}
