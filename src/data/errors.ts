/**
 * Friendly error decoder for V8/Chrome regex engine messages.
 *
 * Raw engine messages are cryptic and demoralizing for learners. This module
 * maps the most common V8 messages to plain-English explanations plus a
 * concrete suggested fix. Anything not matched falls through to the raw
 * message as secondary detail — we never invent a fake explanation.
 */

export interface RegexErrorEntry {
  /** Substring that must appear in the raw message (case-insensitive). */
  match: string;
  title: string;
  friendly: string;
  likelyFix: string;
}

export const REGEX_ERROR_DICTIONARY: RegexErrorEntry[] = [
  {
    match: 'unterminated group',
    title: 'Unterminated Group',
    friendly: 'You opened a group with "(" but never closed it with ")".',
    likelyFix: 'Add the missing closing parenthesis to balance the group.'
  },
  {
    match: 'unterminated character class',
    title: 'Unterminated Character Class',
    friendly: 'You opened a character class "[" but never closed it with "]".',
    likelyFix: 'Add the missing "]" to close the character class.'
  },
  {
    match: 'nothing to repeat',
    title: 'Nothing to Repeat',
    friendly: 'A quantifier (*, +, ?, {n}) has nothing in front of it to repeat.',
    likelyFix: 'Move the quantifier so it follows a literal, class, or group.'
  },
  {
    match: 'incomplete quantifier',
    title: 'Incomplete Quantifier',
    friendly: 'A quantifier like "{n" or "{n,m" is missing its closing brace.',
    likelyFix: 'Close the quantifier with "}", e.g. "{n}" or "{n,m}".'
  },
  {
    match: 'invalid escape',
    title: 'Invalid Escape',
    friendly: 'You used a backslash escape that does not exist in this flavor.',
    likelyFix: 'Remove the backslash or replace it with a recognized escape like \\d, \\w, or \\s.'
  },
  {
    match: 'invalid flags',
    title: 'Invalid Flags',
    friendly: 'One of the flags you passed is not recognized by the engine.',
    likelyFix: 'Use only the supported flags: g, i, m, s, u, y, d, v.'
  },
  {
    match: 'numbers out of order',
    title: 'Quantifier Bounds Out of Order',
    friendly: 'A quantifier like "{2,1}" has its minimum greater than its maximum.',
    likelyFix: 'Ensure the lower bound is less than or equal to the upper bound, e.g. "{1,3}".'
  },
  {
    match: 'capture group',
    title: 'Invalid Capture Group Reference',
    friendly: 'A backreference or named group reference points to a group that does not exist.',
    likelyFix: 'Make sure the referenced group number or name is defined before its use.'
  },
  {
    match: 'out of range',
    title: 'Quantifier Out of Range',
    friendly: 'A quantifier requests more repetitions than the engine allows.',
    likelyFix: 'Lower the repetition count or split the pattern into smaller pieces.'
  },
  // Generic fallback entry - must be LAST to avoid shadowing specific error types above
  {
    match: 'invalid regular expression',
    title: 'Invalid Regular Expression',
    friendly: 'The regex engine rejected your pattern. It is not a valid regular expression.',
    likelyFix: 'Check for unbalanced brackets, missing escapes, or stray quantifiers.'
  }
];

/** Look up a friendly entry for a raw engine message; returns null if unknown. */
export function decodeRegexError(rawMessage: string): RegexErrorEntry | null {
  const lower = rawMessage.toLowerCase();
  for (const entry of REGEX_ERROR_DICTIONARY) {
    if (lower.includes(entry.match.toLowerCase())) {
      return entry;
    }
  }
  return null;
}