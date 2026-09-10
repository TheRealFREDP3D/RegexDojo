import React, { useState, useMemo } from 'react';
import { TRANSLATE_PRESETS } from '../data/presets';
import { tokenizeRegex } from '../utils/tokenizer';
import { TokenBreakdown } from '../types';
import { sounds } from '../utils/sound';
import {
  ArrowLeftRight,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  Play,
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

interface TranslateViewProps {
  onSendToPlayground: (pattern: string, flags: string) => void;
  isDark: boolean;
}

export const TranslateView: React.FC<TranslateViewProps> = ({
  onSendToPlayground,
  isDark
}) => {
  const [pattern, setPattern] = useState<string>(
    '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
  );
  const [flags, setFlags] = useState<string>('');
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Tokenize
  const result = useMemo(() => {
    return tokenizeRegex(pattern, flags);
  }, [pattern, flags]);

  const handleSelectPreset = (presetId: string) => {
    sounds.playClick();
    const found = TRANSLATE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPattern(found.pattern);
      setFlags(found.flags);
      setSelectedTokenIdx(null);
    }
  };

  const handleCopySummary = () => {
    sounds.playClick();
    navigator.clipboard.writeText(result.summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1500);
  };

  const handleSendToPlayground = () => {
    sounds.playClick();
    onSendToPlayground(pattern, flags);
  };

  return (
    <div id="translate-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Regex Translator</h1>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Deconstruct cryptic regex hieroglyphs into plain English and a LEGO-style token chain.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="translate-to-playground-btn"
            onClick={handleSendToPlayground}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test in Playground</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-400 flex items-center justify-between">
          <span>Preset Regex Specimens:</span>
          <span className="text-[11px] text-neutral-500">Click to examine structure</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TRANSLATE_PRESETS.map((p) => {
            const isSelected = p.pattern === pattern;
            return (
              <button
                key={p.id}
                id={`translate-preset-${p.id}`}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-500 text-white font-semibold shadow-xs'
                    : isDark
                    ? 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 shadow-xs'
                }`}
              >
                <span>{p.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-blue-600 text-white' : isDark ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {p.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Input Bar */}
      <div
        className={`p-4 rounded-2xl border space-y-3 ${
          isDark ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Pattern to Deconstruct
          </span>
          <button
            id="clear-translate-input-btn"
            onClick={() => {
              sounds.playClick();
              setPattern('');
              setSelectedTokenIdx(null);
            }}
            className={`text-xs px-2 py-1 rounded border flex items-center gap-1 transition-colors ${
              isDark ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        <div
          className={`flex items-center px-3 py-2.5 rounded-xl border font-mono text-sm transition-all ${
            !result.isValid
              ? 'border-rose-500/80 ring-2 ring-rose-500/20 bg-rose-950/15'
              : isDark
              ? 'border-neutral-700 bg-neutral-950 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20'
              : 'border-neutral-300 bg-neutral-50 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20'
          }`}
        >
          <span className="text-neutral-500 font-bold select-none text-base">/</span>
          <input
            id="translate-regex-input"
            type="text"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setSelectedTokenIdx(null);
            }}
            placeholder="paste any regex pattern here..."
            spellCheck="false"
            className="flex-1 bg-transparent px-2 font-mono text-sm text-blue-400 focus:outline-none placeholder:text-neutral-600"
          />
          <span className="text-neutral-500 font-bold select-none text-base">/</span>
          <input
            id="translate-flags-input"
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags"
            className="w-12 text-neutral-400 font-mono text-xs bg-transparent focus:outline-none text-center"
          />
        </div>

        {/* Error message if invalid */}
        {!result.isValid && (
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-bold">Engine Syntax Rejection: </span>
              <span>{result.error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Token Chain (LEGO blocks) */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Visual Token Chain ({result.tokens.length} Elements)
            </h3>
          </div>
          <span className={`text-[11px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Click any block to inspect details
          </span>
        </div>

        {result.tokens.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500">
            Enter a regex above to see the modular token chain.
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80 overflow-x-auto min-h-[60px]">
            {result.tokens.map((token, idx) => {
              const isSelected = selectedTokenIdx === idx;
              return (
                <button
                  key={idx}
                  id={`token-pill-${idx}`}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTokenIdx(isSelected ? null : idx);
                  }}
                  className={`group relative px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-xs ${
                    token.color
                  } ${
                    isSelected
                      ? 'ring-2 ring-white scale-105 shadow-md shadow-white/10 z-10'
                      : 'hover:brightness-125'
                  }`}
                  title={`${token.label}: ${token.description}`}
                >
                  <span>{token.raw}</span>
                  <span className="block text-[9px] font-normal opacity-80 truncate max-w-[120px]">
                    {token.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Plain-English Narrative Summary */}
      <div
        className={`p-5 rounded-2xl border space-y-3 ${
          isDark
            ? 'bg-gradient-to-r from-blue-950/20 via-neutral-900 to-neutral-900 border-blue-500/30 text-neutral-100'
            : 'bg-blue-50/50 border-blue-200 text-neutral-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Plain-English Narrative Summary
            </h3>
          </div>
          <button
            id="copy-summary-btn"
            onClick={handleCopySummary}
            className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
              copiedSummary
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isDark
                ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Detailed Piece-by-Piece Breakdown Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Piece-by-Piece Anatomy
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={isDark ? 'bg-neutral-900/90 text-neutral-400 border-b border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-b border-neutral-200'}>
                <th className="py-3 px-4 font-semibold w-24">Token</th>
                <th className="py-3 px-4 font-semibold w-36">Category</th>
                <th className="py-3 px-4 font-semibold">Plain-English Rule</th>
                <th className="py-3 px-4 font-semibold w-40 hidden sm:table-cell">Example Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {result.tokens.map((token, idx) => {
                const isSelected = selectedTokenIdx === idx;
                return (
                  <tr
                    key={idx}
                    id={`token-row-${idx}`}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedTokenIdx(isSelected ? null : idx);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-blue-950/40 text-blue-100 font-medium'
                          : 'bg-blue-50 text-blue-950 font-medium'
                        : isDark
                        ? 'hover:bg-neutral-900/60 text-neutral-300'
                        : 'hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-sm">
                      <span className={`px-2 py-0.5 rounded border inline-block ${token.color}`}>
                        {token.raw}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-400">
                      {token.label}
                    </td>
                    <td className="py-3 px-4 leading-relaxed">
                      {token.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 hidden sm:table-cell">
                      {token.matchExample || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
