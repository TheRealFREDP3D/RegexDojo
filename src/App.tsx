/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, ThemeId } from './types';
import { BASICS_LESSONS } from './data/lessons';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { IntroView } from './components/IntroView';
import { LearnView } from './components/LearnView';
import { TranslateView } from './components/TranslateView';
import { PlaygroundView } from './components/PlaygroundView';
import { CheatSheetModal } from './components/CheatSheetModal';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { sounds } from './utils/sound';

export default function App() {
  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('regexdojo_theme_id');
      if (saved === 'warm-halo' || saved === 'ember-glazz') {
        return 'warm-halo';
      }
      if (saved === 'glacius' || saved === 'aether-core') {
        return 'glacius';
      }
      if (
        saved === 'nord' ||
        saved === 'dracula' ||
        saved === 'abyss' ||
        saved === 'tokyo-night'
      ) {
        return saved;
      }
      return 'warm-halo';
    } catch {
      return 'warm-halo';
    }
  });

  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);

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

  // Select Theme handler
  const handleSelectTheme = useCallback((themeId: ThemeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem('regexdojo_theme_id', themeId);
    } catch {
      // ignore
    }
  }, []);

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

  // Update root html/body classes and data-theme based on theme
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    body.setAttribute('data-theme', currentTheme);
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [isDark, currentTheme]);

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
    <div className="relative flex flex-col min-h-screen pb-16 md:pb-0 overflow-x-hidden selection:bg-rose-500/40 selection:text-rose-100">
      {/* Ambient Radial Mesh & Glass Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          completedLessonIds={completedLessonIds}
          totalLessons={BASICS_LESSONS.length}
          isDark={isDark}
          currentTheme={currentTheme}
          onOpenThemeSettings={() => {
            sounds.playClick();
            setThemeModalOpen(true);
          }}
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
        currentTheme={currentTheme}
        onOpenThemeSettings={() => {
          sounds.playClick();
          setThemeModalOpen(true);
        }}
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

      {/* Visual Theme Settings Modal */}
      <ThemeSettingsModal
        isOpen={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />
      </div>
    </div>
  );
}
