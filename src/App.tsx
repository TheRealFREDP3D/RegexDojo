/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppMode } from './types';
import { BASICS_LESSONS } from './data/lessons';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { IntroView } from './components/IntroView';
import { LearnView } from './components/LearnView';
import { TranslateView } from './components/TranslateView';
import { PlaygroundView } from './components/PlaygroundView';
import { CheatSheetModal } from './components/CheatSheetModal';
import { sounds } from './utils/sound';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('regexdojo_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
      return true; // default dark dojo theme
    } catch {
      return true;
    }
  });

  // Mode state
  const [currentMode, setCurrentMode] = useState<AppMode>(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#regex=')) {
        return 'playground';
      }
      const saved = localStorage.getItem('regexdojo_active_mode');
      if (saved === 'learn' || saved === 'translate' || saved === 'playground' || saved === 'intro') {
        return saved;
      }
      return 'intro';
    } catch {
      return 'intro';
    }
  });

  // Selected Lesson state (1..12)
  const [selectedLessonId, setSelectedLessonId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('regexdojo_active_lesson');
      if (saved) {
        const id = parseInt(saved, 10);
        if (id >= 1 && id <= BASICS_LESSONS.length) return id;
      }
      return 1;
    } catch {
      return 1;
    }
  });

  // Completed Lessons list
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('regexdojo_completed_lessons');
      if (saved) {
        return JSON.parse(saved);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Cheat Sheet Modal state
  const [cheatSheetOpen, setCheatSheetOpen] = useState<boolean>(false);

  // Cross-mode state transfer
  const [playgroundPatternOverride, setPlaygroundPatternOverride] = useState<string | undefined>();
  const [playgroundFlagsOverride, setPlaygroundFlagsOverride] = useState<string | undefined>();

  // Toggle Theme handler
  const handleToggleTheme = useCallback(() => {
    sounds.playClick();
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('regexdojo_theme', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Update root html/body classes based on theme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add('dark');
      body.className = 'dark text-[#e9e6e8] min-h-screen antialiased selection:bg-[#ff4f63]/35 selection:text-[#ffb3bc]';
    } else {
      root.classList.remove('dark');
      body.className = 'text-[#1d1a1c] min-h-screen antialiased selection:bg-[#c8142c]/25 selection:text-[#9e0b1f]';
    }
  }, [isDark]);

  // Mode change handler
  const handleSelectMode = useCallback((mode: AppMode) => {
    sounds.playClick();
    setCurrentMode(mode);
    try {
      localStorage.setItem('regexdojo_active_mode', mode);
    } catch {
      // ignore
    }
  }, []);

  // Lesson select handler
  const handleSelectLesson = useCallback((id: number) => {
    sounds.playClick();
    setSelectedLessonId(id);
    try {
      localStorage.setItem('regexdojo_active_lesson', String(id));
    } catch {
      // ignore
    }
  }, []);

  // Mark lesson as completed
  const handleMarkLessonCompleted = useCallback((id: number) => {
    setCompletedLessonIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('regexdojo_completed_lessons', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Transition from Translate to Playground
  const handleSendToPlayground = useCallback((pat: string, fl: string) => {
    setPlaygroundPatternOverride(pat);
    setPlaygroundFlagsOverride(fl);
    setCurrentMode('playground');
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        if (e.key === 'Escape') {
          setCheatSheetOpen(false);
        }
        return;
      }

      if (e.key === '?' || (e.key === 'h' && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        setCheatSheetOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCheatSheetOpen(false);
      } else if (e.key === '1' && !e.metaKey && !e.ctrlKey) {
        handleSelectMode('intro');
      } else if (e.key === '2' && !e.metaKey && !e.ctrlKey) {
        handleSelectMode('learn');
      } else if (e.key === '3' && !e.metaKey && !e.ctrlKey) {
        handleSelectMode('translate');
      } else if (e.key === '4' && !e.metaKey && !e.ctrlKey) {
        handleSelectMode('playground');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectMode]);

  return (
    <div className="relative flex flex-col min-h-screen pb-16 md:pb-0 overflow-x-hidden bg-[#09070c] text-neutral-100 selection:bg-rose-500/40 selection:text-rose-100">
      {/* Ambient Ember-Glazz Glows & Glass Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-rose-600/12 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full bg-amber-600/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/4 w-[36rem] h-[36rem] rounded-full bg-red-700/10 blur-[150px]" />
        {/* Subtle glass grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          completedLessonIds={completedLessonIds}
          totalLessons={BASICS_LESSONS.length}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenCheatSheet={() => {
            sounds.playClick();
            setCheatSheetOpen(true);
          }}
        />

        {/* Main View Area */}
        <main className="flex-1">
        {currentMode === 'intro' && (
          <IntroView
            onSelectMode={handleSelectMode}
            onSelectLesson={handleSelectLesson}
            completedLessonCount={completedLessonIds.length}
            totalLessons={BASICS_LESSONS.length}
            isDark={isDark}
          />
        )}

        {currentMode === 'learn' && (
          <LearnView
            selectedLessonId={selectedLessonId}
            onSelectLesson={handleSelectLesson}
            completedLessonIds={completedLessonIds}
            onMarkLessonCompleted={handleMarkLessonCompleted}
            isDark={isDark}
          />
        )}

        {currentMode === 'translate' && (
          <TranslateView
            onSendToPlayground={handleSendToPlayground}
            isDark={isDark}
          />
        )}

        {currentMode === 'playground' && (
          <PlaygroundView
            initialPattern={playgroundPatternOverride}
            initialFlags={playgroundFlagsOverride}
            isDark={isDark}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation & Footer */}
      <Footer
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        isDark={isDark}
        onOpenCheatSheet={() => {
          sounds.playClick();
          setCheatSheetOpen(true);
        }}
        completedCount={completedLessonIds.length}
      />

      {/* Quick Reference Modal */}
      <CheatSheetModal
        isOpen={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
        isDark={isDark}
      />
      </div>
    </div>
  );
}
