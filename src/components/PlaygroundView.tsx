import React, { useState, useMemo, useEffect } from 'react';
import { PLAYGROUND_PRESETS } from '../data/presets';
import { executeRegexMatch, buildHighlightSegments, GROUP_COLOR_CLASSES } from '../utils/matcher';
import { sounds } from '../utils/sound';
import {
  Play,
  Copy,
  Check,
  Share2,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  FileText
} from 'lucide-react';

interface PlaygroundViewProps {
  initialPattern?: string;
  initialFlags?: string;
  isDark: boolean;
}

const DEFAULT_PATTERN = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
const DEFAULT_FLAGS = 'g';
const DEBOUNCE_MS = 200;

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  initialPattern,
  initialFlags,
  isDark
}) => {
  // Load state from URL hash or defaults
  const [pattern, setPattern] = useState<string>(() => {
    if (initialPattern !== undefined) return initialPattern;
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#regex=')) {
        const params = new URLSearchParams(hash.slice(1));
        const p = params.get('regex');
        if (p) return decodeURIComponent(p);
      }
      const saved = localStorage.getItem('regexdojo_pg_pattern');
      return saved || DEFAULT_PATTERN;
    } catch {
      return DEFAULT_PATTERN;
    }
  });

  const [flags, setFlags] = useState<string>(() => {
    if (initialFlags !== undefined) return initialFlags;
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#regex=')) {
        const params = new URLSearchParams(hash.slice(1));
        const f = params.get('flags');
        if (f !== null) return f;
      }
      const saved = localStorage.getItem('regexdojo_pg_flags');
      return saved !== null ? saved : DEFAULT_FLAGS;
    } catch {
      return DEFAULT_FLAGS;
    }
  });

  const [testText, setTestText] = useState<string>(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#regex=')) {
        const params = new URLSearchParams(hash.slice(1));
        const t = params.get('text');
        if (t) return decodeURIComponent(t);
      }
      const saved = localStorage.getItem('regexdojo_pg_text');
      return saved || PLAYGROUND_PRESETS[1].content; // Customer directory default
    } catch {
      return PLAYGROUND_PRESETS[1].content;
    }
  });

  // Debounced copies of the expensive inputs — the regex engine only re-runs
  // once the user pauses typing, keeping the UI responsive.
  const [debouncedPattern, setPatternState] = useState<string>(pattern);
  const [debouncedText, setTextState] = useState<string>(testText);

  // Push debounced values forward after the quiet period.
  useEffect(() => {
    const id = setTimeout(() => setPatternState(pattern), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [pattern]);
  useEffect(() => {
    const id = setTimeout(() => setTextState(testText), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [testText]);

  const [copiedPattern, setCopiedPattern] = useState<boolean>(false);
  const [copiedMatches, setCopiedMatches] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('regexdojo_pg_pattern', pattern);
      localStorage.setItem('regexdojo_pg_flags', flags);
      localStorage.setItem('regexdojo_pg_text', testText);
    } catch {
      // ignore
    }
  }, [pattern, flags, testText]);

  // Execute regex (driven by debounced inputs so it doesn't recompile per keystroke)
  const matchResult = useMemo(() => {
    return executeRegexMatch(debouncedPattern, flags, debouncedText);
  }, [debouncedPattern, flags, debouncedText]);

  // Build segments for visual highlighted rendering
  const segments = useMemo(() => {
    return buildHighlightSegments(debouncedText, matchResult.matches);
  }, [debouncedText, matchResult.matches]);

  // Flag toggler
  const toggleFlag = (flagChar: string) => {
    sounds.playClick();
    if (flags.includes(flagChar)) {
      setFlags(flags.replace(flagChar, ''));
    } else {
      setFlags(flags + flagChar);
    }
  };

  const handleSelectPresetText = (presetId: string) => {
    sounds.playClick();
    const found = PLAYGROUND_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setTestText(found.content);
      setSelectedMatchIndex(null);
    }
  };

  const handleCopyPattern = () => {
    sounds.playClick();
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopiedPattern(true);
    setTimeout(() => setCopiedPattern(false), 1500);
  };

  const handleCopyMatches = () => {
    sounds.playClick();
    const lines = matchResult.matches.map((m) => m.match).join('\n');
    navigator.clipboard.writeText(lines);
    setCopiedMatches(true);
    setTimeout(() => setCopiedMatches(false), 1500);
  };

  const handleShareLink = () => {
    sounds.playClick();
    const params = new URLSearchParams();
    params.set('regex', pattern);
    params.set('flags', flags);
    params.set('text', testText);
    const fullUrl = `${window.location.origin}${window.location.pathname}#${params.toString()}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReset = () => {
    sounds.playClick();
    setPattern('');
    setFlags('g');
    setTestText('');
    setSelectedMatchIndex(null);
  };

  const flagList = [
    { key: 'g', label: 'global', desc: 'Find all matches rather than stopping after the first' },
    { key: 'i', label: 'insensitive', desc: 'Case insensitive match' },
    { key: 'm', label: 'multiline', desc: '^ and $ match start/end of line' },
    { key: 's', label: 'dotAll', desc: '. matches newlines as well' },
    { key: 'u', label: 'unicode', desc: 'Full unicode support' }
  ];

  return (
    <div id="playground-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-rose-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Play className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight heading-bar-h2">Regex Playground</h1>
          </div>
          <p className="text-xs mt-2 text-neutral-400">
            Live interactive regex testing laboratory with capture group inspection and shareable links.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="share-playground-btn"
            onClick={handleShareLink}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              copiedLink
                ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(255,79,99,0.3)]'
                : 'border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Playground'}</span>
          </button>

          <button
            id="copy-playground-pattern-btn"
            onClick={handleCopyPattern}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              copiedPattern
                ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(255,79,99,0.3)]'
                : 'border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {copiedPattern ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPattern ? 'Copied' : 'Copy Regex'}</span>
          </button>

          <button
            id="reset-playground-btn"
            onClick={handleReset}
            title="Reset playground"
            className="p-2 rounded-xl border border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pattern Input & Flag Toggles */}
      <div className="p-5 rounded-2xl glazz-panel space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Regular Expression
          </label>

          {/* Flags Toggles */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-neutral-500 mr-1 hidden sm:inline">Flags:</span>
            {flagList.map((f) => {
              const isActive = flags.includes(f.key);
              return (
                <button
                  key={f.key}
                  id={`flag-toggle-${f.key}`}
                  onClick={() => toggleFlag(f.key)}
                  title={`${f.label} (${f.key}): ${f.desc}`}
                  aria-pressed={isActive}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(255,79,99,0.5)]'
                      : 'bg-black/50 border border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
                  }`}
                >
                  {f.key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern input field */}
        <div
          className={`flex items-center px-3 py-3 rounded-xl border font-mono text-sm transition-all ${
            !matchResult.isValid
              ? 'border-rose-500 ring-2 ring-rose-500/25 bg-rose-950/20'
              : 'border-rose-500/40 bg-black/60 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/25'
          }`}
        >
          <span className="text-rose-500 font-bold select-none text-base">/</span>
          <input
            id="playground-pattern-input"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="enter pattern to match..."
            spellCheck="false"
            className="flex-1 bg-transparent px-2 font-mono text-sm sm:text-base text-rose-300 focus:outline-none placeholder:text-neutral-600"
          />
          <span className="text-rose-500 font-bold select-none text-base">/</span>
          <span className="text-amber-400 font-mono text-xs px-2 font-semibold select-none">
            {flags}
          </span>
        </div>

        {!matchResult.isValid && matchResult.errorDetails && (
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <div>
                <span className="font-bold">{matchResult.errorDetails.title}: </span>
                <span>{matchResult.errorDetails.friendly}</span>
              </div>
              <p className="text-rose-300/80">
                <span className="font-semibold text-rose-200">Likely fix: </span>
                {matchResult.errorDetails.likelyFix}
              </p>
              <p className="text-[10px] text-neutral-500 font-mono">
                Raw engine message: {matchResult.errorDetails.raw}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl glazz-card border-white/10">
          <div className="text-[11px] font-semibold text-neutral-400">Total Matches</div>
          <div className="text-xl font-mono font-bold text-rose-400 text-glow-crimson mt-0.5">{matchResult.totalMatches}</div>
        </div>
        <div className="p-3.5 rounded-xl glazz-card border-white/10">
          <div className="text-[11px] font-semibold text-neutral-400">Characters Matched</div>
          <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">{matchResult.totalCharsMatched}</div>
        </div>
        <div className="p-3.5 rounded-xl glazz-card border-white/10">
          <div className="text-[11px] font-semibold text-neutral-400">Execution Speed</div>
          <div className="text-xl font-mono font-bold text-rose-300 mt-0.5">{matchResult.executionTimeMs} ms</div>
        </div>
        <div className="p-3.5 rounded-xl glazz-card border-white/10">
          <div className="text-[11px] font-semibold text-neutral-400">Engine Status</div>
          <div className="text-sm font-semibold text-neutral-200 mt-1 flex items-center gap-1.5 font-mono">
            <span className={`w-2 h-2 rounded-full ${matchResult.isValid ? 'bg-rose-400 shadow-[0_0_6px_#ff4f63]' : 'bg-red-600'}`} />
            <span>{matchResult.isValid ? 'Active & Ready' : 'Syntax Error'}</span>
          </div>
        </div>
      </div>

      {/* Dual Panel: Test Text Input (Left) & Live Match Highlight Display (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Test Text Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Input Text</span>
            </label>

            {/* Presets dropdown/chips */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-neutral-500 mr-1 hidden sm:inline">Fixtures:</span>
              {PLAYGROUND_PRESETS.map((fp) => (
                <button
                  key={fp.id}
                  onClick={() => handleSelectPresetText(fp.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    testText === fp.content
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(255,79,99,0.3)]'
                      : 'border-white/10 text-neutral-400 hover:text-neutral-200 bg-black/40'
                  }`}
                >
                  {fp.name}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="playground-test-textarea"
            rows={12}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="paste or write sample text to test against..."
            spellCheck="false"
            className="w-full p-3.5 rounded-2xl border border-rose-500/30 bg-black/60 font-mono text-xs leading-relaxed focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-500/30 transition-all resize-y text-neutral-200"
          />
        </div>

        {/* Right: Live Match Highlighting Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Live Match Visualizer</span>
            </label>
            <span className="text-[10px] font-mono text-rose-400 font-bold">
              {matchResult.totalMatches} matches highlighted
            </span>
          </div>

          <div
            id="playground-highlight-preview"
            className="w-full h-[276px] p-3.5 rounded-2xl border border-rose-500/30 glazz-panel font-mono text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap break-all select-text transition-all text-neutral-300"
          >
            {segments.length === 0 || !testText ? (
              <span className="text-neutral-600 italic">No text provided. Type or select a fixture above.</span>
            ) : (
              segments.map((seg, idx) => {
                if (seg.isMatch) {
                  return (
                    <mark
                      key={idx}
                      className="bg-rose-500/30 text-rose-200 px-1 py-0.5 rounded border border-rose-500/60 font-bold hover:bg-rose-500/50 shadow-[0_0_8px_rgba(255,79,99,0.3)] transition-colors"
                      title={`Match #${seg.matchIndex}`}
                    >
                      {seg.text}
                    </mark>
                  );
                }
                return <span key={idx}>{seg.text}</span>;
              })
            )}
          </div>
        </div>
      </div>

      {/* Matches & Capture Groups Inspector Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400/80">
              Match & Capture Groups Inspector ({matchResult.matches.length})
            </h3>
          </div>

          {matchResult.matches.length > 0 && (
            <button
              id="copy-all-matches-btn"
              onClick={handleCopyMatches}
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
                copiedMatches
                  ? 'bg-rose-500/25 text-rose-300 border-rose-500/40'
                  : 'border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {copiedMatches ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMatches ? 'Copied' : 'Copy All Matches'}</span>
            </button>
          )}
        </div>

        {matchResult.matches.length === 0 ? (
          <div className="p-8 rounded-2xl border border-white/10 glazz-panel text-center text-xs text-neutral-500">
            No matches found for the current pattern and text.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 glazz-panel">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black/60 text-neutral-400 border-b border-white/10">
                  <th className="py-3 px-4 font-semibold w-16">#</th>
                  <th className="py-3 px-4 font-semibold w-32">Range</th>
                  <th className="py-3 px-4 font-semibold">Matched Text</th>
                  <th className="py-3 px-4 font-semibold">Capture Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matchResult.matches.map((m) => (
                  <tr
                    key={m.index}
                    className="hover:bg-white/5 text-neutral-300 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      #{m.index}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400">
                      [{m.start}–{m.end}]
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold max-w-xs truncate">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {m.match}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {m.groups.length === 0 ? (
                        <span className="text-neutral-500 italic">None</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {m.groups.map((grp, gIdx) => (
                            <span
                              key={gIdx}
                              className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                                GROUP_COLOR_CLASSES[(gIdx + 1) % GROUP_COLOR_CLASSES.length]
                              }`}
                            >
                              G{grp.index}: &quot;{grp.value}&quot;
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
