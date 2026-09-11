export type AppMode = 'intro' | 'learn' | 'translate' | 'playground';

export type ThemeId =
  | 'warm-halo'
  | 'glacius'
  | 'nord'
  | 'dracula'
  | 'abyss'
  | 'tokyo-night'
  | 'ember-glazz'
  | 'aether-core';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: 'Custom Style' | 'VSCode Classic';
  tagline: string;
  sourceLabel: string;
  sourceUrl?: string;
  palette: {
    primary: string;       // Primary accent (hex)
    secondary: string;     // Secondary highlight (hex)
    background: string;    // Main dark bg (hex)
    panel: string;         // Glass panel background
    border: string;        // Panel border
    text: string;          // Primary text
    glow: string;          // Glow shadow color
  };
  sampleCode: string;
}

export interface TestCase {
  id: string;
  text: string;
  shouldMatch: boolean;
  explanation: string;
}

export interface Lesson {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  beltTier: string;
  theory: string[]; // 2-4 paragraphs with dark humor & clear pedagogy
  hint: string;
  solution: string;
  flags?: string;
  exercisePrompt: string;
  testCases: TestCase[];
  tip?: string;
}

export interface TokenBreakdown {
  raw: string;
  type: 'literal' | 'dot' | 'anchor' | 'class' | 'shorthand' | 'quantifier' | 'group' | 'alternation' | 'boundary' | 'lookaround' | 'escape' | 'flag' | 'unknown';
  label: string;
  color: string;
  description: string;
  matchExample?: string;
}

export interface RegexMatchDetail {
  index: number;
  match: string;
  start: number;
  end: number;
  groups: { name?: string; value: string; index?: number }[];
}

export interface MatchHighlightSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
  groupIndex?: number;
}

export interface PresetPattern {
  id: string;
  name: string;
  category: string;
  pattern: string;
  flags: string;
  description: string;
}

export interface PlaygroundPresetText {
  id: string;
  name: string;
  content: string;
}
