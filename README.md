# RegexDojo

An interactive regex learning playground built with React, Vite, and TypeScript.

## URL Sharing

Share playground states via URL hash. The format is:

```text
#regex=<pattern>&flags=<flags>&text=<text>
```

All parameters are optional. The hash is consumed once on mount and then cleared.

### Example

Share an email regex pattern:

```text
#regex=\b\w+@[\w.]+&flags=g&text=test@example.com
```

When a user opens a URL with this hash, they'll be automatically directed to the playground mode with the specified pattern, flags, and test text pre-loaded.

## Development

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Production build
- `npm run lint` - Type-check only (tsc --noEmit)
- `npm run test:lessons` - Content validator
- `npm run clean` - Remove build artifacts
- `npm run preview` - Preview production build
