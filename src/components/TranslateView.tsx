import React, { useState, useMemo } from 'react';
import { TRANSLATE_PRESETS } from '../data/presets';
import { tokenizeRegex } from '../utils/tokenizer';
import { decodeRegexError } from '../data/errors';
import { sounds } from '../utils/sound';
import {
  ArrowLeftRight,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  Play,
  RotateCcw,
  Info
} from 'lucide-react';

interface TranslateViewProps {
  onSendToPlayground: (pattern: string, flags: string) => void;
}

export const TranslateView: React.FC<TranslateViewProps> = ({
  onSendToPlayground
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
    navigator.clipboard.writeText(result.summary)
      .then(() => {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 1500);
      })
      .catch(() => {
        // Clipboard access denied or failed - silently ignore
      });
  };

  const handleSendToPlayground = () => {
    sounds.playClick();
    onSendToPlayground(pattern, flags);
  };

  return (
    <div id="translate-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-rose-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight heading-bar-h2">Regex Translator</h1>
          </div>
          <p className="text-xs mt-2 text-neutral-400">
            Deconstruct cryptic regex hieroglyphs into plain English and a LEGO-style token chain.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            id="translate-to-playground-btn"
            onClick={handleSendToPlayground}
            className="btn-glazz-cta px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test in Playground</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-400 flex items-center justify-between">
          <span className="text-rose-400/80 uppercase tracking-wider text-[11px] font-bold">Preset Regex Specimens:</span>
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
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border border-rose-500 bg-rose-500/20 text-rose-300 font-semibold shadow-[0_0_12px_rgba(255,79,99,0.3)]'
                    : 'bg-black/40 border border-white/10 text-neutral-300 hover:border-rose-500/40 hover:bg-white/5'
                }`}
              >
                <span>{p.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-rose-600/40 text-rose-200' : 'bg-black/60 text-neutral-400'
                }`}>
                  {p.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Input Bar */}
      <div className="p-5 rounded-2xl glazz-panel space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Pattern to Deconstruct
          </span>
          <button
            id="clear-translate-input-btn"
            onClick={() => {
              sounds.playClick();
              setPattern('');
              setSelectedTokenIdx(null);
            }}
            className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/10 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        <div
          className={`flex items-center px-3 py-3 rounded-xl border font-mono text-sm transition-all ${
            !result.isValid
              ? 'border-rose-500 ring-2 ring-rose-500/25 bg-rose-950/20'
              : 'border-rose-500/40 bg-black/60 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/25'
          }`}
        >
          <span className="text-rose-500 font-bold select-none text-base">/</span>
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
            className="flex-1 bg-transparent px-2 font-mono text-sm sm:text-base text-rose-300 focus:outline-none placeholder:text-neutral-600"
          />
          <span className="text-rose-500 font-bold select-none text-base">/</span>
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
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              {(() => {
                const decoded = result.error ? decodeRegexError(result.error) : null;
                return decoded ? (
                  <>
                    <div>
                      <span className="font-bold">{decoded.title}: </span>
                      <span>{decoded.friendly}</span>
                    </div>
                    <p className="text-rose-300/80">
                      <span className="font-semibold text-rose-200">Likely fix: </span>
                      {decoded.likelyFix}
                    </p>
                  </>
                ) : (
                  <span className="font-bold">Engine Syntax Rejection: </span>
                );
              })()}
              <p className="text-[10px] text-neutral-500 font-mono">{result.error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Visual Token Chain (LEGO blocks) */}
      <div className="p-5 rounded-2xl glazz-panel space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Visual Token Chain ({result.tokens.length} Elements)
            </h3>
          </div>
          <span className="text-[11px] text-neutral-400">
            Click any block to inspect details
          </span>
        </div>

        {result.tokens.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500">
            Enter a regex above to see the modular token chain.
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl bg-black/70 border border-white/10 overflow-x-auto min-h-[60px]">
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
                      ? 'ring-2 ring-rose-400 scale-105 shadow-md shadow-rose-500/30 z-10'
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
      <div className="p-5 rounded-2xl border border-rose-500/30 glazz-panel-crimson space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Plain-English Narrative Summary
            </h3>
          </div>
          <button
            id="copy-summary-btn"
            onClick={handleCopySummary}
            className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
              copiedSummary
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-neutral-200">
          {result.summary}
        </p>
      </div>

      {/* Detailed Piece-by-Piece Breakdown Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400/80">
          Piece-by-Piece Anatomy
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-white/10 glazz-panel">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/60 text-neutral-400 border-b border-white/10">
                <th className="py-3 px-4 font-semibold w-24">Token</th>
                <th className="py-3 px-4 font-semibold w-36">Category</th>
                <th className="py-3 px-4 font-semibold">Plain-English Rule</th>
                <th className="py-3 px-4 font-semibold w-40 hidden sm:table-cell">Example Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
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
                        ? 'bg-rose-950/40 text-rose-100 font-medium'
                        : 'hover:bg-white/5 text-neutral-300'
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
                    <td className="py-3 px-4 leading-relaxed text-neutral-300">
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
