import { RegexMatchDetail, MatchHighlightSegment } from '../types';

export interface ExecuteMatchResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatchDetail[];
  totalMatches: number;
  totalCharsMatched: number;
  executionTimeMs: number;
}

export function executeRegexMatch(
  pattern: string,
  flags: string,
  text: string,
  maxMatches: number = 500
): ExecuteMatchResult {
  if (!pattern) {
    return {
      isValid: true,
      matches: [],
      totalMatches: 0,
      totalCharsMatched: 0,
      executionTimeMs: 0
    };
  }

  const startTime = performance.now();

  try {
    // Ensure flags don't duplicate
    const uniqueFlags = Array.from(new Set(flags.split(''))).join('');
    const regex = new RegExp(pattern, uniqueFlags);
    const matches: RegexMatchDetail[] = [];
    let totalChars = 0;

    if (!uniqueFlags.includes('g')) {
      // Single match
      const m = regex.exec(text);
      if (m && m[0] !== undefined) {
        const start = m.index;
        const end = start + m[0].length;
        const groups = (m.slice(1) || []).map((val, gIdx) => ({
          name: undefined,
          value: val ?? '',
          index: gIdx + 1
        }));

        matches.push({
          index: 1,
          match: m[0],
          start,
          end,
          groups
        });
        totalChars += m[0].length;
      }
    } else {
      // Global matches
      let match: RegExpExecArray | null;
      let count = 0;
      let lastIndexSafety = -1;

      while ((match = regex.exec(text)) !== null) {
        count++;
        const matchText = match[0];
        const start = match.index;
        const end = start + matchText.length;

        const groups = (match.slice(1) || []).map((val, gIdx) => ({
          name: undefined,
          value: val ?? '',
          index: gIdx + 1
        }));

        matches.push({
          index: count,
          match: matchText,
          start,
          end,
          groups
        });
        totalChars += matchText.length;

        // Zero-length match guard to prevent infinite loops (e.g. empty pattern /a*/ on non-matching text)
        if (regex.lastIndex === lastIndexSafety) {
          regex.lastIndex++;
        }
        lastIndexSafety = regex.lastIndex;

        if (count >= maxMatches) {
          break;
        }
      }
    }

    const endTime = performance.now();
    const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));

    return {
      isValid: true,
      matches,
      totalMatches: matches.length,
      totalCharsMatched: totalChars,
      executionTimeMs
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    return {
      isValid: false,
      error: (err as Error).message || 'Invalid regular expression.',
      matches: [],
      totalMatches: 0,
      totalCharsMatched: 0,
      executionTimeMs: parseFloat((endTime - startTime).toFixed(2))
    };
  }
}

/**
 * Builds highlight segments from text and matched ranges
 */
export function buildHighlightSegments(text: string, matches: RegexMatchDetail[]): MatchHighlightSegment[] {
  if (!matches || matches.length === 0 || !text) {
    return [{ text, isMatch: false }];
  }

  const segments: MatchHighlightSegment[] = [];
  let currentIndex = 0;

  // Filter and sort matches by start index
  const sortedMatches = [...matches]
    .filter((m) => m.end > m.start) // ignore 0-width empty matches for visual segments
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sortedMatches.length; i++) {
    const m = sortedMatches[i];

    // Check if match starts after current index (unmatched text)
    if (m.start > currentIndex) {
      segments.push({
        text: text.slice(currentIndex, m.start),
        isMatch: false
      });
    }

    // Matched text (make sure it's within bounds)
    const matchStart = Math.max(currentIndex, m.start);
    const matchEnd = Math.min(text.length, m.end);

    if (matchEnd > matchStart) {
      segments.push({
        text: text.slice(matchStart, matchEnd),
        isMatch: true,
        matchIndex: m.index
      });
      currentIndex = matchEnd;
    }
  }

  // Trailing unmatched text
  if (currentIndex < text.length) {
    segments.push({
      text: text.slice(currentIndex),
      isMatch: false
    });
  }

  return segments;
}

/**
 * Palette for capture group highlighting
 */
export const GROUP_COLOR_CLASSES = [
  'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40', // Group 0 / match
  'bg-amber-500/25 text-amber-200 border border-amber-500/40',     // Group 1
  'bg-sky-500/25 text-sky-200 border border-sky-500/40',         // Group 2
  'bg-purple-500/25 text-purple-200 border border-purple-500/40',   // Group 3
  'bg-rose-500/25 text-rose-200 border border-rose-500/40',       // Group 4
  'bg-teal-500/25 text-teal-200 border border-teal-500/40',       // Group 5
];
