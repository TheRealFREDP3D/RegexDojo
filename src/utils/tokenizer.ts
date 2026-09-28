import { TokenBreakdown } from '../types';

export interface TokenizeResult {
  tokens: TokenBreakdown[];
  summary: string;
  isValid: boolean;
  error?: string;
}

export function tokenizeRegex(pattern: string, flags: string = ''): TokenizeResult {
  if (!pattern) {
    return {
      tokens: [],
      summary: 'Empty pattern — matches nothing or an empty string depending on context.',
      isValid: true
    };
  }

  // First verify native JS regex compilation
  try {
    new RegExp(pattern, flags);
  } catch (err: unknown) {
    const errorMsg = (err as Error).message;
    return {
      tokens: [
        {
          raw: pattern,
          type: 'unknown',
          label: 'Invalid Pattern',
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          description: `Regex engines are picky creatures: ${errorMsg}`
        }
      ],
      summary: `Compilation error: ${errorMsg}. Regex engines don't tolerate loose ends.`,
      isValid: false,
      error: errorMsg
    };
  }

  const tokens: TokenBreakdown[] = [];
  let i = 0;
  const len = pattern.length;

  while (i < len) {
    const char = pattern[i];

    // 1. Anchors
    if (char === '^') {
      tokens.push({
        raw: '^',
        type: 'anchor',
        label: 'Start Anchor',
        color: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
        description: 'Asserts the start of the string (or start of line in multiline mode).'
      });
      i++;
      continue;
    }

    if (char === '$') {
      tokens.push({
        raw: '$',
        type: 'anchor',
        label: 'End Anchor',
        color: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
        description: 'Asserts the end of the string (or end of line in multiline mode).'
      });
      i++;
      continue;
    }

    // 2. Alternation
    if (char === '|') {
      tokens.push({
        raw: '|',
        type: 'alternation',
        label: 'Alternation (OR)',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        description: 'Logical OR: matches the sub-expression to the left OR the sub-expression to the right.'
      });
      i++;
      continue;
    }

    // 3. Dot wildcard
    if (char === '.') {
      const dotDesc = flags.includes('s') 
        ? 'Matches any single character including line terminators (dotAll mode).'
        : 'Matches any single character except line terminators (\\n, \\r).';
      tokens.push({
        raw: '.',
        type: 'dot',
        label: 'Any Character (Dot)',
        color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        description: dotDesc
      });
      i++;
      continue;
    }

    // 4. Escapes and shorthands
    if (char === '\\') {
      if (i + 1 < len) {
        const next = pattern[i + 1];
        const raw = '\\' + next;

        // Shorthands
        if (next === 'd') {
          tokens.push({
            raw,
            type: 'shorthand',
            label: 'Digit (\\d)',
            color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            description: 'Matches any single digit character [0-9].',
            matchExample: '0, 1, 2... 9'
          });
        } else if (next === 'D') {
          tokens.push({
            raw,
            type: 'shorthand',
            label: 'Non-Digit (\\D)',
            color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            description: 'Matches any character that is NOT a digit [^0-9].'
          });
        } else if (next === 'w') {
          tokens.push({
            raw,
            type: 'shorthand',
            label: 'Word Character (\\w)',
            color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            description: 'Matches ASCII letters, digits, or underscore [a-zA-Z0-9_].',
            matchExample: 'a, Z, 7, _'
          });
        } else if (next === 'W') {
          tokens.push({
            raw,
            type: 'shorthand',
            label: 'Non-Word Character (\\W)',
            color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            description: 'Matches any character that is NOT a word character (symbols, spaces, etc.).'
          });
        } else if (next === 's') {
          tokens.push({
            raw,
            type: 'shorthand',
            label: 'Whitespace (\\s)',
            color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            description: 'Matches any whitespace character (space, tab, newline, formfeed).'
          });
        } else if (next === 'S') {
          tokens.push({
            raw,
            type: 'shorthand',
            label: 'Non-Whitespace (\\S)',
            color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            description: 'Matches any non-whitespace character.'
          });
        } else if (next === 'b') {
          tokens.push({
            raw,
            type: 'boundary',
            label: 'Word Boundary (\\b)',
            color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
            description: 'Asserts a zero-width position between a word character and a non-word character.'
          });
        } else if (next === 'B') {
          tokens.push({
            raw,
            type: 'boundary',
            label: 'Non-Word Boundary (\\B)',
            color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
            description: 'Asserts a position where adjacent characters are both word characters or both non-word characters.'
          });
        } else if (next === 'n') {
          tokens.push({
            raw,
            type: 'escape',
            label: 'Newline (\\n)',
            color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            description: 'Matches a newline character (line feed).'
          });
        } else if (next === 'r') {
          tokens.push({
            raw,
            type: 'escape',
            label: 'Carriage Return (\\r)',
            color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            description: 'Matches a carriage return character.'
          });
        } else if (next === 't') {
          tokens.push({
            raw,
            type: 'escape',
            label: 'Tab (\\t)',
            color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            description: 'Matches a tab character.'
          });
        } else if (next >= '1' && next <= '9') {
          // Backreference
          tokens.push({
            raw,
            type: 'backreference',
            label: `Backreference (${raw})`,
            color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
            description: `Matches the same text as the previously captured group ${next}.`
          });
        } else {
          // Escaped literal
          tokens.push({
            raw,
            type: 'escape',
            label: `Escaped '${next}'`,
            color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            description: `Matches the literal character '${next}', stripped of any special regex meaning.`
          });
        }
        i += 2;
        continue;
      }
    }

    // 5. Character Classes [...]
    if (char === '[') {
      let j = i + 1;
      // Handle special case [^] - empty negated class that matches any character
      if (j < len && pattern[j] === '^' && j + 1 < len && pattern[j + 1] === ']') {
        tokens.push({
          raw: '[^]',
          type: 'class',
          label: 'Any Character Class',
          color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          description: 'Matches any single character (equivalent to dot with dotAll flag).'
        });
        i += 3;
        continue;
      }
      
      // Handle immediate closing bracket like []] or [^]]
      if (j < len && pattern[j] === '^') j++;
      if (j < len && pattern[j] === ']') j++;

      let closed = false;
      while (j < len) {
        if (pattern[j] === '\\') {
          j += 2;
          continue;
        }
        if (pattern[j] === ']') {
          closed = true;
          break;
        }
        j++;
      }

      if (closed) {
        const raw = pattern.slice(i, j + 1);
        const isNegated = raw.startsWith('[^');
        const inner = isNegated ? raw.slice(2, -1) : raw.slice(1, -1);
        
        // Handle empty class [] which matches nothing
        const isEmpty = inner === '';
        tokens.push({
          raw,
          type: 'class',
          label: isEmpty ? 'Empty Class' : (isNegated ? 'Negated Class' : 'Character Class'),
          color: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          description: isEmpty
            ? 'Matches nothing (empty character class).'
            : (isNegated
              ? `Matches any single character EXCEPT those in the set: ${inner}`
              : `Matches any single character present in the set: ${inner}`)
        });
        i = j + 1;
        continue;
      }
    }

    // 6. Bounded Quantifiers {n}, {n,}, {n,m}
    if (char === '{') {
      const match = pattern.slice(i).match(/^\{(\d+)(?:,(\d*))?\}/);
      if (match) {
        const raw = match[0];
        const min = match[1];
        const hasComma = raw.includes(',');
        const max = match[2];

        // Check for lazy modifier
        const isLazy = i + raw.length < len && pattern[i + raw.length] === '?';
        const actualRaw = isLazy ? raw + '?' : raw;

        let desc = `Matches preceding item exactly ${min} time(s).`;
        if (hasComma) {
          if (!max) {
            desc = `Matches preceding item at least ${min} time(s).`;
          } else {
            desc = `Matches preceding item between ${min} and ${max} times (inclusive).`;
          }
        }
        if (isLazy) {
          desc = desc.replace('Matches', 'Matches (lazy)').replace('time(s)', 'time(s), matching as few as possible');
        }

        tokens.push({
          raw: actualRaw,
          type: 'quantifier',
          label: isLazy ? `Repeats {${min}${hasComma ? ',' + (max || '') : ''}} (Lazy)` : `Repeats {${min}${hasComma ? ',' + (max || '') : ''}}`,
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          description: desc
        });
        i += actualRaw.length;
        continue;
      }
    }

    // 7. Standard Quantifiers (*, +, ?)
    if (char === '*' || char === '+' || char === '?') {
      let raw = char;
      const isLazy = i + 1 < len && pattern[i + 1] === '?';
      if (isLazy) {
        raw += '?';
      }

      let label = 'Quantifier';
      let desc = '';
      if (char === '*') {
        label = isLazy ? 'Zero or More (Lazy)' : 'Zero or More (Greedy)';
        desc = isLazy
          ? 'Matches preceding token 0 or more times, matching as few characters as possible.'
          : 'Matches preceding token 0 or more times, greedily taking as many as possible.';
      } else if (char === '+') {
        label = isLazy ? 'One or More (Lazy)' : 'One or More (Greedy)';
        desc = isLazy
          ? 'Matches preceding token 1 or more times, matching as few characters as possible.'
          : 'Matches preceding token 1 or more times, greedily taking as many as possible.';
      } else if (char === '?') {
        label = 'Optional (0 or 1)';
        desc = 'Matches preceding token 0 or 1 time (makes it optional).';
      }

      tokens.push({
        raw,
        type: 'quantifier',
        label,
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        description: desc
      });
      i += raw.length;
      continue;
    }

    // 8. Groups & Lookarounds
    if (char === '(') {
      if (pattern.startsWith('(?=', i)) {
        tokens.push({
          raw: '(?=',
          type: 'lookaround',
          label: 'Positive Lookahead',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Asserts that the contained pattern matches ahead, without consuming characters.'
        });
        i += 3;
        continue;
      } else if (pattern.startsWith('(?!', i)) {
        tokens.push({
          raw: '(?!',
          type: 'lookaround',
          label: 'Negative Lookahead',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Asserts that the contained pattern does NOT match ahead, without consuming characters.'
        });
        i += 3;
        continue;
      } else if (pattern.startsWith('(?<=', i)) {
        tokens.push({
          raw: '(?<=',
          type: 'lookaround',
          label: 'Positive Lookbehind',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Asserts that the contained pattern matches behind, without consuming characters.'
        });
        i += 4;
        continue;
      } else if (pattern.startsWith('(?<!', i)) {
        tokens.push({
          raw: '(?<!',
          type: 'lookaround',
          label: 'Negative Lookbehind',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Asserts that the contained pattern does NOT match behind, without consuming characters.'
        });
        i += 4;
        continue;
      } else if (pattern.startsWith('(?:', i)) {
        tokens.push({
          raw: '(?:',
          type: 'group',
          label: 'Non-Capturing Group',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Groups multiple tokens into a single atomic unit without saving a numbered capture slot.'
        });
        i += 3;
        continue;
      } else if (pattern.startsWith('(?<', i)) {
        // Named capture group - extract the name
        const nameMatch = pattern.slice(i + 3).match(/^([^>]+)>/);
        if (nameMatch) {
          const groupName = nameMatch[1];
          const raw = `(?<${groupName}>`;
          tokens.push({
            raw,
            type: 'group',
            label: `Named Capture Group (?<${groupName}>)`,
            color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            description: `Begins a named capture group "${groupName}" that bundles tokens and saves matches into a named memory slot.`
          });
          i += raw.length;
          continue;
        }
      } else {
        tokens.push({
          raw: '(',
          type: 'group',
          label: 'Capture Group Start',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Begins a numbered capture group that bundles tokens and saves matches into memory.'
        });
        i++;
        continue;
      }
    }

    if (char === ')') {
      tokens.push({
        raw: ')',
        type: 'group',
        label: 'Group End',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        description: 'Closes the active group or lookaround sub-expression.'
      });
      i++;
      continue;
    }

    // 9. Literals (accumulate sequence of normal characters)
    let litEnd = i;
    while (
      litEnd < len &&
      !['^', '$', '.', '*', '+', '?', '(', ')', '[', ']', '{', '}', '|', '\\'].includes(pattern[litEnd])
    ) {
      litEnd++;
    }

    if (litEnd > i) {
      const literalStr = pattern.slice(i, litEnd);
      
      // Check if the next character after the literal is a quantifier
      // If so, we need to split the literal so the quantifier only applies to the last character
      const nextChar = litEnd < len ? pattern[litEnd] : null;
      const isQuantifierNext = nextChar && ['*', '+', '?', '{'].includes(nextChar);
      
      if (isQuantifierNext && literalStr.length > 1) {
        // Split the literal: all but last char as one literal, last char separately
        const mainPart = literalStr.slice(0, -1);
        const lastChar = literalStr.slice(-1);
        
        if (mainPart) {
          const mainDesc = flags.includes('i')
            ? `Matches the exact string "${mainPart}" (case-insensitive with i flag).`
            : `Matches the exact string "${mainPart}" case-sensitively.`;
          tokens.push({
            raw: mainPart,
            type: 'literal',
            label: `Literal "${mainPart}"`,
            color: 'bg-neutral-800 text-neutral-200 border-neutral-700',
            description: mainDesc
          });
        }
        
        const lastDesc = flags.includes('i')
          ? `Matches the exact character "${lastChar}" (case-insensitive with i flag).`
          : `Matches the exact character "${lastChar}" case-sensitively.`;
        tokens.push({
          raw: lastChar,
          type: 'literal',
          label: `Literal "${lastChar}"`,
          color: 'bg-neutral-800 text-neutral-200 border-neutral-700',
          description: lastDesc
        });
        
        i = litEnd;
        continue;
      }
      
      const literalDesc = flags.includes('i')
        ? `Matches the exact string "${literalStr}" (case-insensitive with i flag).`
        : `Matches the exact string "${literalStr}" case-sensitively.`;
      tokens.push({
        raw: literalStr,
        type: 'literal',
        label: `Literal "${literalStr}"`,
        color: 'bg-neutral-800 text-neutral-200 border-neutral-700',
        description: literalDesc
      });
      i = litEnd;
      continue;
    }

    // Fallback for stray unmatched symbol
    tokens.push({
      raw: char,
      type: 'unknown',
      label: `Symbol '${char}'`,
      color: 'bg-neutral-800 text-neutral-300 border-neutral-700',
      description: `Literal character '${char}'.`
    });
    i++;
  }

  // Generate plain-English narrative summary
  const summary = generateNaturalSummary(tokens, flags);

  return {
    tokens,
    summary,
    isValid: true
  };
}

