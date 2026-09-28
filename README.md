# RegexDojo

An interactive regex learning playground built with React, Vite, and TypeScript. Master regular expressions through hands-on lessons, translation exercises, and a sandbox playground—all with a dark humor twist.

## Features

### 🥋 Structured Learning Path
- **13 Progressive Lessons**: From basic literals to advanced lookarounds and capstone challenges
- **Interactive Exercises**: Write regex patterns and get instant feedback with detailed explanations
- **Belt Tier System**: Track your progress from White Belt to Black Belt
- **Smart Hints**: Get helpful nudges when you're stuck without spoiling the solution

### 🎮 Four Learning Modes
1. **Intro Mode**: Landing page with progress tracking and lesson selection
2. **Learn Mode**: Structured lessons with theory, examples, and hands-on exercises
3. **Translate Mode**: Translate plain English descriptions into regex patterns
4. **Playground Mode**: Free-form sandbox for experimentation and testing

### 🎨 Visual Theme System
- **6 Custom Themes**: Including Warm Halo, Glacius, Nord, Dracula, Abyss, and Tokyo Night
- **Dark/Light Mode**: System-aware with manual override options
- **VSCode-inspired Palettes**: Familiar colors for developers
- **Real-time Theme Switching**: Instant visual feedback

### 🔧 Advanced Features
- **Regex Tokenizer**: Break down patterns into understandable components
- **Error Decoder**: Friendly explanations for cryptic regex error messages
- **URL Sharing**: Share playground states via URL hash for collaboration
- **Cheat Sheet**: Quick reference guide accessible via keyboard shortcut (`?`)
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Sound Effects**: Satisfying audio feedback for interactions

### 🧪 Robust Testing
- **Content Validation**: All lesson solutions pass their own test cases
- **Grading Regression Tests**: 195+ assertions ensure grading accuracy
- **Type Safety**: Full TypeScript coverage with strict type checking
- **CI/CD Pipeline**: Automated testing on every push and pull request

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

### Prerequisites
- Node.js 20 or higher
- npm (package manager)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs on `http://localhost:3000` with hot module replacement.

## Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Type-check only (tsc --noEmit)
- `npm run test:lessons` - Content validator (13 lessons)
- `npm run test:grading` - Grading regression tests (195+ assertions)
- `npm run clean` - Remove build artifacts

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Effects**: Canvas Confetti
- **Testing**: Custom test runners with tsx

## Browser Compatibility

Works in all modern browsers that support:
- ES2020+ JavaScript features
- CSS Custom Properties
- Web Audio API
- RegExp Unicode properties

Tested on Chrome, Firefox, Safari, and Edge latest versions.

## Project Structure

```
RegexDojo/
├── src/
│   ├── components/     # React components (8 view/UI components)
│   ├── data/          # Lessons, themes, error dictionary
│   ├── utils/         # Matcher, grader, tokenizer, sound
│   ├── hooks/         # Custom React hooks
│   └── types.ts       # TypeScript interfaces
├── test-lessons.ts    # Content validator
├── test-enhanced-grading.ts  # Grading regression tests
└── vite.config.ts     # Vite configuration
```

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please ensure:
- All tests pass (`npm run test:lessons` and `npm run test:grading`)
- Type checking passes (`npm run lint`)
- Code follows existing conventions
- Lessons maintain the dark humor tone without being mean-spirited

## Acknowledgments

Built with modern web technologies and a commitment to making regex learning less painful and more enjoyable.
