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
      return saved || '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
    } catch {
      return '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b';
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
      return saved !== null ? saved : 'g';
    } catch {
      return 'g';
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

  // Execute regex
  const matchResult = useMemo(() => {
    return executeRegexMatch(pattern, flags, testText);
  }, [pattern, flags, testText]);

  // Build segments for visual highlighted rendering
  const segments = useMemo(() => {
    return buildHighlightSegments(testText, matchResult.matches);
  }, [testText, matchResult.matches]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Play className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Regex Playground</h1>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Live interactive regex testing laboratory with capture group inspection and shareable links.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="share-playground-btn"
            onClick={handleShareLink}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              copiedLink
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isDark
                ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 shadow-xs'
            }`}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Playground'}</span>
          </button>

          <button
            id="copy-playground-pattern-btn"
            onClick={handleCopyPattern}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              copiedPattern
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isDark
                ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 shadow-xs'
            }`}
          >
            {copiedPattern ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPattern ? 'Copied' : 'Copy Regex'}</span>
          </button>

          <button
            id="reset-playground-btn"
            onClick={handleReset}
            title="Reset playground"
            className={`p-2 rounded-lg border transition-colors ${
              isDark ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pattern Input & Flag Toggles */}
      <div
        className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
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
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 shadow-xs'
                      : isDark
                      ? 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
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
              ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-950/15'
              : isDark
              ? 'border-neutral-700 bg-neutral-950 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20'
              : 'border-neutral-300 bg-neutral-50 focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20'
          }`}
        >
          <span className="text-neutral-500 font-bold select-none text-base">/</span>
          <input
            id="playground-pattern-input"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="enter pattern to match..."
            spellCheck="false"
            className="flex-1 bg-transparent px-2 font-mono text-sm sm:text-base text-amber-400 focus:outline-none placeholder:text-neutral-600"
          />
          <span className="text-neutral-500 font-bold select-none text-base">/</span>
          <span className="text-neutral-400 font-mono text-xs px-2 font-semibold select-none">
            {flags}
          </span>
        </div>

        {!matchResult.isValid && (
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-bold">Regex Syntax Error: </span>
              <span>{matchResult.error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="text-[11px] font-semibold text-neutral-400">Total Matches</div>
          <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">{matchResult.totalMatches}</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="text-[11px] font-semibold text-neutral-400">Characters Matched</div>
          <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">{matchResult.totalCharsMatched}</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="text-[11px] font-semibold text-neutral-400">Execution Speed</div>
          <div className="text-xl font-mono font-bold text-blue-400 mt-0.5">{matchResult.executionTimeMs} ms</div>
        </div>
        <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200'}`}>
          <div className="text-[11px] font-semibold text-neutral-400">Engine Status</div>
          <div className="text-sm font-semibold text-neutral-200 mt-1 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${matchResult.isValid ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            <span>{matchResult.isValid ? 'Active & Ready' : 'Syntax Error'}</span>
          </div>
        </div>
      </div>

      {/* Dual Panel: Test Text Input (Left) & Live Match Highlight Display (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Test Text Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Test Input Text</span>
            </label>

            {/* Presets dropdown/chips */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-neutral-500 mr-1 hidden sm:inline">Fixtures:</span>
              {PLAYGROUND_PRESETS.map((fp) => (
                <button
                  key={fp.id}
                  onClick={() => handleSelectPresetText(fp.id)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    testText === fp.content
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isDark
                      ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
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
            className={`w-full p-3.5 rounded-2xl border font-mono text-xs leading-relaxed focus:outline-none transition-all resize-y ${
              isDark
                ? 'bg-neutral-950 border-neutral-800 text-neutral-200 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20'
                : 'bg-white border-neutral-300 text-neutral-900 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 shadow-xs'
            }`}
          />
        </div>

        {/* Right: Live Match Highlighting Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Match Visualizer</span>
            </label>
            <span className="text-[10px] font-mono text-neutral-500">
              {matchResult.totalMatches} matches highlighted
            </span>
          </div>

          <div
            id="playground-highlight-preview"
            className={`w-full h-[276px] p-3.5 rounded-2xl border font-mono text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap break-all select-text transition-all ${
              isDark
                ? 'bg-neutral-950/90 border-neutral-800 text-neutral-300'
                : 'bg-neutral-50 border-neutral-200 text-neutral-800'
            }`}
          >
            {segments.length === 0 || !testText ? (
              <span className="text-neutral-600 italic">No text provided. Type or select a fixture above.</span>
            ) : (
              segments.map((seg, idx) => {
                if (seg.isMatch) {
                  return (
                    <mark
                      key={idx}
                      className="bg-emerald-500/30 text-emerald-200 px-0.5 rounded border border-emerald-500/50 font-bold hover:bg-emerald-500/50 transition-colors"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Match & Capture Groups Inspector ({matchResult.matches.length})
            </h3>
          </div>

          {matchResult.matches.length > 0 && (
            <button
              id="copy-all-matches-btn"
              onClick={handleCopyMatches}
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                copiedMatches
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isDark
                  ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {copiedMatches ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMatches ? 'Copied' : 'Copy All Matches'}</span>
            </button>
          )}
        </div>

        {matchResult.matches.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center text-xs ${
            isDark ? 'bg-neutral-900/30 border-neutral-800 text-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
          }`}>
            No matches found for the current pattern and text.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={isDark ? 'bg-neutral-900/90 text-neutral-400 border-b border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-b border-neutral-200'}>
                  <th className="py-3 px-4 font-semibold w-16">#</th>
                  <th className="py-3 px-4 font-semibold w-32">Range</th>
                  <th className="py-3 px-4 font-semibold">Matched Text</th>
                  <th className="py-3 px-4 font-semibold">Capture Groups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {matchResult.matches.map((m) => (
                  <tr
                    key={m.index}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-neutral-900/60 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      #{m.index}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400">
                      [{m.start}–{m.end}]
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold max-w-xs truncate">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
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
