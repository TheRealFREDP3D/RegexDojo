import React, { useState, useEffect, useMemo } from 'react';
import { Lesson, TestCase } from '../types';
import { BASICS_LESSONS } from '../data/lessons';
import { TOTAL_LESSONS } from '../config/constants';
import { executeRegexMatch, buildHighlightSegments } from '../utils/matcher';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

interface LearnViewProps {
  selectedLessonId: number;
  onSelectLesson: (id: number) => void;
  completedLessonIds: number[];
  onMarkLessonCompleted: (id: number) => void;
  isDark: boolean;
}

const capstoneLesson = BASICS_LESSONS[BASICS_LESSONS.length - 1];

export const LearnView: React.FC<LearnViewProps> = ({
  selectedLessonId,
  onSelectLesson,
  completedLessonIds,
  onMarkLessonCompleted,
  isDark
}) => {
  const currentLesson: Lesson = useMemo(() => {
    return BASICS_LESSONS.find((l) => l.id === selectedLessonId) || BASICS_LESSONS[0];
  }, [selectedLessonId]);

  const currentIndex = useMemo(() => {
    return BASICS_LESSONS.findIndex((l) => l.id === currentLesson.id);
  }, [currentLesson.id]);
  const currentNumber = currentIndex + 1;
  const isCapstone = currentLesson.isCapstone === true || currentLesson.id === capstoneLesson.id;
  const progressPct = TOTAL_LESSONS > 0 ? Math.round((completedLessonIds.length / TOTAL_LESSONS) * 100) : 0;

  // User input state
  const [userPattern, setUserPattern] = useState<string>('');
  const [userFlags, setUserFlags] = useState<string>(currentLesson.flags || 'g');
  const [attempts, setAttempts] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [previousPattern, setPreviousPattern] = useState<string>('');

  // Sync state on lesson change
  useEffect(() => {
    setUserPattern('');
    setUserFlags(currentLesson.flags || '');
    setAttempts(0);
    setShowHint(false);
    setShowSolution(false);
    setHasCelebrated(false);
    setPreviousPattern('');
  }, [currentLesson.id]);

  // Evaluate test cases in real-time
  const testResults = useMemo(() => {
    if (!userPattern) {
      return currentLesson.testCases.map((tc) => ({
        testCase: tc,
        passed: false,
        matches: [],
        segments: [{ text: tc.text, isMatch: false }],
        hasExecuted: false
      }));
    }

    return currentLesson.testCases.map((tc) => {
      const exec = executeRegexMatch(userPattern, userFlags, tc.text);
      const isMatched = exec.isValid && exec.totalMatches > 0;
      const passed = isMatched === tc.shouldMatch;
      const segments = buildHighlightSegments(tc.text, exec.matches);

      return {
        testCase: tc,
        passed,
        matches: exec.matches,
        segments,
        hasExecuted: exec.isValid
      };
    });
  }, [userPattern, userFlags, currentLesson.testCases]);

  const allPassed = useMemo(() => {
    if (!userPattern) return false;
    return testResults.every((r) => r.passed);
  }, [userPattern, testResults]);

  // Progressive hint and solution gating
  const hintThreshold = 3; // Show hint after 3 failed attempts
  const solutionThreshold = 6; // Show solution after 6 failed attempts
  const canShowHint = attempts >= hintThreshold;
  const canShowSolution = attempts >= solutionThreshold;

  // Handle user input change
  const handlePatternChange = (val: string) => {
    setUserPattern(val);
    // Increment attempts when user makes a meaningful change (not just backspacing to empty)
    if (val.length > 0 && val !== previousPattern) {
      setAttempts(prev => prev + 1);
      setPreviousPattern(val);
    }
  };

  // Trigger celebration on pass
  useEffect(() => {
    if (allPassed && !hasCelebrated) {
      setHasCelebrated(true);
      onMarkLessonCompleted(currentLesson.id);

      if (isCapstone) {
        sounds.playMasterFanfare();
        if (!PREFERS_REDUCED_MOTION) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      } else {
        sounds.playPassChime();
        if (!PREFERS_REDUCED_MOTION) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }
    }
  }, [allPassed, hasCelebrated, currentLesson.id, isCapstone, onMarkLessonCompleted]);

  const handleNextLesson = () => {
    sounds.playClick();
    const next = BASICS_LESSONS[currentIndex + 1];
    if (next) {
      onSelectLesson(next.id);
    }
  };

  const handlePrevLesson = () => {
    sounds.playClick();
    const prev = BASICS_LESSONS[currentIndex - 1];
    if (prev) {
      onSelectLesson(prev.id);
    }
  };

  const handleApplySolution = () => {
    sounds.playClick();
    setUserPattern(currentLesson.solution);
    setShowSolution(true);
    setPreviousPattern(currentLesson.solution);
  };

  const handleReset = () => {
    sounds.playClick();
    setUserPattern('');
    setAttempts(0);
    setShowHint(false);
    setShowSolution(false);
    setHasCelebrated(false);
    setPreviousPattern('');
  };

  return (
    <div id="learn-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar: Lesson Title & Navigation controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-rose-500/20">
<div className="flex items-center gap-3">
            <button
              id="toggle-lesson-sidebar-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3.5 py-1.5 rounded-lg border border-rose-500/30 bg-black/40 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-neutral-200"
            >
              <span>Lesson {currentNumber} of {TOTAL_LESSONS}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform text-rose-400 ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>

            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_8px_rgba(255,79,99,0.2)]">
              {currentLesson.beltTier}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-rose-400 font-bold">
              <span>Dojo Progress</span>
              <span>{completedLessonIds.length}/{TOTAL_LESSONS}</span>
              <span className="text-neutral-500">({progressPct}%)</span>
            </div>
            <div
              id="learn-progress-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
              className="w-32 sm:w-44 h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

        {/* Next / Previous stepper */}
        <div className="flex items-center gap-2">
          <button
            id="prev-lesson-btn"
            onClick={handlePrevLesson}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg border border-white/10 bg-black/40 text-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 hover:bg-white/10 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-xs font-mono px-2 text-rose-400 font-bold">
            {completedLessonIds.length} / {BASICS_LESSONS.length} solved
          </div>

          <button
            id="next-lesson-btn"
            onClick={handleNextLesson}
            disabled={currentIndex === BASICS_LESSONS.length - 1}
            className="p-2 rounded-lg border border-white/10 bg-black/40 text-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-300 hover:bg-white/10 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Collapsible Lesson Drawer/Selector */}
      {sidebarOpen && (
        <div
          id="lessons-selector-drawer"
          className="p-4 rounded-2xl glazz-panel border border-rose-500/30 transition-all animate-fade-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 shadow-2xl"
        >
          {BASICS_LESSONS.map((lesson, idx) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isSelected = lesson.id === currentLesson.id;
            return (
              <button
                key={lesson.id}
                id={`select-lesson-${lesson.id}`}
                onClick={() => {
                  onSelectLesson(lesson.id);
                  setSidebarOpen(false);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/20 text-rose-300 font-semibold shadow-[0_0_12px_rgba(255,79,99,0.3)]'
                    : isCompleted
                    ? 'border-rose-500/30 bg-black/40 text-neutral-200 hover:border-rose-500/60'
                    : 'border-white/5 bg-black/30 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="text-[11px] font-mono text-rose-400/80">Lesson {idx + 1}</div>
                  <div className="text-xs font-medium truncate max-w-[150px]">{lesson.title}</div>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Lesson Split Layout: Left Theory & Right Interactive Exercise */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Theory & Pedagogy (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl glazz-panel space-y-4">
            <div>
              <span className="text-xs font-mono text-rose-400 font-bold tracking-wide uppercase">
                {currentLesson.beltTier}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1 heading-bar-h2">
                Lesson {currentNumber}: {currentLesson.title}
              </h2>
              <p className="text-xs italic mt-2 text-neutral-400">
                {currentLesson.subtitle}
              </p>
            </div>

            {/* Theory Paragraphs */}
            <div className="space-y-3 text-sm leading-relaxed text-neutral-300">
              {currentLesson.theory.map((para, idx) => (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Pro-Tip Box */}
            {currentLesson.tip && (
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs space-y-1 text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Info className="w-3.5 h-3.5" />
                  <span>Dojo Sensei Tip</span>
                </div>
                <p className="leading-relaxed">{currentLesson.tip}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Exercise & Interactive Tester (7 columns) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Exercise Prompt Box */}
          <div className="p-5 rounded-2xl glazz-panel space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">The Trial</span>
                <h3 className="text-base font-bold tracking-tight mt-1 heading-bar-h3">
                  {currentLesson.exercisePrompt}
                </h3>
              </div>
              <button
                id="reset-exercise-btn"
                onClick={handleReset}
                title="Reset input"
                className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Pattern Input Bar */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 flex items-center justify-between">
                <span>Enter Your Regex Pattern:</span>
                <span className="font-mono text-[11px] text-neutral-500">Flags: /{userFlags}/</span>
              </label>

              <div
                className={`flex items-center px-3 py-2.5 rounded-xl border font-mono text-sm transition-all ${
                  allPassed
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/30 shadow-[0_0_16px_rgba(255,79,99,0.25)]'
                    : 'border-rose-500/40 bg-black/60 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-500/25'
                }`}
              >
                <span className="text-rose-500 font-bold select-none text-base">/</span>
                <input
                  id="lesson-regex-input"
                  type="text"
                  value={userPattern}
                  onChange={(e) => handlePatternChange(e.target.value)}
                  placeholder="type pattern here..."
                  autoComplete="off"
                  spellCheck="false"
                  className="flex-1 bg-transparent px-2 font-mono text-sm text-rose-300 focus:outline-none placeholder:text-neutral-600"
                />
                <span className="text-rose-500 font-bold select-none text-base">/</span>
                <input
                  id="lesson-regex-flags"
                  type="text"
                  value={userFlags}
                  onChange={(e) => setUserFlags(e.target.value)}
                  placeholder="flags"
                  className="w-8 text-neutral-400 font-mono text-xs bg-transparent focus:outline-none text-center"
                />
              </div>
            </div>

            {/* Helper actions: Hint & Solution */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  id="toggle-hint-btn"
                  onClick={() => canShowHint && setShowHint(!showHint)}
                  disabled={!canShowHint && !showHint}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showHint
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(217,164,65,0.3)] cursor-pointer'
                      : canShowHint
                      ? 'border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/5 cursor-pointer'
                      : 'border-white/5 text-neutral-600 cursor-not-allowed opacity-50'
                  }`}
                  title={canShowHint ? 'Click to show hint' : `Hint available after ${hintThreshold} attempts (${attempts}/${hintThreshold})`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : canShowHint ? 'Need a Hint?' : `Hint (${attempts}/${hintThreshold})`}</span>
                </button>

                <button
                  id="toggle-solution-btn"
                  onClick={() => showSolution ? setShowSolution(false) : handleApplySolution()}
                  disabled={!canShowSolution && !showSolution}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showSolution
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(255,79,99,0.3)] cursor-pointer'
                      : canShowSolution
                      ? 'border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/5 cursor-pointer'
                      : 'border-white/5 text-neutral-600 cursor-not-allowed opacity-50'
                  }`}
                  title={canShowSolution ? 'Click to show solution' : `Solution available after ${solutionThreshold} attempts (${attempts}/${solutionThreshold})`}
                >
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span>{showSolution ? 'Hide Solution' : canShowSolution ? 'Show Solution' : `Solution (${attempts}/${solutionThreshold})`}</span>
                </button>
              </div>

              <div className="text-xs font-mono text-rose-400">
                {testResults.filter((r) => r.passed).length} / {currentLesson.testCases.length} Tests Passing
              </div>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div
                id="lesson-hint-box"
                className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-200 text-xs leading-relaxed animate-fade-in"
              >
                <span className="font-bold text-amber-300">Hint: </span>
                {currentLesson.hint}
              </div>
            )}

            {/* Solution Display */}
            {showSolution && canShowSolution && (
              <div
                id="lesson-solution-box"
                className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs font-mono flex items-center justify-between animate-fade-in"
              >
                <span>Solution: <code className="font-bold text-rose-300 crimson-terminal-code px-1.5 py-0.5 rounded">/{currentLesson.solution}/</code></span>
                <span className="text-[11px] text-neutral-400">No shame in learning. Try modifying it!</span>
              </div>
            )}
          </div>

          {/* Test Cases List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400/80">
              Test Cases ({testResults.length})
            </h4>

            <div className="space-y-2.5">
              {testResults.map((tr, idx) => {
                const { testCase, passed, segments } = tr;
                return (
                  <div
                    key={testCase.id}
                    id={`test-case-row-${idx}`}
                    className={`p-3.5 rounded-xl border transition-all ${
                      passed
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_12px_rgba(255,79,99,0.1)]'
                        : 'glazz-card border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            testCase.shouldMatch
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-black/60 text-neutral-400 border border-white/10'
                          }`}
                        >
                          {testCase.shouldMatch ? 'Must Match' : 'Must NOT Match'}
                        </span>
                        <span className="text-xs text-neutral-300">
                          {testCase.explanation}
                        </span>
                      </div>

                      {/* Verdict Badge */}
                      <div className="shrink-0">
                        {passed ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-rose-400 text-glow-crimson">
                            <CheckCircle2 className="w-4 h-4 text-rose-400" />
                            <span className="hidden sm:inline">PASS</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                            <XCircle className="w-4 h-4 text-neutral-500" />
                            <span className="hidden sm:inline">FAIL</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Test string with live highlighted segments */}
                    <div className="p-2.5 rounded-lg font-mono text-xs overflow-x-auto border border-white/10 bg-black/60 text-neutral-200">
                      {segments.map((seg, sIdx) => {
                        if (seg.isMatch) {
                          return (
                            <mark
                              key={sIdx}
                              className="bg-rose-500/30 text-rose-200 px-1 py-0.5 rounded border border-rose-500/60 shadow-[0_0_8px_rgba(255,79,99,0.3)] font-bold"
                            >
                              {seg.text}
                            </mark>
                          );
                        }
                        return <span key={sIdx}>{seg.text}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Banner when all test cases pass */}
          {allPassed && (
            <div
              id="lesson-success-banner"
              className="p-5 rounded-2xl border border-rose-500/50 glazz-panel-crimson flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up shadow-2xl"
            >
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="p-2.5 rounded-xl btn-glazz-cta shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-rose-300 text-glow-crimson">
                    {isCapstone
                      ? 'All Trials Conquered!'
                      : 'Trial Conquered!'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    {isCapstone
                      ? `You have completed all ${TOTAL_LESSONS} trials of The Basics and earned the Ember Sensei rank!`
                      : 'All test conditions satisfied. Progress committed to memory.'}
                  </p>
                </div>
              </div>

              {currentIndex < BASICS_LESSONS.length - 1 && (
                <button
                  id="success-next-lesson-btn"
                  onClick={handleNextLesson}
                  className="btn-glazz-cta px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Advance to Lesson {currentNumber + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
