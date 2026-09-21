import { Lesson } from '../types';

export const BASICS_LESSONS: Lesson[] = [
  {
    id: 1,
    slug: 'literals',
    title: 'Literals',
    subtitle: 'The polite beginnings before the madness',
    beltTier: 'White Belt',
    theory: [
      'Welcome to the Dojo. Regular expressions are computer science’s ancient pact with the void: a concise language for matching patterns in text. Before we descend into the crypt of cryptic glyphs, we begin with the gentlest concept: literal characters.',
      'A literal character matches itself. If you write the pattern `cat`, the regex engine will look for the exact sequence "c", followed by "a", followed by "t". Case matters by default: `Cat` is not `cat`, and computers have no mercy for sloppy capitalization.',
      'Literals match substrings, not just whole words. The pattern `cat` will match "cat" inside "category", "caterpillar", or "concatenate" because the engine looks for the sequence anywhere in the text.',
      'Some characters in regex have magical secret identities (like `.`, `*`, `+`, `?`, `^`, `$`, `\`, `[`, `]`, `(`, `)`). If you actually want to match a real dot or question mark, you must disarm it by escaping it with a backslash: `\.` or `\?`.',
      'For your first trial, prove you can spot the sequence "cat" in ordinary text.'
    ],
    exercisePrompt: 'Write a regex pattern that matches the literal string "cat". It should match sentences containing "cat" as a substring, but ignore ones with only "dog" or misspelled versions.',
    hint: 'Type `cat` into the pattern input. No magic spells required yet.',
    solution: 'cat',
    flags: 'g',
    tip: 'Regex engines scan text from left to right, testing each character one by one until a match is found or exhaustion sets in.',
    testCases: [
      {
        id: '1-1',
        text: 'The cat slept peacefully on the keyboard.',
        shouldMatch: true,
        explanation: 'Contains the exact literal substring "cat".'
      },
      {
        id: '1-2',
        text: 'I adopted a black cat yesterday.',
        shouldMatch: true,
        explanation: 'Contains "cat".'
      },
      {
        id: '1-3',
        text: 'The dog barked at the mailman.',
        shouldMatch: false,
        explanation: 'Does not contain the literal "cat".'
      },
      {
        id: '1-4',
        text: 'category management is quite boring.',
        shouldMatch: true,
        explanation: 'Contains "cat" at the start of "category" (lowercase "cat" in substring).'
      },
      {
        id: '1-5',
        text: 'A wandering caterpillar.',
        shouldMatch: true,
        explanation: 'Contains "cat" as a substring.'
      },
      {
        id: '1-6',
        text: 'The CAT was grumpy.',
        shouldMatch: false,
        explanation: 'Regex is case-sensitive by default! "CAT" != "cat".'
      }
    ]
  },
  {
    id: 2,
    slug: 'the-dot',
    title: 'The Dot (`.`)',
    subtitle: 'The wildcard with virtually no standards',
    beltTier: 'White Belt',
    theory: [
      'The dot (`.`) is the ultimate imposter. In standard regex, a bare dot matches almost any single character—letters, numbers, punctuation, spaces—with only newline characters (`\\n`) usually excluded.',
      'Much like a developer’s attention span on a late Friday afternoon, the dot accepts anything that crosses its path. The pattern `h.t` will gladly match `hat`, `hot`, `hit`, `h4t`, `h#t`, and even `h t` with a space.',
      'Because the dot is so indiscriminate, relying on it carelessly is the number one cause of regex accidental matches. Remember: with great flexibility comes the terrifying responsibility of debugging.',
      'Your task: match any three-letter word beginning with "b" and ending with "t".'
    ],
    exercisePrompt: 'Write a pattern that matches "b", any single middle character, followed by "t".',
    hint: 'Use the dot between "b" and "t": `b.t`.',
    solution: 'b.t',
    flags: 'g',
    tip: 'If you ever want to match an actual period mark (like the dot at the end of a sentence), write `\\.` to escape it.',
    testCases: [
      {
        id: '2-1',
        text: 'He swung the bat with power.',
        shouldMatch: true,
        explanation: '"bat" matches "b", any character ("a"), and "t".'
      },
      {
        id: '2-2',
        text: 'A small bot crawled the web.',
        shouldMatch: true,
        explanation: '"bot" matches "b", any character ("o"), and "t".'
      },
      {
        id: '2-3',
        text: 'I felt a bit cold.',
        shouldMatch: true,
        explanation: '"bit" matches "b", any character ("i"), and "t".'
      },
      {
        id: '2-4',
        text: 'b9t prototype is ready.',
        shouldMatch: true,
        explanation: '"b9t" matches "b", a digit ("9"), and "t".'
      },
      {
        id: '2-5',
        text: 'The boat sank in the river.',
        shouldMatch: false,
        explanation: '"boat" has two characters ("oa") between b and t. The single dot only matches ONE character.'
      },
      {
        id: '2-6',
        text: 'bt is an abbreviation.',
        shouldMatch: false,
        explanation: '"bt" has zero characters between b and t. The dot requires exactly one.'
      }
    ]
  },
  {
    id: 3,
    slug: 'anchors',
    title: 'Anchors (`^` and `$`)',
    subtitle: 'Drawing lines in the algorithmic sand',
    beltTier: 'Yellow Belt',
    theory: [
      'By default, regex engines are opportunistic scavengers: they will match a pattern anywhere in the target string. Sometimes, however, you need to stake a claim on where the match starts or finishes.',
      'Meet the anchors: `^` (caret) asserts the start of the string, and `$` (dollar sign) asserts the end of the string.',
      'Anchors are zero-width assertions. They don\'t consume or match any actual characters themselves; they merely assert that the engine is currently standing at the exact edge of the world.',
      'For example, `^Error` only matches if the string starts with "Error". `done$` only matches if the string terminates with "done". Wrapping both—`^success$`—requires the string to equal "success" entirely.',
      'You\'ll sometimes see patterns like `.*` between anchors. The dot `.` matches any single character, and the star `*` means "zero or more times". Together, `.*` matches any sequence of characters (or nothing at all).'
    ],
    exercisePrompt: 'Match lines that start with the word "PASS" and end with a dot ".". The entire string must start with PASS and end with a dot.',
    hint: 'Combine `^PASS` at the start with `\\.$` at the end. Don\'t forget to escape the dot with `\\.` so it doesn\'t act as a wildcard! The pattern `^PASS: .*\\.$` matches strings starting with "PASS: " and ending with a period, with any content in between.',
    solution: '^PASS: .*\\.$',
    flags: '',
    tip: 'Think of `^` as an anchor pinned to the left margin, and `$` as an anchor pinned to the right margin.',
    testCases: [
      {
        id: '3-1',
        text: 'PASS: System verified.',
        shouldMatch: true,
        explanation: 'Starts with PASS: and ends with a period.'
      },
      {
        id: '3-2',
        text: 'PASS: All 42 tests succeeded.',
        shouldMatch: true,
        explanation: 'Starts with PASS: and ends with a period.'
      },
      {
        id: '3-3',
        text: 'WARNING: PASS: System verified.',
        shouldMatch: false,
        explanation: 'Does not start at the beginning with PASS.'
      },
      {
        id: '3-4',
        text: 'PASS: Tests failed!',
        shouldMatch: false,
        explanation: 'Does not end with a period.'
      },
      {
        id: '3-5',
        text: 'PASS: System crash',
        shouldMatch: false,
        explanation: 'Missing the ending period.'
      }
    ]
  },
  {
    id: 4,
    slug: 'character-classes',
    title: 'Character Classes (`[...]`)',
    subtitle: 'The VIP list of allowed characters',
    beltTier: 'Yellow Belt',
    theory: [
      'When the dot is too reckless and a literal is too rigid, character classes arrive to restore order. Brackets `[...]` let you specify a custom set of permitted characters.',
      'A character class matches exactly ONE character, provided it is in the list. `[aeiou]` matches any single lowercase English vowel. `[0-9]` matches any digit. `[a-z]` matches any lowercase letter.',
      'You can also invert the list by putting a caret `^` right after the opening bracket: `[^0-9]` matches any character that is NOT a digit. (Notice how the caret changes meaning inside brackets—regex loves reusing symbols to keep you on your toes).',
      'Let’s test your precision: match three-letter words like `cat`, `cot`, or `cut`, but strictly forbid `cit` or `cet`.'
    ],
    exercisePrompt: 'Write a pattern starting with "c", followed by either "a", "o", or "u", followed by "t".',
    hint: 'Put the allowed middle vowels inside brackets: `c[aou]t`.',
    solution: 'c[aou]t',
    flags: 'g',
    tip: 'Inside brackets `[]`, most special characters (like `.` or `*`) lose their magic powers and behave like normal characters.',
    testCases: [
      {
        id: '4-1',
        text: 'The cat sat on the mat.',
        shouldMatch: true,
        explanation: '"cat" matches c + "a" + t.'
      },
      {
        id: '4-2',
        text: 'Sleep on a comfortable cot.',
        shouldMatch: true,
        explanation: '"cot" matches c + "o" + t.'
      },
      {
        id: '4-3',
        text: 'Take a cut of the profits.',
        shouldMatch: true,
        explanation: '"cut" matches c + "u" + t.'
      },
      {
        id: '4-4',
        text: 'cite your sources properly.',
        shouldMatch: false,
        explanation: '"cit" is not allowed; "i" is not in [aou].'
      },
      {
        id: '4-5',
        text: 'A cetacean is a marine mammal.',
        shouldMatch: false,
        explanation: '"cet" is not allowed; "e" is not in [aou].'
      }
    ]
  },
  {
    id: 5,
    slug: 'shorthand-classes',
    title: 'Shorthand Classes (`\\d`, `\\w`, `\\s`)',
    subtitle: 'Typing less, suffering slightly less',
    beltTier: 'Green Belt',
    theory: [
      'Typing `[0-9]` and `[a-zA-Z0-9_]` over and over is a great way to develop carpal tunnel syndrome. Fortunately, regex provides built-in shorthands for common character sets:',
      '• `\\d`: Any digit (same as `[0-9]`)\n• `\\w`: Any "word" character: letters, numbers, and underscores (same as `[a-zA-Z0-9_]`)\n• `\\s`: Any whitespace character: spaces, tabs, line breaks, form feed, and other Unicode whitespace\n',
      'The poetic inverse: capitalizing the letter flips the meaning completely! `\\D` is non-digits, `\\W` is non-word characters, and `\\S` is non-whitespace characters.',
      'Exercise: Match a product code formatted as two uppercase letters, followed by a dash, followed by three digits (e.g., `AB-123`).'
    ],
    exercisePrompt: 'Match product codes consisting of two uppercase letters [A-Z], a hyphen, and three digits \\d.',
    hint: 'Use `[A-Z][A-Z]-\\d\\d\\d` to match exactly two letters and three digits.',
    solution: '[A-Z][A-Z]-\\d\\d\\d',
    flags: 'g',
    tip: 'Remember: `\\w` includes underscores `_`. If you don\'t want underscores, stick to `[a-zA-Z0-9]`.',
    testCases: [
      {
        id: '5-1',
        text: 'Order item SKU: AB-123 is ready.',
        shouldMatch: true,
        explanation: 'AB-123 has two uppercase letters, a dash, and three digits.'
      },
      {
        id: '5-2',
        text: 'Warehouse shelf ZX-904.',
        shouldMatch: true,
        explanation: 'ZX-904 matches the format.'
      },
      {
        id: '5-3',
        text: 'Invalid item ab-123 lowercase.',
        shouldMatch: false,
        explanation: 'Must be uppercase letters.'
      },
      {
        id: '5-4',
        text: 'Item code A-123 is too short.',
        shouldMatch: false,
        explanation: 'Has only one letter before the dash.'
      },
      {
        id: '5-5',
        text: 'Item code AB-12 is missing a digit.',
        shouldMatch: false,
        explanation: 'Has only two digits instead of three.'
      }
    ]
  },
  {
    id: 6,
    slug: 'quantifiers',
    title: 'Quantifiers (`*`, `+`, `?`)',
    subtitle: 'How much is that in dog iterations?',
    beltTier: 'Green Belt',
    theory: [
      'Up to now, every token has matched exactly once. In the real world, characters repeat, vanish, or multiply like uncaught memory leaks. Enter the trio of classic quantifiers:',
      '• `+` (plus): One or more times. `go+al` matches "goal", "goooal", "gooooooal", but NOT "gal".\n• `*` (star): Zero or more times. `go*al` matches all the above PLUS "gal".\n• `?` (question mark): Zero or one time (optional). `colou?r` matches both British "colour" and American "color".',
      'Notice that quantifiers apply strictly to the single token immediately preceding them! If you write `abc+`, only the `c` is repeated ("abcc", "abccc"), not "abcabc".',
      'Ready to tame repetitions? Let’s write a pattern to match a user yelling "yay" with one or more "a"s.'
    ],
    exercisePrompt: 'Match words that start with "y", have one or more "a"s, and end with "y" (e.g., "yay", "yaaaay").',
    hint: 'Use the plus sign right after the "a": `ya+y`.',
    solution: 'ya+y',
    flags: 'g',
    tip: 'Quantifiers are greedy by default: they will devour as many characters as possible before giving anything back.',
    testCases: [
      {
        id: '6-1',
        text: 'She shouted: yay!',
        shouldMatch: true,
        explanation: '"yay" has exactly one "a".'
      },
      {
        id: '6-2',
        text: 'He screamed: yaaaay!',
        shouldMatch: true,
        explanation: '"yaaaay" has 4 "a"s, matching "one or more".'
      },
      {
        id: '6-3',
        text: 'yaaaaaaaaaaay we did it!',
        shouldMatch: true,
        explanation: 'Many "a"s matched by `a+`.'
      },
      {
        id: '6-4',
        text: 'yy is not cheering.',
        shouldMatch: false,
        explanation: 'Has zero "a"s. The `+` quantifier requires at least one.'
      },
      {
        id: '6-5',
        text: 'yes is a different word.',
        shouldMatch: false,
        explanation: 'Does not end in y with "a"s.'
      }
    ]
  },
  {
    id: 7,
    slug: 'greedy-vs-lazy',
    title: 'Greedy vs Lazy Quantifiers',
    subtitle: 'The art of restraint in a gluttonous world',
    beltTier: 'Green Belt',
    theory: [
      'By default, quantifiers are greedy: they devour as many characters as possible before surrendering anything. The pattern `a+` on "aaaaa" matches all five "a"s because greed is the default state.',
      'Sometimes you want minimal matching instead. Add a question mark `?` after any quantifier to make it lazy: `a+?` now matches only one "a", then stops.',
      'This distinction matters most when you\'re matching delimited content. Greedy `<.+>` on "<div>hello</div>" swallows everything from the first `<` to the final `>`. Lazy `<.+?>` stops at the first `>`.',
      'Your trial: match the shortest possible text between quote marks.'
    ],
    exercisePrompt: 'Match the shortest possible content between double quotes, including empty quotes. Use lazy quantifiers to stop at the first closing quote.',
    hint: 'Use a lazy quantifier that allows zero characters: `".*?"` matches the shortest text between quotes (even `""`).',
    solution: '".*?"',
    flags: 'g',
    tip: 'Greedy is usually what you want, but lazy is your weapon against over-matching in HTML, JSON, or any structured text.',
    testCases: [
      {
        id: '7-1',
        text: 'He said "hello" to her.',
        shouldMatch: true,
        expectedMatch: '"hello"',
        explanation: 'Matches "hello" - the shortest content between quotes.'
      },
      {
        id: '7-2',
        text: 'The file "data.txt" was processed.',
        shouldMatch: true,
        expectedMatch: '"data.txt"',
        explanation: 'Matches "data.txt" - shortest quoted string.'
      },
      {
        id: '7-3',
        text: 'She shouted "stop!" and ran.',
        shouldMatch: true,
        expectedMatch: '"stop!"',
        explanation: 'Matches "stop!" - shortest quoted text with punctuation.'
      },
      {
        id: '7-4',
        text: 'Message: "first" then "second" end.',
        shouldMatch: true,
        expectedMatches: [{ text: '"first"', start: 9, end: 16 }, { text: '"second"', start: 22, end: 30 }],
        explanation: 'Lazy quantifier matches "first" separately from "second".'
      },
      {
        id: '7-5',
        text: 'No quotes here.',
        shouldMatch: false,
        explanation: 'No double quotes present to match.'
      },
      {
        id: '7-6',
        text: 'Empty quotes "" should match.',
        shouldMatch: true,
        expectedMatch: '""',
        explanation: 'The `*` in the lazy `.*?` allows zero characters, so even empty quotes `""` match.'
      },
      {
        id: '7-7',
        text: 'He said "hello" and "world" to her.',
        shouldMatch: true,
        expectedMatches: [{ text: '"hello"', start: 8, end: 15 }, { text: '"world"', start: 20, end: 27 }],
        explanation: 'Lazy quantifier should match each quoted string separately, not one big match.'
      }
    ]
  },
  {
    id: 8,
    slug: 'bounded-quantifiers',
    title: 'Bounded Quantifiers (`{n}`, `{n,m}`)',
    subtitle: 'When "some" isn\'t specific enough',
    beltTier: 'Blue Belt',
    theory: [
      'The star `*` and plus `+` are reckless gluttons—they take as much as they can get. Sometimes you need strict boundaries. Enter curly braces `{}`.',
      '• `{n}`: Exactly n times. `\\d{4}` matches exactly 4 digits (like a year: 2026).\n• `{n,}`: At least n times. `\\d{3,}` matches 3 or more digits.\n• `{n,m}`: Between n and m times, inclusive. `\\w{3,8}` matches words between 3 and 8 characters long.',
      'A classic gotcha: NEVER put a space inside the curly braces. `{2, 4}` will fail or literally search for spaces in some engines. Keep it snug: `{2,4}`.',
      'Let’s test your calibration: match a US zip code, which is exactly 5 digits.'
    ],
    exercisePrompt: 'Match a 5-digit zip code consisting entirely of digits. Use ^ and $ to ensure the whole string is exactly 5 digits.',
    hint: 'Combine `^`, `\\d{5}`, and `$`: `^\\d{5}$`.',
    solution: '^\\d{5}$',
    flags: '',
    tip: 'Without anchors `^` and `$`, `\\d{5}` would match the first 5 digits of a 9-digit phone number!',
    testCases: [
      {
        id: '8-1',
        text: '90210',
        shouldMatch: true,
        explanation: 'Exactly 5 digits.'
      },
      {
        id: '8-2',
        text: '10001',
        shouldMatch: true,
        explanation: 'Exactly 5 digits.'
      },
      {
        id: '8-3',
        text: '1234',
        shouldMatch: false,
        explanation: 'Only 4 digits; requires exactly 5.'
      },
      {
        id: '8-4',
        text: '123456',
        shouldMatch: false,
        explanation: '6 digits; too long.'
      },
      {
        id: '8-5',
        text: '9021A',
        shouldMatch: false,
        explanation: 'Contains a non-digit letter.'
      }
    ]
  },
  {
    id: 9,
    slug: 'groups',
    title: 'Capturing Groups (`()`)',
    subtitle: 'Herding your expressions into neat corrals',
    beltTier: 'Blue Belt',
    theory: [
      'Parentheses `(...)` are the Swiss Army knife of regex. They perform two critical roles simultaneously:',
      '1. **Grouping**: Treating multiple tokens as a single unit. `ha+` matches "haa", but `(ha)+` matches "haha" and "hahaha".\n2. **Capturing**: Stashing whatever matched inside the parentheses into a numbered memory slot (Group 1, Group 2...) for later retrieval.',
      'If you just want grouping without wasting memory on capturing, you can use non-capturing groups: `(?:ha)+`. The engine will group without allocating a capture pocket.',
      'Challenge: Match repeated laughter like "ha", "haha", or "hahaha" where "ha" repeats one or more times from start to finish.'
    ],
    exercisePrompt: 'Match the full string composed of one or more repetitions of "ha" (e.g. "ha", "haha", "hahahaha"). Use one capturing group around "ha" so Group 1 contains the final "ha" repetition.',
    hint: 'Group "ha" in parentheses and follow with a `+` quantifier: `^(ha)+$`.',
    solution: '^(ha)+$',
    flags: '',
    tip: 'Numbered capture groups allow you to perform powerful search-and-replace transformations in any programming language.',
    testCases: [
      {
        id: '9-1',
        text: 'ha',
        shouldMatch: true,
        expectedMatches: [{ text: 'ha', start: 0, end: 2, captures: ['ha'] }],
        explanation: 'One repetition of "ha".'
      },
      {
        id: '9-2',
        text: 'haha',
        shouldMatch: true,
        expectedMatches: [{ text: 'haha', start: 0, end: 4, captures: ['ha'] }],
        explanation: 'Two repetitions of "ha".'
      },
      {
        id: '9-3',
        text: 'hahahaha',
        shouldMatch: true,
        expectedMatches: [{ text: 'hahahaha', start: 0, end: 8, captures: ['ha'] }],
        explanation: 'Four repetitions of "ha".'
      },
      {
        id: '9-4',
        text: 'hah',
        shouldMatch: false,
        explanation: 'Ends abruptly on "h" without the trailing "a".'
      },
      {
        id: '9-5',
        text: 'ah',
        shouldMatch: false,
        explanation: 'Characters in wrong order.'
      }
    ]
  },
  {
    id: 10,
    slug: 'alternation',
    title: 'Alternation (`|`)',
    subtitle: 'The logical OR: choosing your poison',
    beltTier: 'Brown Belt',
    theory: [
      'The pipe character `|` is regex’s boolean OR. It says: match whatever is on my left, OR whatever is on my right.',
      'Be wary of precedence! `cat|dog` matches "cat" or "dog". But `I love cat|dog` matches either "I love cat" OR "dog" (probably not what you intended).',
      'To restrict the scope of alternation, enclose the choices in a group: `I love (cat|dog)` matches both "I love cat" and "I love dog".',
      'Trial: Match greeting sentences that start with either "Hello" or "Hi", followed by a name (e.g. "Hello Alice" or "Hi Bob").'
    ],
    exercisePrompt: 'Match strings that start with either "Hello " or "Hi ", followed by one or more word characters \\w+.',
    hint: 'Use a group with alternation: `^(Hello|Hi) \\w+$`.',
    solution: '^(Hello|Hi) \\w+$',
    flags: '',
    tip: 'Alternation checks choices from left to right. If the first choice matches, the engine stops looking!',
    testCases: [
      {
        id: '10-1',
        text: 'Hello Alice',
        shouldMatch: true,
        explanation: 'Starts with "Hello " followed by word chars.'
      },
      {
        id: '10-2',
        text: 'Hi Bob',
        shouldMatch: true,
        explanation: 'Starts with "Hi " followed by word chars.'
      },
      {
        id: '10-3',
        text: 'Hey Charlie',
        shouldMatch: false,
        explanation: '"Hey" is neither "Hello" nor "Hi".'
      },
      {
        id: '10-4',
        text: 'Greetings Dave',
        shouldMatch: false,
        explanation: 'Not one of the allowed greetings.'
      },
      {
        id: '10-5',
        text: 'Hello ',
        shouldMatch: false,
        explanation: 'Missing the name after the greeting.'
      }
    ]
  },
  {
    id: 11,
    slug: 'word-boundaries',
    title: 'Word Boundaries (`\\b`)',
    subtitle: 'Stopping your patterns from swallowing innocent bystanders',
    beltTier: 'Brown Belt',
    theory: [
      'Have you ever searched for the word "cat" in a document, only to find yourself highlighting "ca-t-egory", "ca-t-astrophe", and "ca-t-erpillar"? This is why `\\b` exists.',
      '`\\b` is an anchor asserting a word boundary: the invisible zero-width seam between a word character (`\\w`) and a non-word character (or the start/end of the string).',
      'Wrapping a term in word boundaries—`\\bcat\\b`—ensures you only match "cat" when it stands alone as an independent word, ignoring "scat", "cats", or "concatenate".',
      'Its sibling `\\B` matches non-boundaries: places where adjacent characters are both word characters or both non-word characters.'
    ],
    exercisePrompt: 'Match the standalone word "plan" using word boundaries \\b, avoiding words like "planet", "airplane", or "planning".',
    hint: 'Wrap "plan" with word boundaries: `\\bplan\\b`.',
    solution: '\\bplan\\b',
    flags: 'g',
    tip: '`\\b` is not a character; it is a zero-width checkpoint inspecting whether adjacent characters cross between word and non-word territory.',
    testCases: [
      {
        id: '11-1',
        text: 'Do you have a plan?',
        shouldMatch: true,
        explanation: '"plan" is preceded by space and followed by question mark (both non-word).'
      },
      {
        id: '11-2',
        text: 'The plan was simple.',
        shouldMatch: true,
        explanation: '"plan" is a standalone word.'
      },
      {
        id: '11-3',
        text: 'Earth is a giant planet.',
        shouldMatch: false,
        explanation: '"planet" contains "plan", but has no word boundary after "n".'
      },
      {
        id: '11-4',
        text: 'We board the airplane at noon.',
        shouldMatch: false,
        explanation: '"airplane" contains "plan" inside, so no boundary at start.'
      },
      {
        id: '11-5',
        text: 'They are currently planning.',
        shouldMatch: false,
        explanation: 'Contains "plan" but does not end on a boundary.'
      }
    ]
  },
  {
    id: 12,
    slug: 'lookarounds',
    title: 'Lookarounds',
    subtitle: 'The ninjas of regex: checking without consuming',
    beltTier: 'Black Belt Candidate',
    theory: [
      'Lookarounds are the most feared yet elegant constructs in regex. Think of them as polite assassins: they inspect what lies ahead or behind, verify conditions, and vanish without consuming a single character.',
      'There are four lookarounds:\n• `(?=...)` Positive lookahead: "asserts that what follows matches ..."\n• `(?!...)` Negative lookahead: "asserts that what follows does NOT match ..."\n• `(?<=...)` Positive lookbehind: "asserts that what precedes matches ..."\n• `(?<!...)` Negative lookbehind: "asserts that what precedes does NOT match ..."',
      'For example, `\\d+(?=px)` matches numbers ONLY if they are immediately followed by "px", but "px" itself is NOT included in the final match! Only the digits are grabbed.',
      'Let’s try a practical task: match prices that have a dollar sign `$` in front of them, but match only the numeric amount.'
    ],
    exercisePrompt: 'Match digit sequences \\d+ only when immediately preceded by a dollar sign $. Do NOT match the dollar sign itself.',
    hint: 'Use a positive lookbehind: `(?<=\\$)\\d+`. Remember to escape the dollar sign with `\\$`.',
    solution: '(?<=\\$)\\d+',
    flags: 'g',
    tip: 'Because lookarounds are zero-width, you can stack them! This is how complex password rules (at least 1 digit, 1 symbol, etc.) are written.',
    testCases: [
      {
        id: '12-1',
        text: 'The ticket costs $45 today.',
        shouldMatch: true,
        expectedMatches: [{ text: '45', start: 18, end: 20 }],
        explanation: 'Matches "45" because it is preceded by "$".'
      },
      {
        id: '12-2',
        text: 'Total bill: $120 plus tax.',
        shouldMatch: true,
        expectedMatches: [{ text: '120', start: 13, end: 16 }],
        explanation: 'Matches "120" preceded by "$".'
      },
      {
        id: '12-3',
        text: 'He bought 45 apples at the market.',
        shouldMatch: false,
        explanation: '"45" is preceded by a space, not a dollar sign.'
      },
      {
        id: '12-4',
        text: 'Room 120 is on the first floor.',
        shouldMatch: false,
        explanation: 'No dollar sign before "120".'
      },
      {
        id: '12-5',
        text: 'Price is €45 euros.',
        shouldMatch: false,
        explanation: 'Preceded by euro symbol, not dollar sign.'
      },
      {
        id: '12-6',
        text: '$45 and $120; 45 without a dollar sign.',
        shouldMatch: true,
        expectedMatches: [{ text: '45', start: 1, end: 3 }, { text: '120', start: 9, end: 12 }],
        explanation: 'Extract both complete amounts, excluding dollar signs and the unrelated 45.'
      }
    ]
  },
  {
    id: 13,
    slug: 'capstone-email',
    title: 'Capstone (Email & The Illusion of Perfection)',
    subtitle: 'The final trial: embracing the limits of the craft',
    beltTier: 'Regex Sensei',
    isCapstone: true,
    theory: [
      'Congratulations, warrior. You have reached the pinnacle of the basics. To test your collective mastery, we arrive at the rite of passage that has driven thousands of engineers to despair: email validation.',
      'The official RFC 5322 specification for email addresses is an ungodly 6,000-character monstrosity supporting IP literals, quoted strings with spaces, comments inside parentheses, and bizarre edge cases. Trying to write a "100% complete" email regex is a fool’s errand.',
      'Instead, pragmatic developers write a sensible approximation: username characters (letters, digits, dots, pluses, dashes), followed by `@`, followed by domain characters, a dot, and a top-level domain of at least two letters.',
      'For your final trial to earn the Black Belt, write a standard pragmatic email validator: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`.'
    ],
    exercisePrompt: 'Write a practical regex to validate email addresses: username + "@" + domain + "." + TLD (at least 2 letters). Anchor from ^ to $!',
    hint: 'Pattern: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`',
    solution: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: '',
    tip: 'Real-world wisdom: The best way to validate an email in production is to check if it looks roughly plausible, and then send a confirmation link. The network does what regex cannot.',
    testCases: [
      {
        id: '13-1',
        text: 'sensei@regexdojo.dev',
        shouldMatch: true,
        explanation: 'Valid standard email with letters and dot.'
      },
      {
        id: '13-2',
        text: 'coder.hero+test@gmail.com',
        shouldMatch: true,
        explanation: 'Valid email with dots and plus tagging.'
      },
      {
        id: '13-3',
        text: 'student42@sub.domain.org',
        shouldMatch: true,
        explanation: 'Valid subdomain email.'
      },
      {
        id: '13-4',
        text: 'plainaddress',
        shouldMatch: false,
        explanation: 'Missing @ and domain.'
      },
      {
        id: '13-5',
        text: '@missingusername.com',
        shouldMatch: false,
        explanation: 'No username before the @.'
      },
      {
        id: '13-6',
        text: 'user@domain',
        shouldMatch: false,
        explanation: 'Missing top-level domain (.com, etc).'
      },
      {
        id: '13-7',
        text: 'user@domain.c',
        shouldMatch: false,
        explanation: 'TLD must have at least 2 characters.'
      }
    ]
  }
];
