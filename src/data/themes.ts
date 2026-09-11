import { ThemeOption } from '../types';

export const THEMES: ThemeOption[] = [
  {
    id: 'warm-halo',
    name: 'Warm-Halo',
    category: 'Custom Style',
    tagline: 'Frosted dark glass with crimson & amber halo glow & Willemstadt header accents',
    sourceLabel: 'Warm-Halo Glass Edition',
    sourceUrl: 'https://github.com/sasecurityn/Ember-Glazz',
    palette: {
      primary: '#ff4f63',
      secondary: '#ff6a3d',
      background: '#08080a',
      panel: 'rgba(22, 22, 27, 0.72)',
      border: 'rgba(255, 79, 99, 0.35)',
      text: '#e9e6e8',
      glow: 'rgba(255, 79, 99, 0.45)'
    },
    sampleCode: '/^[a-z0-9_]{3,16}$/i'
  },
  {
    id: 'glacius',
    name: 'Glacius',
    category: 'Custom Style',
    tagline: 'Glacial crystalline energy, cosmic nebula, and deep obsidian frost',
    sourceLabel: 'Glacius Obsidian Edition',
    sourceUrl: 'https://github.com/cosmicseafox/Aether-Core',
    palette: {
      primary: '#00f0ff',
      secondary: '#38bdf8',
      background: '#0b0e14',
      panel: 'rgba(14, 20, 30, 0.76)',
      border: 'rgba(0, 240, 255, 0.32)',
      text: '#e2f1f8',
      glow: 'rgba(0, 240, 255, 0.4)'
    },
    sampleCode: '/^glacius_core\\.[a-z]+$/m'
  },
  {
    id: 'nord',
    name: 'Nord',
    category: 'VSCode Classic',
    tagline: 'Arctic frost, polar night atmosphere & aurora cyan luminescence',
    sourceLabel: 'VSCode / Arctic Ice Studio',
    palette: {
      primary: '#88c0d0',
      secondary: '#81a1c1',
      background: '#242933',
      panel: 'rgba(46, 52, 64, 0.78)',
      border: 'rgba(136, 192, 208, 0.32)',
      text: '#eceff4',
      glow: 'rgba(136, 192, 208, 0.35)'
    },
    sampleCode: '/^nord\\b(frost|aurora)$/i'
  },
  {
    id: 'dracula',
    name: 'Dracula',
    category: 'VSCode Classic',
    tagline: 'Vampire gothic darkness, electric neon purple, pink & spring green',
    sourceLabel: 'VSCode / Zeno Rocha',
    palette: {
      primary: '#bd93f9',
      secondary: '#ff79c6',
      background: '#21222c',
      panel: 'rgba(40, 42, 54, 0.82)',
      border: 'rgba(189, 147, 249, 0.36)',
      text: '#f8f8f2',
      glow: 'rgba(189, 147, 249, 0.42)'
    },
    sampleCode: '/^dracula_(vampire|bat)\\d+$/'
  },
  {
    id: 'abyss',
    name: 'Abyss',
    category: 'VSCode Classic',
    tagline: 'Deep ocean trench midnight blue with electric cyan & abyssal gold',
    sourceLabel: 'VSCode Official Abyss',
    palette: {
      primary: '#0088ff',
      secondary: '#22ddff',
      background: '#000c18',
      panel: 'rgba(6, 21, 40, 0.84)',
      border: 'rgba(0, 136, 255, 0.35)',
      text: '#d0e4f5',
      glow: 'rgba(0, 136, 255, 0.45)'
    },
    sampleCode: '/^abyss\\.(depth|trench)\\b/'
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    category: 'VSCode Classic',
    tagline: 'Shinjuku twilight rain, neon cyberpunk blue, magenta & electric cyan',
    sourceLabel: 'VSCode / Enkia',
    palette: {
      primary: '#7aa2f7',
      secondary: '#bb9af7',
      background: '#16161e',
      panel: 'rgba(26, 27, 38, 0.82)',
      border: 'rgba(122, 162, 247, 0.35)',
      text: '#c0caf5',
      glow: 'rgba(122, 162, 247, 0.42)'
    },
    sampleCode: '/^tokyo_(neon|rain)_[0-9]+$/'
  }
];
