// Définition des niveaux du tutoriel avec Mollasson
// Grille : 'wall' = obstacle | 'path' = chemin | 'start' = départ | 'end' = arrivée

export const TUTORIAL_LEVELS = [
  {
    id: 'tuto-1',
    title: 'Tout droit !',
    description: "Aide Mollasson à descendre la branche jusqu'au bout.",
    hero: 'mollasson',
    grid: [
      ['wall', 'wall', 'start', 'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'end',   'wall', 'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['move_forward'],
    maxActions: 10,
  },
  {
    id: 'tuto-2',
    title: 'Le coude',
    description: 'La branche tourne ! Mollasson doit changer de direction.',
    hero: 'mollasson',
    grid: [
      ['wall', 'wall', 'start', 'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'path', 'end' ],
      ['wall', 'wall', 'wall',  'wall', 'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['move_forward', 'turn_left', 'turn_right'],
    maxActions: 10,
  },
  {
    id: 'tuto-3',
    title: 'Deux virages',
    description: 'Deux virages à négocier pour Mollasson !',
    hero: 'mollasson',
    grid: [
      ['wall', 'wall', 'start', 'wall', 'wall'],
      ['wall', 'wall', 'path',  'wall', 'wall'],
      ['wall', 'wall', 'path',  'path', 'wall'],
      ['wall', 'wall', 'wall',  'path', 'wall'],
      ['wall', 'wall', 'wall',  'end',  'wall'],
    ],
    heroStart: { row: 0, col: 2, direction: 'down' },
    availableActions: ['move_forward', 'turn_left', 'turn_right'],
    maxActions: 15,
  },
]

// Catalogue de toutes les actions disponibles dans le jeu
export const ACTIONS = {
  move_forward: { id: 'move_forward', label: 'Avancer',          icon: '⬇️', iconBg: false },
  turn_left:    { id: 'turn_left',    label: 'Tourner à gauche', icon: '↳',  iconBg: true  },
  turn_right:   { id: 'turn_right',   label: 'Tourner à droite', icon: '↲',  iconBg: true  },
}
