import { PresetPattern, PlaygroundPresetText } from '../types';

export const TRANSLATE_PRESETS: PresetPattern[] = [
  {
    id: 'email',
    name: 'Email Address',
    category: 'Validation',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: '',
    description: 'Pragmatic email validator matching standard username, domain, and top-level domain.'
  },
  {
    id: 'ipv4',
    name: 'IPv4 Address',
    category: 'Networking',
    pattern: '^(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)$',
    flags: '',
    description: 'Strict IPv4 address validator ensuring each octet is within 0-255.'
  },
  {
    id: 'url',
    name: 'Web URL (HTTP/HTTPS)',
    category: 'Web',
    pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$',
    flags: '',
    description: 'Matches standard web links with protocol, domain, optional port, path, and query params.'
  },
  {
    id: 'hex-color',
    name: 'Hex Color Code',
    category: 'Design & CSS',
    pattern: '^#(?:[0-9a-fA-F]{3}){1,2}$',
    flags: '',
    description: 'Matches 3-digit (#FFF) or 6-digit (#FFFFFF) hexadecimal color notation.'
  },
  {
    id: 'iso-date',
    name: 'ISO Date (YYYY-MM-DD)',
    category: 'Formatting',
    pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$',
    flags: '',
    description: 'Validates calendar dates in ISO 8601 format with month and day range checks.'
  },
  {
    id: 'phone-us',
    name: 'US Phone Number',
    category: 'Formatting',
    pattern: '^(?:\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$',
    flags: '',
    description: 'Captures 3-digit area code, 3-digit prefix, and 4-digit line number with optional country code.'
  },
  {
    id: 'markdown-link',
    name: 'Markdown Link',
    category: 'Markup',
    pattern: '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s)]+)\\)',
    flags: 'g',
    description: 'Extracts markdown link text in Group 1 and the target HTTP/HTTPS URL in Group 2.'
  },
  {
    id: 'password-strength',
    name: 'Strong Password',
    category: 'Security',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    flags: '',
    description: 'Enforces min 8 chars, at least 1 lowercase, 1 uppercase, 1 number, and 1 special symbol via lookaheads.'
  }
];

export const PLAYGROUND_PRESETS: PlaygroundPresetText[] = [
  {
    id: 'server-logs',
    name: 'Server Access Logs',
    content: `192.168.1.105 - - [09/Sep/2026:12:34:56 +0000] "GET /api/v1/users?limit=25 HTTP/1.1" 200 4521 "https://regexdojo.dev" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
10.0.0.42 - - [09/Sep/2026:12:35:01 +0000] "POST /api/v1/auth/login HTTP/1.1" 401 184 "-" "curl/8.1.2"
172.16.254.1 - - [09/Sep/2026:12:35:12 +0000] "GET /assets/logo.svg HTTP/1.1" 304 0 "https://regexdojo.dev/learn" "Chrome/128.0"
192.168.1.105 - - [09/Sep/2026:12:35:45 +0000] "DELETE /api/v1/session HTTP/1.1" 204 0 "https://regexdojo.dev" "Mozilla/5.0"
203.0.113.195 - - [09/Sep/2026:12:36:00 +0000] "GET /admin/config.php HTTP/1.1" 404 153 "-" "masscan/1.3"`
  },
  {
    id: 'user-directory',
    name: 'Customer Directory',
    content: `Name: Sarah Connor | Email: sconnor@cyberdyne.org | Phone: (310) 555-0199 | Role: Resistance Leader
Name: John Doe | Email: john.doe@example.com | Phone: 212-555-4321 | Role: Quality Assurance
Name: Ada Lovelace | Email: ada@analytical-engine.co.uk | Phone: +44 20 7946 0912 | Role: Head of Architecture
Name: Alan Turing | Email: aturing@bletchley.ac.uk | Phone: (415) 555-8833 | Role: Cryptanalyst
Name: Grace Hopper | Email: grace.hopper@navy.mil | Phone: 703-555-0177 | Role: Compiler Pioneer`
  },
  {
    id: 'code-sample',
    name: 'TypeScript Code Sample',
    content: `// Regular expression matching engine
import { useState, useEffect } from 'react';

const API_KEY = "sk_live_example_placeholder_0000000000"; // Demo fixture only — never a real key
const MAX_RETRIES = 5;

export function compilePattern(rawInput: string, flags: string = 'g'): RegExp | null {
  try {
    const sanitized = rawInput.trim();
    return new RegExp(sanitized, flags);
  } catch (err: unknown) {
    console.error("Syntax compile error:", (err as Error).message);
    return null;
  }
}

/* Calculate total tokens */
const totalCount: number = 42;
console.log(\`Processed \${totalCount} tokens successfully.\`);`
  },
  {
    id: 'markdown-notes',
    name: 'Markdown Documentation',
    content: `# Dojo Training Notes

Regular expressions were invented in **1951** by mathematician *Stephen Cole Kleene*.
Check out the [Official Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) for more details.

### Key Milestones:
- 1968: Ken Thompson incorporates regex into [ed editor](https://en.wikipedia.org/wiki/Ed_(text_editor))
- 1987: Larry Wall releases Perl with native regex support
- 2026: RegexDojo saves sanity worldwide at [RegexDojo](https://regexdojo.dev)

> "Some people, when confronted with a problem, think 'I know, I'll use regular expressions.' Now they have two problems." — Jamie Zawinski`
  }
];
