import React, { useState } from 'react';
import { X, Search, Copy, Check, BookOpen } from 'lucide-react';

interface CheatSheetItem {
  token: string;
  name: string;
  category: string;
  desc: string;
  example: string;
}

const CHEAT_ITEMS: CheatSheetItem[] = [
  // Anchors
  { token: '^', name: 'Start of line', category: 'Anchors', desc: 'Asserts the start of a string or line', example: '^The' },
  { token: '$', name: 'End of line', category: 'Anchors', desc: 'Asserts the end of a string or line', example: 'end$' },
  { token: '\\b', name: 'Word boundary', category: 'Anchors', desc: 'Zero-width boundary between word & non-word', example: '\\bcat\\b' },
  { token: '\\B', name: 'Non-word boundary', category: 'Anchors', desc: 'Position where adjacent chars are both word/non-word', example: '\\Bcat\\B' },

  // Character Classes
  { token: '.', name: 'Any character (Dot)', category: 'Classes', desc: 'Matches any single character except line breaks', example: 'c.t' },
  { token: '[abc]', name: 'Character set', category: 'Classes', desc: 'Matches any single character in the brackets', example: '[aeiou]' },
  { token: '[^abc]', name: 'Negated set', category: 'Classes', desc: 'Matches any single character NOT in the brackets', example: '[^0-9]' },
  { token: '[a-z]', name: 'Range', category: 'Classes', desc: 'Matches any character between a and z inclusive', example: '[0-9a-f]' },
  { token: '\\d', name: 'Digit', category: 'Classes', desc: 'Matches any digit (0-9)', example: '\\d{4}' },
  { token: '\\D', name: 'Non-digit', category: 'Classes', desc: 'Matches any non-digit character', example: '\\D+' },
  { token: '\\w', name: 'Word character', category: 'Classes', desc: 'Matches letters, numbers, and underscore [a-zA-Z0-9_]', example: '\\w+' },
  { token: '\\W', name: 'Non-word character', category: 'Classes', desc: 'Matches punctuation, spaces, symbols', example: '\\W+' },
  { token: '\\s', name: 'Whitespace', category: 'Classes', desc: 'Matches spaces, tabs, newlines', example: '\\s+' },
  { token: '\\S', name: 'Non-whitespace', category: 'Classes', desc: 'Matches non-whitespace characters', example: '\\S+' },

  // Quantifiers
  { token: '*', name: 'Zero or more', category: 'Quantifiers', desc: 'Repeats preceding item 0 or more times (greedy)', example: 'a*' },
  { token: '+', name: 'One or more', category: 'Quantifiers', desc: 'Repeats preceding item 1 or more times (greedy)', example: 'a+' },
  { token: '?', name: 'Optional (0 or 1)', category: 'Quantifiers', desc: 'Preceding item appears 0 or 1 time', example: 'colou?r' },
  { token: '{n}', name: 'Exact count', category: 'Quantifiers', desc: 'Preceding item repeats exactly n times', example: '\\d{4}' },
  { token: '{n,}', name: 'At least n', category: 'Quantifiers', desc: 'Preceding item repeats n or more times', example: '\\w{3,}' },
  { token: '{n,m}', name: 'Range count', category: 'Quantifiers', desc: 'Preceding item repeats between n and m times', example: '\\d{2,4}' },
  { token: '*?', name: 'Lazy star', category: 'Quantifiers', desc: 'Matches 0 or more times, taking as few as possible', example: '<.*?>' },

  // Groups & Logic
  { token: '(abc)', name: 'Capture Group', category: 'Groups', desc: 'Groups tokens and stores match into memory', example: '(\\d{3})' },
  { token: '(?:abc)', name: 'Non-capturing Group', category: 'Groups', desc: 'Groups tokens together without allocating memory', example: '(?:https?|ftp)' },
  { token: 'a|b', name: 'Alternation (OR)', category: 'Groups', desc: 'Matches pattern a OR pattern b', example: 'cat|dog' },
  { token: '(?=abc)', name: 'Positive Lookahead', category: 'Lookarounds', desc: 'Asserts pattern follows without consuming it', example: '\\d+(?=px)' },
  { token: '(?!abc)', name: 'Negative Lookahead', category: 'Lookarounds', desc: 'Asserts pattern does NOT follow', example: '\\d+(?!px)' },
  { token: '(?<=abc)', name: 'Positive Lookbehind', category: 'Lookarounds', desc: 'Asserts pattern precedes without consuming it', example: '(?<=\\$)\\d+' },
  { token: '(?<!abc)', name: 'Negative Lookbehind', category: 'Lookarounds', desc: 'Asserts pattern does NOT precede', example: '(?<!\\$)\\d+' },

  // Flags
  { token: 'g', name: 'Global flag', category: 'Flags', desc: 'Do not return after first match; find all matches', example: '/cat/g' },
  { token: 'i', name: 'Insensitive flag', category: 'Flags', desc: 'Case-insensitive matching', example: '/cat/i' },
  { token: 'm', name: 'Multiline flag', category: 'Flags', desc: '^ and $ match line start and end, not just string', example: '/^cat/m' },
  { token: 's', name: 'DotAll flag', category: 'Flags', desc: 'Allows dot (.) to match newline characters \\n', example: '/.*/s' }
];

export const CheatSheetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}> = ({ isOpen, onClose, isDark }) => {
  const [search, setSearch] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Anchors', 'Classes', 'Quantifiers', 'Groups', 'Lookarounds', 'Flags'];

  const filtered = CHEAT_ITEMS.filter((item) => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch =
      item.token.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  return (
    <div
      id="cheat-sheet-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="cheat-sheet-modal-card"
        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl flex flex-col ember-glass-panel-crimson shadow-2xl overflow-hidden transition-colors text-neutral-100 shadow-rose-950/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(239,35,60,0.2)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight heading-bar-h3 text-neutral-100">Dojo Quick Reference</h2>
              <p className="text-xs text-neutral-400">
                Emergency regex cheat sheet for the weary developer
              </p>
            </div>
          </div>
          <button
            id="close-cheatsheet-btn"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
            aria-label="Close cheat sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-rose-500/15 bg-black/50 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/70" />
            <input
              id="cheatsheet-search-input"
              type="text"
              placeholder="Search token, anchor, quantifier, or meaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-white/10 bg-black/60 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40 transition-colors shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat}`}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'btn-ember-primary shadow-sm'
                    : 'bg-black/40 border border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-400">
                No regex tokens match &quot;{search}&quot;. Even regex magic has its boundaries.
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl ember-glass-card hover:border-rose-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="crimson-terminal-code font-mono text-sm px-2.5 py-1 rounded-md font-bold">
                    {item.token}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-100">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-rose-500/15 text-rose-300 border border-rose-500/20">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-[11px] text-neutral-500">e.g.</span>
                    <code className="text-xs px-2 py-0.5 rounded font-mono bg-black/60 border border-white/10 text-amber-300">
                      {item.example}
                    </code>
                  </div>
                  <button
                    id={`copy-token-${idx}`}
                    onClick={() => handleCopy(item.token)}
                    title="Copy token to clipboard"
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      copiedToken === item.token
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_10px_rgba(239,35,60,0.3)]'
                        : 'border-white/10 hover:bg-white/10 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {copiedToken === item.token ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-rose-500/20 bg-black/60 text-xs flex items-center justify-between text-neutral-400">
          <span>Click copy button to grab token syntax instantly</span>
          <span className="text-rose-400 font-mono font-semibold">{filtered.length} patterns indexed</span>
        </div>
      </div>
    </div>
  );
};
