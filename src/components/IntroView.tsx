import React from 'react';
import { AppMode } from '../types';
import { Terminal, ShieldAlert, Zap, ArrowRight, Play, ArrowLeftRight, CheckCircle2, Skull, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../utils/sound';

interface IntroViewProps {
  onSelectMode: (mode: AppMode) => void;
  onSelectLesson?: (lessonId: number) => void;
  completedLessonCount: number;
  totalLessons: number;
  isDark: boolean;
}

export const IntroView: React.FC<IntroViewProps> = ({
  onSelectMode,
  onSelectLesson,
  completedLessonCount,
  totalLessons,
  isDark
}) => {
  const handleStartLesson1 = () => {
    sounds.playClick();
    if (onSelectLesson) onSelectLesson(1);
    onSelectMode('learn');
  };

  const belts = [
    { title: 'White Belt', lessons: 'Lessons 1–2', desc: 'Literals and the all-consuming Dot' },
    { title: 'Yellow Belt', lessons: 'Lessons 3–4', desc: 'Anchors and Custom Character Sets' },
    { title: 'Green Belt', lessons: 'Lessons 5–6', desc: 'Shorthands and Classic Quantifiers' },
    { title: 'Blue Belt', lessons: 'Lessons 7–8', desc: 'Bounded Counts and Capturing Groups' },
    { title: 'Brown Belt', lessons: 'Lessons 9–10', desc: 'Alternation and Word Boundaries' },
    { title: 'Regex Sensei', lessons: 'Lessons 11–12', desc: 'Lookaround Ninjas and Capstone Email' },
  ];

  return (
    <div id="intro-view-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fade-in">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Browser-Based Regex Dojo</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          From <span className="text-rose-400 line-through decoration-rose-500/60 decoration-4">Black Magic</span> to{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            Muscle Memory
          </span>
        </h1>

        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          Regular expressions have terrorized developers since 1951. We treat regex like what it truly is:
          a slightly malevolent, delightfully concise puzzle that gives you god-tier text manipulation once understood.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="intro-start-lesson-btn"
            onClick={handleStartLesson1}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <span>{completedLessonCount > 0 ? 'Resume Dojo Training' : 'Enter the Dojo (Lesson 1)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="intro-open-translate-btn"
            onClick={() => onSelectMode('translate')}
            className={`px-5 py-3 rounded-xl border text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'border-neutral-800 bg-neutral-900/70 hover:bg-neutral-800 text-neutral-200'
                : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <span>Translate Alien Regex</span>
          </button>

          <button
            id="intro-open-playground-btn"
            onClick={() => onSelectMode('playground')}
            className={`px-5 py-3 rounded-xl border text-sm sm:text-base font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'border-neutral-800 bg-neutral-900/70 hover:bg-neutral-800 text-neutral-200'
                : 'border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800'
            }`}
          >
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Live Playground</span>
          </button>
        </div>

        {/* Progress snapshot */}
        <div className="pt-2 text-xs font-mono text-neutral-400">
          <span>Your Progress: </span>
          <span className="font-bold text-emerald-400">{completedLessonCount} / {totalLessons} Lessons Mastered</span>
        </div>
      </section>

      {/* Honest Warning Callout */}
      <section
        className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/30 via-neutral-900/60 to-neutral-900/40 border-amber-500/30 text-neutral-200'
            : 'bg-amber-50/70 border-amber-200 text-neutral-800'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold tracking-tight text-amber-300">
              The Dojo Warning & Philosophy
            </h3>
            <p className="text-sm leading-relaxed">
              &quot;Regex is a power tool. It will occasionally take a finger. That’s part of the fun.&quot;
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Regex was born in theoretical automata theory by mathematician Stephen Cole Kleene.
              When Ken Thompson ported it to the Unix <code className="font-mono bg-neutral-800/60 px-1 py-0.5 rounded text-amber-300">ed</code> editor
              and <code className="font-mono bg-neutral-800/60 px-1 py-0.5 rounded text-amber-300">grep</code>,
              a blessing and a curse was cast upon software engineering forever. Use it where it shines (extracting IDs, filtering logs,
              verifying shapes). Never use it to parse HTML, and beware catastrophic backtracking.
            </p>
          </div>
        </div>
      </section>

      {/* Three Modes Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span>The Three Dojo Arenas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Learn */}
          <div
            onClick={() => onSelectMode('learn')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.01] ${
              isDark
                ? 'bg-neutral-900/60 border-neutral-800 hover:border-emerald-500/50'
                : 'bg-white border-neutral-200 hover:border-emerald-500/50 shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition-colors">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between">
              <span>1. The Learn Dojo</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              12 progressive, dark-humored interactive lessons. Each trial gives you real-time verdicts on positive and negative test cases.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>The Basics Block</span>
              <span>12 Lessons</span>
            </div>
          </div>

          {/* Card 2: Translate */}
          <div
            onClick={() => onSelectMode('translate')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.01] ${
              isDark
                ? 'bg-neutral-900/60 border-neutral-800 hover:border-emerald-500/50'
                : 'bg-white border-neutral-200 hover:border-emerald-500/50 shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-neutral-950 transition-colors">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between">
              <span>2. The Translator</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Paste any arcane regex and watch it decompose into a color-coded chain of LEGO-like token pills and plain-English narrative.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-blue-400">
              <span>Instant Deconstruction</span>
              <span>8 Presets</span>
            </div>
          </div>

          {/* Card 3: Playground */}
          <div
            onClick={() => onSelectMode('playground')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.01] ${
              isDark
                ? 'bg-neutral-900/60 border-neutral-800 hover:border-emerald-500/50'
                : 'bg-white border-neutral-200 hover:border-emerald-500/50 shadow-xs'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
              <Play className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold mb-1.5 flex items-center justify-between">
              <span>3. Live Playground</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Test custom patterns against logs, code, or user lists. See live match highlighting, group inspector, execution timing, and share links.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-amber-400">
              <span>Live Engine</span>
              <span>Group Inspector</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dojo Belt Progression Section */}
      <section
        className={`p-6 rounded-2xl border space-y-4 ${
          isDark ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">The Dojo Belt System</h3>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Work through the 12 challenges to earn the coveted Black Belt
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-bold">
            {completedLessonCount} of {totalLessons} Completed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {belts.map((b, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
              }`}
            >
              <div className="text-xs font-bold text-emerald-400">{b.title}</div>
              <div className="text-[11px] font-mono text-neutral-400">{b.lessons}</div>
              <div className={`text-[10px] line-clamp-2 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
