import React, { useState, useEffect, useMemo } from 'react';
import { Lesson, TestCase } from '../types';
import { BASICS_LESSONS } from '../data/lessons';
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

interface LearnViewProps {
  selectedLessonId: number;
  onSelectLesson: (id: number) => void;
  completedLessonIds: number[];
  onMarkLessonCompleted: (id: number) => void;
  isDark: boolean;
}

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

  // User input state
  const [userPattern, setUserPattern] = useState<string>('');
  const [userFlags, setUserFlags] = useState<string>(currentLesson.flags || 'g');
  const [attempts, setAttempts] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sync state on lesson change
  useEffect(() => {
    setUserPattern('');
    setUserFlags(currentLesson.flags || '');
    setAttempts(0);
    setShowHint(false);
    setShowSolution(false);
    setHasCelebrated(false);
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

  // Handle user input change
  const handlePatternChange = (val: string) => {
    setUserPattern(val);
    if (val.length > 0 && attempts === 0) {
      setAttempts(1);
    }
  };

  // Trigger celebration on pass
  useEffect(() => {
    if (allPassed && !hasCelebrated) {
      setHasCelebrated(true);
      onMarkLessonCompleted(currentLesson.id);

      if (currentLesson.id === 12) {
        sounds.playMasterFanfare();
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        sounds.playPassChime();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }
  }, [allPassed, hasCelebrated, currentLesson.id, onMarkLessonCompleted]);

  const handleNextLesson = () => {
    sounds.playClick();
    if (currentLesson.id < BASICS_LESSONS.length) {
      onSelectLesson(currentLesson.id + 1);
    }
  };

  const handlePrevLesson = () => {
    sounds.playClick();
    if (currentLesson.id > 1) {
      onSelectLesson(currentLesson.id - 1);
    }
  };

  const handleApplySolution = () => {
    sounds.playClick();
    setUserPattern(currentLesson.solution);
    setShowSolution(true);
  };

  const handleReset = () => {
    sounds.playClick();
    setUserPattern('');
    setAttempts(0);
    setShowHint(false);
    setShowSolution(false);
    setHasCelebrated(false);
  };

  return (
    <div id="learn-view-container" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar: Lesson Title & Navigation controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            id="toggle-lesson-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-200'
                : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800 shadow-xs'
            }`}
          >
            <span>Lesson {currentLesson.id} of 12</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {currentLesson.beltTier}
          </span>
        </div>

        {/* Next / Previous stepper */}
        <div className="flex items-center gap-2">
          <button
            id="prev-lesson-btn"
            onClick={handlePrevLesson}
            disabled={currentLesson.id === 1}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-xs font-mono px-2 text-neutral-400">
            {completedLessonIds.length} / {BASICS_LESSONS.length} solved
          </div>

          <button
            id="next-lesson-btn"
            onClick={handleNextLesson}
            disabled={currentLesson.id === BASICS_LESSONS.length}
            className={`p-2 rounded-lg border text-xs transition-colors flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark ? 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
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
          className={`p-4 rounded-2xl border transition-all animate-fade-in grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 ${
            isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
          }`}
        >
          {BASICS_LESSONS.map((lesson) => {
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
                className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold'
                    : isCompleted
                    ? isDark
                      ? 'border-neutral-800/80 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                    : isDark
                    ? 'border-neutral-800/40 bg-neutral-950/40 text-neutral-500 hover:text-neutral-300'
                    : 'border-neutral-200 bg-neutral-100 text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <div>
                  <div className="text-[11px] font-mono text-neutral-400">Lesson {lesson.id}</div>
                  <div className="text-xs font-medium truncate max-w-[150px]">{lesson.title.replace(/^Lesson \d+:\s*/, '')}</div>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div>
              <span className="text-xs font-mono text-emerald-500 font-bold tracking-wide uppercase">
                {currentLesson.beltTier}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                {currentLesson.title}
              </h2>
              <p className={`text-xs italic mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {currentLesson.subtitle}
              </p>
            </div>

            {/* Theory Paragraphs */}
            <div className={`space-y-3 text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              {currentLesson.theory.map((para, idx) => (
                <p key={idx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Pro-Tip Box */}
            {currentLesson.tip && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  isDark ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300' : 'bg-emerald-50/60 border-emerald-200 text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
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
          <div
            className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-neutral-900/70 border-neutral-800' : 'bg-white border-neutral-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">The Trial</span>
                <h3 className="text-base font-bold tracking-tight mt-0.5">
                  {currentLesson.exercisePrompt}
                </h3>
              </div>
              <button
                id="reset-exercise-btn"
                onClick={handleReset}
                title="Reset input"
                className={`p-2 rounded-lg border transition-colors ${
                  isDark ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                }`}
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
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20'
                    : isDark
                    ? 'border-neutral-700 bg-neutral-950 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20'
                    : 'border-neutral-300 bg-neutral-50 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20'
                }`}
              >
                <span className="text-neutral-500 font-bold select-none text-base">/</span>
                <input
                  id="lesson-regex-input"
                  type="text"
                  value={userPattern}
                  onChange={(e) => handlePatternChange(e.target.value)}
                  placeholder="type pattern here..."
                  autoComplete="off"
                  spellCheck="false"
                  className="flex-1 bg-transparent px-2 font-mono text-sm text-emerald-400 focus:outline-none placeholder:text-neutral-600"
                />
                <span className="text-neutral-500 font-bold select-none text-base">/</span>
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
                  onClick={() => setShowHint(!showHint)}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showHint
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : isDark
                      ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>

                <button
                  id="toggle-solution-btn"
                  onClick={handleApplySolution}
                  className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showSolution
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : isDark
                      ? 'border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span>Show Solution</span>
                </button>
              </div>

              <div className="text-xs font-mono text-neutral-400">
                {testResults.filter((r) => r.passed).length} / {currentLesson.testCases.length} Tests Passing
              </div>
            </div>

            {/* Hint Display */}
            {showHint && (
              <div
                id="lesson-hint-box"
                className={`p-3 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                  isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <span className="font-bold">Hint: </span>
                {currentLesson.hint}
              </div>
            )}

            {/* Solution Display */}
            {showSolution && (
              <div
                id="lesson-solution-box"
                className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between animate-fade-in ${
                  isDark ? 'bg-rose-950/20 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <span>Solution: <code className="font-bold text-rose-400">/{currentLesson.solution}/</code></span>
                <span className="text-[11px] text-neutral-400">No shame in learning. Try modifying it!</span>
              </div>
            )}
          </div>

          {/* Test Cases List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
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
                        ? isDark
                          ? 'bg-emerald-950/15 border-emerald-500/30'
                          : 'bg-emerald-50/50 border-emerald-200'
                        : isDark
                        ? 'bg-neutral-900/60 border-neutral-800'
                        : 'bg-white border-neutral-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            testCase.shouldMatch
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          }`}
                        >
                          {testCase.shouldMatch ? 'Must Match' : 'Must NOT Match'}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {testCase.explanation}
                        </span>
                      </div>

                      {/* Verdict Badge */}
                      <div className="shrink-0">
                        {passed ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline">PASS</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-medium text-rose-400">
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">FAIL</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Test string with live highlighted segments */}
                    <div
                      className={`p-2.5 rounded-lg font-mono text-xs overflow-x-auto border ${
                        isDark ? 'bg-neutral-950 border-neutral-800/80 text-neutral-200' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                      }`}
                    >
                      {segments.map((seg, sIdx) => {
                        if (seg.isMatch) {
                          return (
                            <mark
                              key={sIdx}
                              className="bg-emerald-500/30 text-emerald-200 px-0.5 rounded border-b-2 border-emerald-400 font-semibold"
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
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up ${
                isDark
                  ? 'bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border-emerald-500/40 text-neutral-100'
                  : 'bg-emerald-50 border-emerald-300 text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-400">Trial Conquered!</h4>
                  <p className="text-xs text-neutral-300">
                    {currentLesson.id === 12
                      ? 'You have completed all 12 trials of The Basics and earned the Black Belt Sensei rank!'
                      : 'All test conditions satisfied. Progress committed to memory.'}
                  </p>
                </div>
              </div>

              {currentLesson.id < BASICS_LESSONS.length && (
                <button
                  id="success-next-lesson-btn"
                  onClick={handleNextLesson}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Advance to Lesson {currentLesson.id + 1}</span>
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
