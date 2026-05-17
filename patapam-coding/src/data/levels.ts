import type { Level, ActionDef, ActionId, HeroId } from '../types/game'

export const TUTORIAL_LEVELS: Level[] = [
  {
    id: 'tuto-1',
    title: 'levels.tuto1.title',
    description: 'levels.tuto1.description',
    hero: 'mollasson',
    grid: [
      ['wall', 'wall', 'start', 'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'end',   'wall', 'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['down'],
    maxActions: 10,
  },
  {
    id: 'tuto-2',
    title: 'levels.tuto2.title',
    description: 'levels.tuto2.description',
    hero: 'mollasson',
    grid: [
      ['wall', 'wall', 'start', 'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'path', 'end' ],
      ['wall', 'wall', 'wall',  'wall', 'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['down', 'right'],
    maxActions: 10,
  },
  {
    id: 'tuto-3',
    title: 'levels.tuto3.title',
    description: 'levels.tuto3.description',
    hero: 'mollasson',
    grid: [
      ['wall', 'wall', 'start', 'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'path', 'wall'],
      ['wall', 'wall', 'wall',  'path', 'wall'],
      ['wall', 'wall', 'wall',  'end',  'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['down', 'right'],
    maxActions: 15,
  },
  {
    id: 'tuto-4',
    title: 'levels.tuto4.title',
    description: 'levels.tuto4.description',
    hero: 'mollasson',
    //
    //  S . . # .
    //  . # . # .
    //  . # . . .
    //  . . # # .
    //  # . . . E
    //
    // Chemin A (droite en premier) : →→↓↓→→↓↓
    // Chemin B (bas en premier)    : ↓↓↓→↓→→→
    grid: [
      ['start', 'path', 'path', 'wall', 'path'],
      ['path',  'wall', 'path', 'wall', 'path'],
      ['path',  'wall', 'path', 'path', 'path'],
      ['path',  'path', 'wall', 'wall', 'path'],
      ['wall',  'path', 'path', 'path', 'end' ],
    ],
    heroStart: { row: 0, col: 0, direction: 'down' },
    availableActions: ['down', 'right'],
    maxActions: 12,
  },
  {
    id: 'tuto-5',
    title: 'levels.tuto5.title',
    description: 'levels.tuto5.description',
    hero: 'mollasson',
    //
    //  # . S # #
    //  # . . # #
    //  # . # # #
    //  # . . . #
    //  E . # # #
    //
    // Chemin A : ←↓↓↓↓←
    // Chemin B : ↓←↓↓↓←
    // (3,2) et (3,3) sont des culs-de-sac tentants)
    grid: [
      ['wall', 'path', 'start', 'wall', 'wall'],
      ['wall', 'path', 'path',  'wall', 'wall'],
      ['wall', 'path', 'wall',  'wall', 'wall'],
      ['wall', 'path', 'path',  'path', 'wall'],
      ['end',  'path', 'wall',  'wall', 'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['down', 'left', 'right'],
    maxActions: 10,
  },
  {
    id: 'tuto-6',
    title: 'levels.tuto6.title',
    description: 'levels.tuto6.description',
    hero: 'mollasson',
    //
    //     1       2       3       4       5
    //  A [START] [WALL]  [path]  [path]  [KEY ]
    //  B [path]  [path]  [path]  [WALL]  [path]
    //  C [WALL]  [path]  [WALL]  [path]  [path]
    //  D [WALL]  [DOOR]  [path]  [path]  [WALL]
    //  E [WALL]  [END ]  [WALL]  [WALL]  [WALL]
    //
    // Solution : ↓→→↑→→ (ramasse clé A5) puis ↓↓←↓←←↓ (traverse porte D2 → sortie E2)
    // Piège   : descente directe A1→B1→B2→C2→D2 sans clé → bloqué !
    grid: [
      ['start', 'wall',    'path',    'path',    'key_red' ],
      ['path',  'path',    'path',    'wall',    'path'    ],
      ['wall',  'path',    'wall',    'path',    'path'    ],
      ['wall',  'door_red','path',    'path',    'wall'    ],
      ['wall',  'end',     'wall',    'wall',    'wall'    ],
    ],
    heroStart: { row: 0, col: 0, direction: 'down' },
    availableActions: ['up', 'down', 'left', 'right'],
    maxActions: 15,
  },
]

export const ACTIONS: Record<ActionId, ActionDef> = {
  up:         { id: 'up',         label: 'Haut',       icon: '⬆️', iconBg: false },
  down:       { id: 'down',       label: 'Bas',        icon: '⬇️', iconBg: false },
  left:       { id: 'left',       label: 'Gauche',     icon: '⬅️', iconBg: false },
  right:      { id: 'right',      label: 'Droite',     icon: '➡️', iconBg: false },
  swim:       { id: 'swim',       label: 'Nager',      icon: '➡️',  iconBg: false },
  jump:       { id: 'jump',       label: 'Sauter',     icon: '↱',   iconBg: false },
  dive:       { id: 'dive',       label: 'Plonger',    icon: '↴',   iconBg: false },
  super_jump: { id: 'super_jump', label: 'Super saut', icon: '⤴️',  iconBg: false },
}

// ── Niveaux Tartuffe ──────────────────────────────────────────────────
export const TARTUFFE_LEVELS: Level[] = [
  {
    id: 'tartuffe-1',
    title: 'levels.tartuffe1.title',
    description: 'levels.tartuffe1.description',
    hero: 'tartuffe',
    //
    //     A          B          C          D          E          F
    // 1 [START]   [wall]   [key_red]   [wall]   [door_red]   [end]
    // 2 [path]    [path]   [path]      [wall]   [path]       [wall]
    // 3 [wall]    [path]   [wall]      [wall]   [path]       [path]
    // 4 [path]    [path]   [path]      [path]   [wall]       [path]
    // 5 [path]    [wall]   [wall]   [door_yel]  [path]       [path]
    // 6 [path]    [path]   [key_yel]   [wall]   [wall]       [wall]
    //
    grid: [
      ['start',    'wall',    'key_red',    'wall',        'door_red',    'end'   ],
      ['path',     'path',    'path',       'wall',        'path',        'wall'  ],
      ['wall',     'path',    'wall',       'wall',        'path',        'path'  ],
      ['path',     'path',    'path',       'path',        'wall',        'path'  ],
      ['path',     'wall',    'wall',       'door_yellow', 'path',        'path'  ],
      ['path',     'path',    'key_yellow', 'wall',        'wall',        'wall'  ],
    ],
    heroStart: { row: 0, col: 0, direction: 'down' },
    availableActions: ['up', 'down', 'left', 'right'],
    maxActions: 30,
  },
]

// ── Niveaux Dauphinou ────────────────────────────────────────────────
export const DAUPHINOU_LEVELS: Level[] = [
  {
    id: 'dauphinou-1',
    title: 'levels.dauphinou1.title',
    description: 'levels.dauphinou1.description',
    hero: 'dauphinou',
    viewMode: 'sidescroll',
    surfaceRow: 2,
    //
    // Vue de côté — 10 col × 5 lignes
    // row 0-1 : ciel/air
    // row 2   : surface (parcours de Dauphinou)
    // row 3   : sous l'eau
    // row 4   : fond marin (murs)
    //
    grid: [
      ['path','path','path','path','path','path','path','path','path','path'],
      ['path','path','path','path','path','path','path','path','path','path'],
      ['start','path','path','path','path','path','path','path','path','end'],
      ['path','path','path','path','path','path','path','path','path','path'],
      ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
    ],
    heroStart: { row: 2, col: 0, direction: 'right' },
    availableActions: ['swim'],
    maxActions: 9,
    // 9 emplacements fixes : 8 pré-remplis + 1 case vide (position 4)
    prefillSequence: ['swim','swim','swim','swim',null,'swim','swim','swim','swim'],
  },
  {
    id: 'dauphinou-2',
    title: 'levels.dauphinou2.title',
    description: 'levels.dauphinou2.description',
    hero: 'dauphinou',
    viewMode: 'sidescroll',
    surfaceRow: 2,
    //
    // Un rocher à la surface (row 2, col 5) → sauter par-dessus
    // Séquence : swim×4, jump, dive, swim×3
    //
    grid: [
      ['path','path','path','path','path','path','path','path','path','path'],
      ['path','path','path','path','path','path','path','path','path','path'],
      ['start','path','path','path','path','wall','path','path','path','end'],
      ['path','path','path','path','path','path','path','path','path','path'],
      ['wall','wall','wall','wall','wall','wall','wall','wall','wall','wall'],
    ],
    heroStart: { row: 2, col: 0, direction: 'right' },
    availableActions: ['swim', 'jump', 'dive'],
    maxActions: 9,
    // 2 cases vides (positions 4 et 5) : l'enfant doit y mettre jump puis dive
    prefillSequence: ['swim','swim','swim','swim',null,null,'swim','swim','swim'],
  },
  {
    id: 'dauphinou-3',
    title: 'levels.dauphinou3.title',
    description: 'levels.dauphinou3.description',
    hero: 'dauphinou',
    viewMode: 'sidescroll',
    surfaceRow: 2,
    //
    // Palmier 2×2 en cols 5-6 (rows 1-2) → passage uniquement sous l'eau
    // Séquence : swim×4, dive, swim (sous palmier), jump, swim×2
    //
    grid: [
      ['path','path','path','path','path','path',      'path',      'path','path','path'],
      ['path','path','path','path','path','palm_tree',  'palm_tree',  'path','path','path'],
      ['start','path','path','path','path','palm_tree', 'palm_tree',  'path','path','end'],
      ['path','path','path','path','path','path',      'path',      'path','path','path'],
      ['wall','wall','wall','wall','wall','wall',      'wall',      'wall','wall','wall'],
    ],
    heroStart: { row: 2, col: 0, direction: 'right' },
    availableActions: ['swim', 'jump', 'dive'],
    maxActions: 9,
    // 3 cases vides : dive (pos 4), swim sous le palmier (pos 5), jump (pos 6)
    prefillSequence: ['swim','swim','swim','swim',null,null,null,'swim','swim'],
  },
  {
    id: 'dauphinou-4',
    title: 'levels.dauphinou4.title',
    description: 'levels.dauphinou4.description',
    hero: 'dauphinou',
    viewMode: 'sidescroll',
    surfaceRow: 2,
    //
    // Rocher (wall) en col 3 row 2 → sauter par-dessus
    // Palmier 2×2 cols 6-7 rows 1-2 → plonger en dessous
    // Séquence : swim×2, jump, dive, swim, dive, swim, jump, swim
    //
    grid: [
      ['path', 'path', 'path', 'path',  'path', 'path', 'path',       'path',       'path', 'path'],
      ['path', 'path', 'path', 'path',  'path', 'path', 'palm_tree',  'palm_tree',  'path', 'path'],
      ['start','path', 'path', 'wall',  'path', 'path', 'palm_tree',  'palm_tree',  'path', 'end'],
      ['path', 'path', 'path', 'path',  'path', 'path', 'path',       'path',       'path', 'path'],
      ['wall', 'wall', 'wall', 'wall',  'wall', 'wall', 'wall',       'wall',       'wall', 'wall'],
    ],
    heroStart: { row: 2, col: 0, direction: 'right' },
    availableActions: ['swim', 'jump', 'dive'],
    maxActions: 9,
    // 4 cases vides : jump (pos 2), dive (pos 3), dive (pos 5), jump (pos 7)
    prefillSequence: ['swim','swim',null,null,'swim',null,'swim',null,'swim'],
  },
]
// ── Table de dispatch par héros ───────────────────────────────────────
export const HERO_LEVELS: Record<HeroId, Level[]> = {
  mollasson: TUTORIAL_LEVELS,
  tartuffe:  TARTUFFE_LEVELS,
  patapam:   [],
  dauphinou: DAUPHINOU_LEVELS,
}
