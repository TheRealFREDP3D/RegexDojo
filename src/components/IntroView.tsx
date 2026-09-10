import React, { useState } from 'react';
import { AppMode } from '../types';
import {
  Terminal,
  ShieldAlert,
  Zap,
  ArrowRight,
  Play,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Check,
  X,
  Sparkles,
  HelpCircle,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';
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
  const [activePhilTab, setActivePhilTab] = useState<'diagnosis' | 'principles' | 'warning' | 'myths'>('diagnosis');
  const [demoInput, setDemoInput] = useState<string>('user_alex99');

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

  // Live Demystifier evaluation
  const demoRegex = /^user_[a-z0-9]{3,8}$/;
  const isDemoMatch = demoRegex.test(demoInput);

  const getDemoExplanation = (text: string) => {
    if (!text.startsWith('user_')) {
      return { ok: false, reason: 'Must start with literal "user_"' };
    }
    const suffix = text.slice(5);
    if (suffix.length < 3) {
      return { ok: false, reason: `Suffix "${suffix}" is too short (needs at least 3 chars)` };
    }
    if (suffix.length > 8) {
      return { ok: false, reason: `Suffix is ${suffix.length} chars (maximum allowed is 8)` };
    }
    if (!/^[a-z0-9]+$/.test(suffix)) {
      return { ok: false, reason: 'Suffix contains invalid characters (only lowercase letters & digits allowed)' };
    }
    return { ok: true, reason: 'Matches perfectly! Starts with "user_" followed by 3-8 alphanumeric characters.' };
  };

  const demoVerdict = getDemoExplanation(demoInput);

  return (
    <div id="intro-view-container" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-fade-in">
          <HeartHandshake className="w-4 h-4" />
          <span>Built for developers who avoided regex because it looked terrifying</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Regex Isn&apos;t Black Magic.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            It Just Suffered From Terrible PR.
          </span>
        </h1>

        <p className={`max-w-2xl mx-auto text-base sm:text-lg leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          If you&apos;ve spent your career dreading regular expressions because they look like someone sneezed on a mechanical keyboard—welcome home.
          You don&apos;t need a PhD in computer science. Regex is just 3 simple LEGO bricks snapped together.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="intro-start-lesson-btn"
            onClick={handleStartLesson1}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <span>{completedLessonCount > 0 ? 'Resume Dojo Training' : 'Start Lesson 1 (Takes 2 min)'}</span>
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
            <span>Deconstruct Alien Regex</span>
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
          <span>Your Dojo Progress: </span>
          <span className="font-bold text-emerald-400">{completedLessonCount} / {totalLessons} Lessons Mastered</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* THE DOJO WARNING & PHILOSOPHY: Core Guidance for Intimidated Developers */}
      {/* ========================================================================= */}
      <section
        id="dojo-philosophy-section"
        className={`p-6 sm:p-8 rounded-2xl border relative overflow-hidden transition-all ${
          isDark
            ? 'bg-neutral-900/70 border-neutral-800 text-neutral-200'
            : 'bg-white border-neutral-200 text-neutral-800 shadow-sm'
        }`}
      >
        {/* Header with badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-amber-300">
                  The Dojo Warning &amp; Philosophy
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Read Before Coding
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                A frank manifesto for every developer who has avoided regex, copy-pasted mystery strings from StackOverflow, or feared breaking production.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Philosophy Pillars */}
        <div className="flex flex-wrap gap-2 pt-6">
          <button
            id="phil-tab-diagnosis"
            onClick={() => {
              sounds.playClick();
              setActivePhilTab('diagnosis');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePhilTab === 'diagnosis'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                : isDark
                ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>1. Why You Dreaded It</span>
          </button>

          <button
            id="phil-tab-principles"
            onClick={() => {
              sounds.playClick();
              setActivePhilTab('principles');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePhilTab === 'principles'
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/20'
                : isDark
                ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>2. The 3 LEGO Bricks Rule</span>
          </button>

          <button
            id="phil-tab-warning"
            onClick={() => {
              sounds.playClick();
              setActivePhilTab('warning');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePhilTab === 'warning'
                ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                : isDark
                ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>3. The Warning: When NOT to Use It</span>
          </button>

          <button
            id="phil-tab-myths"
            onClick={() => {
              sounds.playClick();
              setActivePhilTab('myths');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activePhilTab === 'myths'
                ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                : isDark
                ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-800'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. Busting Developer Myths</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-6">
          {/* TAB 1: THE DIAGNOSIS */}
          {activePhilTab === 'diagnosis' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 font-mono text-xs sm:text-sm text-neutral-400 overflow-x-auto">
                <span className="text-neutral-500 select-none block text-[10px] uppercase mb-1 font-bold tracking-wider">
                  Exhibit A: The Nightmare That Made You Close The Browser Tab
                </span>
                <span className="text-rose-400 font-bold">
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;$/
                </span>
              </div>

              <h3 className="text-lg font-bold text-neutral-100">
                Why does regex look like someone dropped a mug on their keyboard?
              </h3>

              <div className={`space-y-3 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <p>
                  In 1971, Ken Thompson ported regular expressions into the Unix <code className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-xs text-amber-300">ed</code> editor.
                  In those days, terminals transmitted data at 300 baud over noisy acoustic telephone couplers, and machines had 64 kilobytes of memory.
                  <strong> Every single byte was precious.</strong>
                </p>
                <p>
                  To save bandwidth, readability was utterly discarded. There are no variable declarations, no whitespace, no human words—just compressed symbol glyphs.
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed">
                  <strong className="text-amber-300 font-bold block mb-1">The Dojo Takeaway:</strong>
                  You never struggled with regex because you lacked intelligence. You struggled because regex has <strong>the worst user interface in computer science history</strong>. Once you realize it&apos;s just shorthand for standard <code className="font-mono text-amber-300">if/else</code> loops, the fear vanishes.
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE 3 LEGO BRICKS */}
          {activePhilTab === 'principles' && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <span>The Core Dojo Philosophy: Every Regex is Just 3 LEGO Bricks</span>
              </h3>

              <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                You should <em>never</em> try to read or write a regular expression all at once. Every regex, from the simplest word match to complex email filters, only ever asks three questions:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Brick 1: WHERE</div>
                  <div className="text-sm font-bold mb-1">Position &amp; Anchors</div>
                  <p className="text-xs text-neutral-400 mb-2">Where in the string are we allowed to look?</p>
                  <div className="space-y-1 font-mono text-xs">
                    <div><span className="text-blue-400 font-bold">^</span> = Start of the text</div>
                    <div><span className="text-blue-400 font-bold">$</span> = End of the text</div>
                    <div><span className="text-blue-400 font-bold">\b</span> = Word edge/boundary</div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Brick 2: WHAT</div>
                  <div className="text-sm font-bold mb-1">Characters &amp; Classes</div>
                  <p className="text-xs text-neutral-400 mb-2">What exact characters or shapes do we accept?</p>
                  <div className="space-y-1 font-mono text-xs">
                    <div><span className="text-emerald-400 font-bold">abc</span> = Exact word literal</div>
                    <div><span className="text-emerald-400 font-bold">[0-9]</span> or <span className="text-emerald-400 font-bold">\d</span> = Any digit</div>
                    <div><span className="text-emerald-400 font-bold">[a-z]</span> = Lowercase letters</div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Brick 3: HOW MANY</div>
                  <div className="text-sm font-bold mb-1">Quantifiers</div>
                  <p className="text-xs text-neutral-400 mb-2">How many repetitions of the previous character?</p>
                  <div className="space-y-1 font-mono text-xs">
                    <div><span className="text-amber-400 font-bold">+</span> = One or more</div>
                    <div><span className="text-amber-400 font-bold">*</span> = Zero or more</div>
                    <div><span className="text-amber-400 font-bold">&#123;3,8&#125;</span> = Between 3 and 8 times</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
                <strong className="text-emerald-300 font-bold block mb-0.5">The 80/20 Rule:</strong>
                Knowing just these 3 fundamental bricks solves over <strong>90% of real-world developer tasks</strong> (validating IDs, extracting tokens, scrubbing logs, search-and-replace). You don&apos;t need to learn every obscure flag to be deadly effective.
              </div>
            </div>
          )}

          {/* TAB 3: THE WARNING (WHEN NOT TO USE REGEX) */}
          {activePhilTab === 'warning' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-200">
                <blockquote className="font-mono text-xs sm:text-sm italic">
                  &quot;Some people, when confronted with a problem, think &apos;I know, I&apos;ll use regular expressions.&apos; Now they have two problems.&quot;
                </blockquote>
                <div className="text-[11px] font-semibold text-rose-400 mt-1">
                  — Jamie Zawinski (Famous computer scientist &amp; Netscape hacker, 1997)
                </div>
              </div>

              <h3 className="text-lg font-bold text-neutral-100">
                The Dojo Golden Rule: Knowing When to PUT THE REGEX DOWN
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-4 h-4" />
                    <span>When Regex Shines (Use with pride)</span>
                  </div>
                  <ul className="space-y-1.5 text-neutral-300 text-xs list-disc list-inside">
                    <li>Checking string shapes (slugs, UUIDs, hex color codes, zip codes).</li>
                    <li>Surgically extracting tokens or capture groups from raw log lines.</li>
                    <li>Global search-and-replace across a codebase or document.</li>
                    <li>Enforcing username rules (e.g. 3-16 alphanumeric characters).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/15 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <X className="w-4 h-4" />
                    <span>When Regex is a Trap (STOP immediately)</span>
                  </div>
                  <ul className="space-y-1.5 text-neutral-300 text-xs list-disc list-inside">
                    <li><strong>Parsing HTML/XML/JSON</strong>: Recursive nested tags break regex. Use <code className="font-mono text-amber-300">JSON.parse()</code> or a DOM parser!</li>
                    <li><strong>Simple substring checks</strong>: Don&apos;t write <code className="font-mono text-amber-300">/admin/.test(str)</code> when <code className="font-mono text-amber-300">str.includes(&apos;admin&apos;)</code> is faster and 10x clearer.</li>
                    <li><strong>Complex Date arithmetic</strong>: Use a Date library instead of 300 characters of leap-year regex logic.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MYTHS VS REALITY */}
          {activePhilTab === 'myths' && (
            <div className="space-y-3 animate-fade-in">
              <h3 className="text-lg font-bold text-neutral-100 mb-2">
                Four Common Myths That Keep Developers Paralyzed
              </h3>

              <div className="space-y-3">
                <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20">MYTH</span>
                    <span>&quot;Senior developers can write 80-character regexes out of their head.&quot;</span>
                  </div>
                  <p className="text-xs text-neutral-300 pl-4 border-l-2 border-emerald-500/60 leading-relaxed">
                    <strong>Reality:</strong> Nobody writes complex regex without testing. Senior engineers build them iteratively in an interactive tester like this dojo, test edge cases, and keep them under 30 characters whenever possible.
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20">MYTH</span>
                    <span>&quot;I should just let ChatGPT write all my regex forever.&quot;</span>
                  </div>
                  <p className="text-xs text-neutral-300 pl-4 border-l-2 border-emerald-500/60 leading-relaxed">
                    <strong>Reality:</strong> AI frequently outputs subtly broken regex that passes happy-path tests but fails edge cases or creates catastrophic backtracking. If you cannot read what the AI gave you, you are shipping an unvetted security vulnerability to production.
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20">MYTH</span>
                    <span>&quot;Good regex solves the entire problem in a single line.&quot;</span>
                  </div>
                  <p className="text-xs text-neutral-300 pl-4 border-l-2 border-emerald-500/60 leading-relaxed">
                    <strong>Reality:</strong> Code is read 10x more often than it is written. Two small, named, well-tested regexes are infinitely better than one giant unmaintainable monstrosity that nobody on your team dares to touch.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE DEMYSTIFIER CARD (The 30-Second "Aha!" Moment) */}
        {/* ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-neutral-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The 30-Second Demystifier (Try It Right Now)</span>
              </span>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                See how a pattern that looks like alien hieroglyphs actually breaks down into pure common sense.
              </p>
            </div>
            <div className="font-mono text-xs px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-400 font-bold self-start sm:self-auto">
              /^user_[a-z0-9]&#123;3,8&#125;$/
            </div>
          </div>

          {/* Breakdown block */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/30 text-blue-300">
              <span className="block font-bold text-sm">^</span>
              <span className="text-[10px] text-neutral-400">Start of text</span>
            </div>
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
              <span className="block font-bold text-sm">user_</span>
              <span className="text-[10px] text-neutral-400">Literal prefix</span>
            </div>
            <div className="p-2 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-300">
              <span className="block font-bold text-sm">[a-z0-9]</span>
              <span className="text-[10px] text-neutral-400">Letters or digits</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300">
              <span className="block font-bold text-sm">&#123;3,8&#125;</span>
              <span className="text-[10px] text-neutral-400">3 to 8 of them</span>
            </div>
            <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/30 text-blue-300 col-span-2 sm:col-span-1">
              <span className="block font-bold text-sm">$</span>
              <span className="text-[10px] text-neutral-400">End of text</span>
            </div>
          </div>

          {/* Interactive tester bar */}
          <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-neutral-950/80 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="intro-demo-input" className="text-xs font-semibold text-neutral-400">
                Type any sample string to test against the rule:
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-neutral-500">Quick test:</span>
                {['user_alex99', 'user_42', 'guest_alex', 'user_toolongusername'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      sounds.playClick();
                      setDemoInput(sample);
                    }}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                      demoInput === sample
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : isDark
                        ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="intro-demo-input"
                type="text"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                placeholder="type e.g. user_dev..."
                className={`flex-1 px-3.5 py-2 rounded-xl font-mono text-sm border focus:outline-none transition-all ${
                  isDemoMatch
                    ? 'border-emerald-500 bg-emerald-950/15 text-emerald-300 focus:ring-1 focus:ring-emerald-500/30'
                    : 'border-rose-500 bg-rose-950/15 text-rose-300 focus:ring-1 focus:ring-rose-500/30'
                }`}
              />

              <div
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 select-none ${
                  isDemoMatch
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isDemoMatch ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                <span>{isDemoMatch ? 'MATCHES' : 'REJECTED'}</span>
              </div>
            </div>

            <div className={`text-xs flex items-center gap-1.5 ${isDemoMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className="font-semibold">{isDemoMatch ? 'Engine says:' : 'Why it failed:'}</span>
              <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{demoVerdict.reason}</span>
            </div>
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
            id="arena-card-learn"
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
              12 progressive, step-by-step interactive lessons. Each trial gives you real-time verdicts on positive and negative test cases with hints and solutions.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>The Basics Block</span>
              <span>12 Lessons</span>
            </div>
          </div>

          {/* Card 2: Translate */}
          <div
            id="arena-card-translate"
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
              Paste any cryptic regex from a library or PR. It decomposes into an interactive chain of LEGO-style token pills and plain-English narrative.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-blue-400">
              <span>Instant Deconstruction</span>
              <span>8 Presets</span>
            </div>
          </div>

          {/* Card 3: Playground */}
          <div
            id="arena-card-playground"
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
