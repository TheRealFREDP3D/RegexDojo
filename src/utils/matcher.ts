import { RegexMatchDetail, MatchHighlightSegment } from '../types';
import { decodeRegexError } from '../data/errors';

export type MatchExecutionStatus =
  | 'running'
  | 'complete'
  | 'timeout'
  | 'input-limit'
  | 'worker-error';

export type MatchFailureKind = 'syntax' | 'timeout' | 'input-limit' | 'worker-error';

export interface RegexErrorDetails {
  raw: string;
  friendly: string;
  title: string;
  likelyFix: string;
}

export interface ExecuteMatchResult {
  isValid: boolean;
  error?: string;
  errorDetails?: RegexErrorDetails;
  matches: RegexMatchDetail[];
  totalMatches: number;
  totalCharsMatched: number;
  executionTimeMs: number;
  status: MatchExecutionStatus;
  failureKind?: MatchFailureKind;
}

export interface RegexMatchJob {
  pattern: string;
  flags: string;
  text: string;
  maxMatches?: number;
}

export interface RegexMatchBatchRequest {
  requestId: number;
  jobs: RegexMatchJob[];
}

export interface RegexMatchBatchResponse {
  requestId: number;
  results: ExecuteMatchResult[];
}

export const REGEX_EXECUTION_LIMITS = Object.freeze({
  maxPatternLength: 2_000,
  maxFlagsLength: 16,
  maxTextLength: 1_000_000,
  maxMatches: 500,
  maxBatchJobs: 100,
  timeoutMs: 1_000
});

function createErrorDetails(raw: string, title: string, likelyFix: string): RegexErrorDetails {
  return {
    raw,
    friendly: raw,
    title,
    likelyFix
  };
}

export function createEmptyMatchResult(): ExecuteMatchResult {
  return {
    isValid: true,
    matches: [],
    totalMatches: 0,
    totalCharsMatched: 0,
    executionTimeMs: 0,
    status: 'complete'
  };
}

export function createRunningMatchResult(): ExecuteMatchResult {
  return {
    ...createEmptyMatchResult(),
    status: 'running'
  };
}

export function createTimeoutMatchResult(timeoutMs: number = REGEX_EXECUTION_LIMITS.timeoutMs): ExecuteMatchResult {
  const raw = `Regex execution exceeded ${timeoutMs} ms.`;
  return {
    ...createEmptyMatchResult(),
    isValid: false,
    error: raw,
    errorDetails: createErrorDetails(
      raw,
      'Regex Timed Out',
      'Simplify the pattern, reduce ambiguous quantifiers, or test a smaller text sample.'
    ),
    executionTimeMs: timeoutMs,
    status: 'timeout',
    failureKind: 'timeout'
  };
}

export function createWorkerErrorMatchResult(raw: string = 'The regex worker stopped before returning a result.'): ExecuteMatchResult {
  return {
    ...createEmptyMatchResult(),
    isValid: false,
    error: raw,
    errorDetails: createErrorDetails(
      raw,
      'Regex Worker Error',
      'Refresh the Playground and try a smaller pattern or text sample.'
    ),
    status: 'worker-error',
    failureKind: 'worker-error'
  };
}

export function createInputLimitMatchResult(
  inputName: string,
  actual: number,
  limit: number
): ExecuteMatchResult {
  const raw = `${inputName} size ${actual} exceeds the limit of ${limit}.`;
  return {
    ...createEmptyMatchResult(),
    isValid: false,
    error: raw,
    errorDetails: createErrorDetails(
      raw,
      'Regex Input Limit Exceeded',
      `Keep ${inputName} within ${limit} ${limit === 1 ? 'item' : 'items'} and try again.`
    ),
    status: 'input-limit',
    failureKind: 'input-limit'
  };
}

export function validateRegexMatchJob(job: RegexMatchJob): ExecuteMatchResult | null {
  if (job.pattern.length > REGEX_EXECUTION_LIMITS.maxPatternLength) {
    return createInputLimitMatchResult(
      'pattern',
      job.pattern.length,
      REGEX_EXECUTION_LIMITS.maxPatternLength
    );
  }

  if (job.flags.length > REGEX_EXECUTION_LIMITS.maxFlagsLength) {
    return createInputLimitMatchResult(
      'flags',
      job.flags.length,
      REGEX_EXECUTION_LIMITS.maxFlagsLength
    );
  }

  if (job.text.length > REGEX_EXECUTION_LIMITS.maxTextLength) {
    return createInputLimitMatchResult(
      'text',
      job.text.length,
      REGEX_EXECUTION_LIMITS.maxTextLength
    );
  }

  const maxMatches = job.maxMatches ?? REGEX_EXECUTION_LIMITS.maxMatches;
  if (!Number.isSafeInteger(maxMatches) || maxMatches < 1) {
    return createInputLimitMatchResult('match limit', 0, 1);
  }

  if (maxMatches > REGEX_EXECUTION_LIMITS.maxMatches) {
    return createInputLimitMatchResult(
      'match limit',
      maxMatches,
      REGEX_EXECUTION_LIMITS.maxMatches
    );
  }

  return null;
}

export function createSyntaxErrorResult(raw: string, executionTimeMs: number = 0): ExecuteMatchResult {
  const message = raw || 'Invalid regular expression.';
  const decoded = decodeRegexError(message);
  return {
    ...createEmptyMatchResult(),
    isValid: false,
    error: decoded ? decoded.friendly : message,
    errorDetails: decoded
      ? {
          raw: message,
          friendly: decoded.friendly,
          title: decoded.title,
          likelyFix: decoded.likelyFix
        }
      : createErrorDetails(
          message,
          'Regex Syntax Error',
          'Check your pattern for typos, unbalanced brackets, or invalid escapes.'
        ),
    executionTimeMs,
    failureKind: 'syntax'
  };
}

export function executeRegexMatch(
  pattern: string,
  flags: string,
  text: string,
  maxMatches: number = REGEX_EXECUTION_LIMITS.maxMatches
): ExecuteMatchResult {
  const validationError = validateRegexMatchJob({ pattern, flags, text, maxMatches });
  if (validationError) {
    return validationError;
  }

  if (!pattern) {
    return createEmptyMatchResult();
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

        // Zero-length match guard: advance immediately to prevent infinite loops
        if (matchText.length === 0) {
          // Advance by one character to prevent getting stuck on zero-length matches
          regex.lastIndex++;
          // If we're at the end of the string, break to avoid infinite loop
          if (regex.lastIndex > text.length) {
            break;
          }
        }

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
      executionTimeMs,
      status: 'complete'
    };
  } catch (err: unknown) {
    const endTime = performance.now();
    return createSyntaxErrorResult(
      err instanceof Error ? err.message : 'Invalid regular expression.',
      parseFloat((endTime - startTime).toFixed(2))
    );
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