function generateNaturalSummary(tokens: TokenBreakdown[], flags: string): string {
  if (tokens.length === 0) return 'Matches empty string.';

  const parts: string[] = [];

  const hasStartAnchor = tokens[0]?.raw === '^';
  const hasEndAnchor = tokens[tokens.length - 1]?.raw === '$';

  if (hasStartAnchor && hasEndAnchor) {
    parts.push('Matches an entire string from start to end that contains:');
  } else if (hasStartAnchor) {
    parts.push('Matches text starting at the very beginning of the line/string:');
  } else if (hasEndAnchor) {
    parts.push('Matches text finishing at the very end of the line/string:');
  } else {
    parts.push('Searches for substring patterns anywhere in the text:');
  }

  const descriptors: string[] = [];
  let idx = 0;

  while (idx < tokens.length) {
    const t = tokens[idx];
    if (t.raw === '^' || t.raw === '$') {
      idx++;
      continue;
    }

    let tokenText = '';
    if (t.type === 'literal') {
      tokenText = `exact text "${t.raw}"`;
    } else if (t.type === 'dot') {
      tokenText = 'any single character';
    } else if (t.type === 'shorthand') {
      if (t.raw === '\\d') tokenText = 'a digit (0-9)';
      else if (t.raw === '\\D') tokenText = 'a non-digit';
      else if (t.raw === '\\w') tokenText = 'a word character (letters, numbers, underscore)';
      else if (t.raw === '\\W') tokenText = 'a non-word character';
      else if (t.raw === '\\s') tokenText = 'a whitespace character';
      else if (t.raw === '\\S') tokenText = 'a non-whitespace character';
      else tokenText = t.label;
    } else if (t.type === 'class') {
      if (t.raw === '[^]') {
        tokenText = 'any single character';
      } else {
        tokenText = `character in ${t.raw}`;
      }
    } else if (t.type === 'boundary') {
      tokenText = 'word boundary';
    } else if (t.type === 'escape') {
      tokenText = `escaped character '${t.raw.slice(1)}'`;
    } else if (t.type === 'backreference') {
      tokenText = `backreference to group ${t.raw.slice(1)}`;
    } else if (t.type === 'alternation') {
      tokenText = 'OR';
    } else if (t.type === 'lookaround') {
      tokenText = t.label.toLowerCase();
    } else if (t.type === 'group') {
      tokenText = t.raw === ')' ? 'close group' : 'group';
    } else if (t.type === 'quantifier') {
      tokenText = t.label.toLowerCase();
    } else {
      tokenText = t.label;
    }

    // Check if next token is a quantifier modifying this token
    if (idx + 1 < tokens.length && tokens[idx + 1].type === 'quantifier') {
      const q = tokens[idx + 1];
      let quantDesc = 'repeated';
      if (q.raw === '+') quantDesc = 'one or more times';
      else if (q.raw === '*') quantDesc = 'zero or more times';
      else if (q.raw === '?') quantDesc = 'optionally (0 or 1 time)';
      else if (q.raw === '+?') quantDesc = 'one or more times (lazy)';
      else if (q.raw === '*?') quantDesc = 'zero or more times (lazy)';
      else if (q.raw === '??') quantDesc = 'optionally (0 or 1 time, lazy)';
      else if (q.raw.startsWith('{')) quantDesc = q.description.toLowerCase().replace('matches preceding item ', '').replace('matches (lazy) preceding item ', '');

      descriptors.push(`${tokenText} (${quantDesc})`);
      idx += 2;
    } else {
      descriptors.push(tokenText);
      idx++;
    }
  }

  if (descriptors.length > 0) {
    parts.push(descriptors.join(' ➔ '));
  }

  // Flags explanation
  if (flags) {
    const flagList: string[] = [];
    if (flags.includes('g')) flagList.push('global search (find all matches, not just the first)');
    if (flags.includes('i')) flagList.push('case-insensitive (treats A and a equally)');
    if (flags.includes('m')) flagList.push('multiline mode (^ and $ match line boundaries)');
    if (flags.includes('s')) flagList.push('dotAll mode (. matches newlines as well)');
    if (flags.includes('u')) flagList.push('unicode enabled');
    if (flagList.length > 0) {
      parts.push(`With flags: ${flagList.join(', ')}.`);
    }
  }

  return parts.join(' ');
}
