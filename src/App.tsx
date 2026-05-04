import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Papa from 'papaparse';
import { 
  LayoutDashboard, 
  Library, 
  Zap, 
  Star, 
  Search, 
  Eye,
  EyeOff,
  Volume2, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronRight, 
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  Check,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Trophy,
  TrendingUp,
  User,
  Calendar,
  Flame,
  LogOut,
  Shield,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Word, WordStatus, ProgressData, DailyLog, SRSData } from './types.ts';
import { useAuth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHEET_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQVO00rJWyGaGm_kTqfKkgkZ-hPdNBQBk4uzvrk-_NLZyYhUsu7gmFx1N10wgXYh3btjB5H9rGnNDRc/pub?gid=0&single=true&output=csv";

const LibraryIcon = ({ size = 20 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 448 512" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z"/>
  </svg>
);

const FalconLogo = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 640 640" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="currentColor" d="M544 160C544 124.7 515.3 96 480 96L160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160zM352 216C352 229.3 341.3 240 328 240L216 240C202.7 240 192 229.3 192 216C192 202.7 202.7 192 216 192L328 192C341.3 192 352 202.7 352 216zM424 296C437.3 296 448 306.7 448 320C448 333.3 437.3 344 424 344L216 344C202.7 344 192 333.3 192 320C192 306.7 202.7 296 216 296L424 296zM288 424C288 437.3 277.3 448 264 448L216 448C202.7 448 192 437.3 192 424C192 410.7 202.7 400 216 400L264 400C277.3 400 288 410.7 288 424z"/>
  </svg>
);

function LoginPage({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-500/10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-2">
            <FalconLogo size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">19questions</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Master language with precision.</p>
          </div>
          
          <button 
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 px-6 rounded-2xl font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
            <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform ml-auto text-slate-300" />
          </button>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Trusted by language learners worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ 
  vocab, 
  progress, 
  starred, 
  recentQuestions, 
  setView, 
  setSearchQuery,
  mainCategories,
  setBrowseLevel,
  setSelectedMainCategory
}: { 
  vocab: Word[]; 
  progress: ProgressData; 
  starred: Record<string, boolean>; 
  recentQuestions: string[];
  setView: (v: any) => void;
  setSearchQuery: (s: string) => void;
  mainCategories: string[];
  setBrowseLevel: (l: any) => void;
  setSelectedMainCategory: (c: string) => void;
}) {
  const [expandedMainCategory, setExpandedMainCategory] = useState<string | null>(null);

  const total = vocab.length;
  const { masteredCount, reviewCount, masteredPct } = useMemo(() => {
    const mastered = Object.values(progress).filter(s => s === 'mastered').length;
    const review = Object.values(starred).filter(Boolean).length;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { masteredCount: mastered, reviewCount: review, masteredPct: pct };
  }, [progress, starred, total]);
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const recentWords = (recentQuestions || [])
    .map(q => vocab?.find(v => v.question === q))
    .filter((v): v is Word => !!v);

  const subCategoriesForMain = useMemo(() => {
    if (!expandedMainCategory) return [];
    return Array.from(new Set(vocab.filter(v => v.mainCategory === expandedMainCategory).map(v => v.subCategory))).sort();
  }, [vocab, expandedMainCategory]);

  return (
    <div className="pb-16 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting}, <span className="text-blue-600">Student</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            You've mastered <span className="text-slate-900 dark:text-white font-bold">{masteredCount}</span> out of {total} items.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pr-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-800" />
              <circle 
                cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="125.66"
                style={{ strokeDashoffset: 125.66 - (125.66 * masteredPct) / 100 }}
                className="text-blue-500"
              />
            </svg>
            <span className="absolute text-[10px] font-black">{masteredPct}%</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Progress</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Level: {masteredPct > 80 ? 'Expert' : masteredPct > 50 ? 'Intermediate' : 'Beginner'}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Library Size" 
          value={total} 
          icon={<Library className="w-5 h-5 text-blue-500" />} 
          description="Total questions available"
        />
        <StatCard 
          title="Questions for Review" 
          value={reviewCount} 
          icon={<Star className="w-5 h-5 text-orange-500" />} 
          description="Items marked for practice"
          color="bg-white dark:bg-slate-900 border-orange-100 dark:border-orange-950"
        />
        <StatCard 
          title="Mastered Items" 
          value={masteredCount} 
          icon={<Trophy className="w-5 h-5 text-emerald-500" />} 
          description="Completed with full confidence"
          color="bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-950"
        />
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Quick Practice
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => setView('browse')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                  <BookOpen size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Browse Library</p>
                  <p className="text-[10px] text-slate-500 mt-1">Explore all {total} topics</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-all" />
            </button>

            <button 
              onClick={() => setView('quiz')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Quick Quiz</p>
                  <p className="text-[10px] text-slate-500 mt-1">Test your recall</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
            </button>

            <button 
              onClick={() => setView('proverbs')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all border border-transparent hover:border-orange-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
                  <Sparkles size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Proverbs</p>
                  <p className="text-[10px] text-slate-500 mt-1">Cultural Wisdom</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-orange-500 transition-all" />
            </button>

            <button 
              onClick={() => setView('phrases')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                  <TrendingUp size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Phrases</p>
                  <p className="text-[10px] text-slate-500 mt-1">Natives' Idioms</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-all" />
            </button>

            <button 
              onClick={() => setView('verbs')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <RotateCw size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Verbs</p>
                  <p className="text-[10px] text-slate-500 mt-1">Action Conjugations</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
            </button>

            <button 
              onClick={() => {
                setView('browse');
                setSelectedMainCategory('');
                setBrowseLevel('sub');
              }}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all border border-transparent hover:border-purple-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                  <LayoutGrid size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-none">Sub-Categories</p>
                  <p className="text-[10px] text-slate-500 mt-1">Arrange by topic</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-purple-500 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Breakdown & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              {expandedMainCategory ? "Section Mastery" : "Progress by Category"}
            </div>
            {expandedMainCategory && (
              <button 
                onClick={() => setExpandedMainCategory(null)}
                className="flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition border border-slate-200 dark:border-slate-800"
              >
                <ChevronLeft size={12} />
                Main
              </button>
            )}
          </h3>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 space-y-5 max-h-[400px] overflow-y-auto custom-scrollbar">
              {!expandedMainCategory ? (
                mainCategories.map((cat) => {
                  const catWords = vocab.filter(v => v.mainCategory === cat);
                  const masteredInCat = catWords.filter(v => progress[v.question] === 'mastered').length;
                  const pct = catWords.length > 0 ? Math.round((masteredInCat / catWords.length) * 100) : 0;
                  
                  return (
                    <div 
                      key={cat} 
                      onClick={() => setExpandedMainCategory(cat)}
                      className="space-y-2 group cursor-pointer"
                    >
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className={cn(
                             "text-sm font-bold transition-colors uppercase tracking-tight",
                             pct === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-300 group-hover:text-blue-500"
                          )}>
                            {cat}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{masteredInCat} of {catWords.length} mastered</span>
                        </div>
                        <span className={cn(
                          "text-xs font-black",
                          pct === 100 ? "text-emerald-500" : "text-blue-500"
                        )}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${pct}%` }}
                          className={cn(
                            "h-full transition-colors rounded-full",
                            pct === 100 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-blue-500 group-hover:bg-blue-600"
                          )}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-50 dark:border-slate-800 pb-3 mb-2">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <span className="text-lg font-black text-slate-800 dark:text-white leading-none capitalize">{expandedMainCategory}</span>
                  </div>
                  {subCategoriesForMain.map((sub) => {
                    const subWords = vocab.filter(v => v.mainCategory === expandedMainCategory && v.subCategory === sub);
                    const masteredInSub = subWords.filter(v => progress[v.question] === 'mastered').length;
                    const pct = subWords.length > 0 ? Math.round((masteredInSub / subWords.length) * 100) : 0;

                    return (
                      <div 
                        key={sub} 
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-end">
                          <span className={cn(
                            "text-xs font-bold transition-colors",
                            pct === 100 ? "text-emerald-500" : "text-slate-600 dark:text-slate-400"
                          )}>{sub}</span>
                          <span className={cn(
                            "text-[10px] font-black",
                            pct === 100 ? "text-emerald-500" : "text-slate-400"
                          )}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-50 dark:bg-slate-800/30 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${pct}%` }}
                            className={cn(
                               "h-full transition-all rounded-full",
                               pct === 100 ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-emerald-500" />
              Recent Study
            </div>
          </h3>
          
          <div className="space-y-3">
            {recentWords.length > 0 ? (
              recentWords.slice(0, 5).map((w, idx) => (
                <div 
                  key={w.question + idx} 
                  onClick={() => {
                    setSearchQuery(w.question);
                    setView('browse');
                  }}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-500 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">{w.category}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-200 truncate">{w.question}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-500 transform group-hover:translate-x-1 ml-4 flex-shrink-0 transition-all" />
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
                 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                   <BookOpen className="w-8 h-8 text-blue-500" />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-900 dark:text-slate-200">Start your journey</h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse the library or try a quiz to see your progress here.</p>
                 </div>
                 <button 
                   onClick={() => setView('browse')}
                   className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold transition active:scale-95 text-sm"
                 >
                   Go to Library
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizView({ vocab, triggerHapticFeedback }: { vocab: Word[]; triggerHapticFeedback: (t?: any) => void }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<{ q: Word; options: string[] }[]>([]);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const startQuiz = () => {
    const pool = vocab.length > 0 ? vocab : [];
    if (pool.length < 4) return;
    const shuff = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    const qs = shuff.map(q => {
      const others = pool.filter(p => p.question !== q.question).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...others.map(o => o.answer), q.answer].sort(() => Math.random() - 0.5);
      return { q, options };
    });
    setQuestions(qs);
    setQIdx(0);
    setScore(0);
    setQuizStarted(true);
    setAnswered(null);
    setSelectedOpt(null);
  };

  const handleAnswer = (opt: string) => {
    if (answered !== null) return;
    setSelectedOpt(opt);
    const isCorrect = opt === questions[qIdx].q.answer;
    setAnswered(isCorrect);
    if (isCorrect) setScore(s => s + 1);
  };

  if (!quizStarted) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold">Vocabulary Quiz</h2>
        <p className="text-slate-500">Test your knowledge with 10 random questions from your list.</p>
        <button 
          onClick={startQuiz}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (!questions[qIdx]) return null;

  const current = questions[qIdx];
  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-8">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-400">Question {qIdx + 1}/10</span>
        <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-green-500">Score: {score}</span>
      </div>
      <div className="h-1.5 md:h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: `${(qIdx + 1) * 10}%` }} />
      </div>
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-2 md:space-y-4 relative bg-white dark:bg-slate-900/50 p-6 md:p-10 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-200/50 dark:shadow-none min-h-[160px] md:min-h-[240px] flex flex-col justify-center">
          <button 
            onClick={() => {
              if (triggerHapticFeedback) triggerHapticFeedback('light');
              window.open(`https://www.google.com/search?q=${encodeURIComponent(current.q.question + ' explain in Bangla')}`, '_blank');
            }}
            className="absolute bottom-4 right-4 w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-500 transition-all active:scale-90"
            title="Search on Google"
          >
            <Search size={16} />
          </button>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">{current.q.question}</h3>
          <p className="text-slate-400 dark:text-slate-500 italic text-[11px] md:text-sm font-medium">Find the correct meaning below</p>
        </div>

        <div className="w-full lg:w-1/2 grid grid-cols-1 gap-2 md:gap-3">
          {current.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={answered !== null}
              className={cn(
                "p-4 md:p-5 text-left rounded-2xl border-2 transition-all font-black text-sm md:text-lg flex items-center justify-between",
                answered === null && "border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:bg-blue-50/30 dark:hover:bg-blue-500/5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300",
                answered !== null && opt === current.q.answer && "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20",
                answered === false && opt === selectedOpt && opt !== current.q.answer && "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20",
                answered !== null && opt !== current.q.answer && opt !== selectedOpt && "opacity-50 border-slate-100 dark:border-slate-800"
              )}
            >
              <span>{opt}</span>
              {answered !== null && opt === current.q.answer && <Check className="w-5 h-5" />}
              {answered === false && opt === selectedOpt && opt !== current.q.answer && <X className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>

      {answered !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 md:pt-4"
        >
          <button 
            onClick={() => {
              if (triggerHapticFeedback) triggerHapticFeedback('medium');
              if (qIdx < questions.length - 1) {
                setQIdx(i => i + 1);
                setAnswered(null);
                setSelectedOpt(null);
              } else {
                setQuizStarted(false);
                setQuestions([]);
              }
            }}
            className="w-full py-4 md:py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black shadow-xl transition active:scale-[0.98] flex items-center justify-center gap-2 hover:opacity-90"
          >
            {qIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

function PhrasesView({ 
  vocab, 
  phraseIdx, 
  setPhraseIdx, 
  speak, 
  starred, 
  toggleStarred, 
  triggerHapticFeedback, 
  autoRead,
  searchChatGPT
}: { 
  vocab: Word[];
  phraseIdx: number;
  setPhraseIdx: (v: any) => void;
  speak: (t: string, c?: boolean) => void;
  starred: Record<string, boolean>;
  toggleStarred: (id: string) => void;
  triggerHapticFeedback: (t?: any) => void;
  autoRead: boolean;
  searchChatGPT: (q: string) => void;
}) {
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showExampleMobile, setShowExampleMobile] = useState(false);
  
  const phrasePool = useMemo(() => {
    const base = vocab.filter(v => v.phraseEn && v.phraseMeaningEn);
    if (showSavedOnly) {
      return base.filter(v => starred[v.question]);
    }
    return base;
  }, [vocab, showSavedOnly, starred]);
  
  useEffect(() => {
    if (phrasePool.length > 0 && phraseIdx >= phrasePool.length) {
      setPhraseIdx(0);
    }
  }, [phrasePool, phraseIdx, setPhraseIdx]);

  const current = phrasePool[phraseIdx];

  const lastSpokenRef = useRef<number>(-1);
  useEffect(() => {
    let t1: any;
    if (!autoRead) {
      lastSpokenRef.current = -1;
      return;
    }
    
    if (current && lastSpokenRef.current !== phraseIdx) {
      lastSpokenRef.current = phraseIdx;
      window.speechSynthesis.cancel();
      
      t1 = setTimeout(() => {
        speak(current.phraseEn, true);
      }, 400);
    }

    return () => {
      clearTimeout(t1);
      window.speechSynthesis.cancel();
    };
  }, [phraseIdx, autoRead, speak, current]);

  if (phrasePool.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
      <TrendingUp size={48} className="text-slate-300" />
      <p className="text-sm font-bold">No phrases found in the current library.</p>
    </div>
  );

  const progressPct = ((phraseIdx + 1) / phrasePool.length) * 100;

  const next = useCallback(() => setPhraseIdx((prev: number) => (prev + 1) % phrasePool.length), [phrasePool.length, setPhraseIdx]);
  const prev = useCallback(() => setPhraseIdx((prev: number) => (prev - 1 + phrasePool.length) % phrasePool.length), [phrasePool.length, setPhraseIdx]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 md:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Idiom Master</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">Phrases & Idioms</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium pt-1">Learn to speak like a native.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <button 
             onClick={() => {
               triggerHapticFeedback('light');
               setShowSavedOnly(!showSavedOnly);
               setPhraseIdx(0);
             }}
             className={cn(
               "h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
               showSavedOnly 
                 ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" 
                 : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-500"
             )}
           >
             <Star size={14} fill={showSavedOnly ? "white" : "none"} />
             <span>{showSavedOnly ? "Saved Only" : "All Items"}</span>
           </button>

           <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

           <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Progress</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{phraseIdx + 1}/{phrasePool.length}</p>
              </div>
              <div className="w-10 h-10 relative flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                   <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-800" />
                   <circle 
                     cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100.53"
                     style={{ strokeDashoffset: 100.53 - (100.53 * progressPct) / 100 }}
                     className="text-indigo-500 transition-all duration-500"
                   />
                 </svg>
                 <span className="absolute text-[8px] font-black">{Math.round(progressPct)}%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={phraseIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) { triggerHapticFeedback('light'); next(); }
              else if (info.offset.x > 100) { triggerHapticFeedback('light'); prev(); }
            }}
            className="relative bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 overflow-hidden cursor-auto touch-none flex flex-col md:flex-row md:min-h-[440px] select-text"
          >
              {/* Mobile Only Pronunciation Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); speak(current.phraseEn); }}
                className="md:hidden absolute top-6 right-6 z-30 w-10 h-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm active:scale-95 transition-all"
                title="Pronounce"
              >
                <Volume2 size={18} />
              </button>

              {/* Left Side: Primary Focus */}
              <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:border-r border-slate-50 dark:border-slate-800 pointer-events-auto">
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center gap-2 select-none">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-800/50">
                      {current.phrasePos || 'Expression'}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight selection:bg-indigo-100 dark:selection:bg-indigo-500/30">
                    {current.phraseEn}
                  </h2>

                  <div className="pt-2 select-none hidden md:block">
                    <button 
                      onClick={(e) => { e.stopPropagation(); speak(current.phraseEn); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all active:scale-95"
                    >
                      <Volume2 size={16} /> Pronounce
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Detailed Info */}
              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/30 p-8 md:p-12 flex flex-col justify-center space-y-6 md:space-y-8 pointer-events-auto">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">English Meaning</p>
                    <p className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-300 leading-snug selection:bg-indigo-100">
                      {current.phraseMeaningEn || "No definition available."}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 select-none">Bengali Meaning</p>
                    <p className="font-bengali text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-tight selection:bg-indigo-100">
                      {current.phraseMeaningBn || "অর্থ পাওয়া যায়নি"}
                    </p>
                  </div>

                  {(current.phraseExEn || current.phraseExBn) && (
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowExampleMobile(!showExampleMobile)}
                        className="md:hidden w-full p-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
                      >
                        {showExampleMobile ? (
                          <>Hide Example <ChevronUp size={14} /></>
                        ) : (
                          <>Show Example <ChevronDown size={14} /></>
                        )}
                      </button>

                      <AnimatePresence>
                        {(showExampleMobile || window.innerWidth >= 768) && (
                          <motion.div 
                            initial={window.innerWidth < 768 ? { height: 0, opacity: 0 } : false}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden md:!h-auto md:!opacity-100"
                          >
                            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 mt-4 md:mt-0">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 select-none">Example Sentence</p>
                              <div className="space-y-2">
                                {current.phraseExEn && (
                                  <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed selection:bg-indigo-100">
                                    "{current.phraseExEn}"
                                  </p>
                                )}
                                {current.phraseExBn && (
                                  <p className="font-bengali text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-2 selection:bg-indigo-100">
                                    {current.phraseExBn}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-3 select-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(current.question);
                    }}
                    className={cn(
                      "flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                      starred[current.question] 
                        ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30" 
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-yellow-500 hover:text-yellow-600"
                    )}
                  >
                    <Star size={16} fill={starred[current.question] ? "white" : "none"} />
                    {starred[current.question] ? 'Saved' : 'Save'}
                  </button>

                  <button 
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`"${current.phraseEn}" meaning en & bn with examples`)}`, '_blank')}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-500 transition-all shadow-sm"
                    title="Search on Google"
                  >
                    <Search size={18} />
                  </button>
                  
                  <button 
                    onClick={() => searchChatGPT(`${current.phraseEn} (${current.phrasePos}) - show 3 simple usage examples in English with Bengali translations.`)}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                    title="Deep Dive with AI"
                  >
                    <Sparkles size={18} />
                  </button>
                </div>
              </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons (Desktop) */}
        <div className="absolute top-1/2 -left-16 -translate-y-1/2 hidden lg:block">
          <button onClick={prev} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xl text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-90">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 hidden lg:block">
          <button onClick={next} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xl text-slate-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-90">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Swipe Hint (Mobile) */}
      <div className="md:hidden flex justify-center pb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 flex items-center gap-2">
          <ArrowLeft size={10} /> Swipe to Navigate <ArrowRight size={10} />
        </p>
      </div>
    </div>
  );
}

function ProverbsView({ 
  vocab, 
  proverbIdx, 
  setProverbIdx, 
  speak, 
  starred, 
  toggleStarred, 
  triggerHapticFeedback, 
  autoRead,
  searchChatGPT
}: { 
  vocab: Word[];
  proverbIdx: number;
  setProverbIdx: (v: any) => void;
  speak: (t: string, c?: boolean) => void;
  starred: Record<string, boolean>;
  toggleStarred: (id: string) => void;
  triggerHapticFeedback: (t?: any) => void;
  autoRead: boolean;
  searchChatGPT: (q: string) => void;
}) {
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  
  const proverbPool = useMemo(() => {
    const base = vocab.filter(v => v.proverbEn && v.proverbBn);
    if (showSavedOnly) {
      return base.filter(v => starred[v.question]);
    }
    return base;
  }, [vocab, showSavedOnly, starred]);
  
  useEffect(() => {
    if (proverbPool.length > 0 && proverbIdx >= proverbPool.length) {
      setProverbIdx(0);
    }
  }, [proverbPool, proverbIdx, setProverbIdx]);

  const current = proverbPool[proverbIdx];

  // Auto-pronunciation logic - Fixed with proper cleanup
  const lastSpokenRef = useRef<number>(-1);
  useEffect(() => {
    let t1: any, t2: any;
    if (!autoRead) {
      lastSpokenRef.current = -1;
      return;
    }
    
    if (current && lastSpokenRef.current !== proverbIdx) {
      lastSpokenRef.current = proverbIdx;
      window.speechSynthesis.cancel();
      
      t1 = setTimeout(() => {
        speak(current.proverbEn, true);
        t2 = setTimeout(() => {
          if (lastSpokenRef.current === proverbIdx) {
            speak(current.proverbBn, false);
          }
        }, 1500);
      }, 400);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.speechSynthesis.cancel();
    };
  }, [proverbIdx, autoRead, speak, current]);

  if (proverbPool.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
      <Sparkles size={48} className="text-slate-300" />
      <p className="text-sm font-bold">No proverbs found in the current library.</p>
    </div>
  );

  const progressPct = ((proverbIdx + 1) / proverbPool.length) * 100;

  const next = useCallback(() => setProverbIdx((prev: number) => (prev + 1) % proverbPool.length), [proverbPool.length, setProverbIdx]);
  const prev = useCallback(() => setProverbIdx((prev: number) => (prev - 1 + proverbPool.length) % proverbPool.length), [proverbPool.length, setProverbIdx]);

  // Keyboard Support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Wisdom Vault</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">Learning Proverbs</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium pt-1">Explore cultural wisdom one card at a time.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-2 md:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 md:gap-4 flex-wrap">
           <button 
             onClick={() => {
               triggerHapticFeedback('light');
               setShowSavedOnly(!showSavedOnly);
               setProverbIdx(0);
             }}
             className={cn(
               "h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
               showSavedOnly 
                 ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" 
                 : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500"
             )}
           >
             <Star size={14} fill={showSavedOnly ? "white" : "none"} />
             <span>{showSavedOnly ? "Filtered" : "Show Saved"}</span>
           </button>

           <div className="hidden sm:block w-px h-8 bg-slate-100 dark:bg-slate-800" />

           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{proverbPool.length > 0 ? proverbIdx + 1 : 0} / {proverbPool.length}</p>
           </div>
           <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="125.66"
                  style={{ strokeDashoffset: 125.66 - (125.66 * progressPct) / 100 }}
                  className="text-blue-500"
                />
              </svg>
              <span className="absolute text-[10px] font-black">{Math.round(progressPct)}%</span>
           </div>
        </div>
      </div>

      <div className="relative group min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={proverbIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) {
                triggerHapticFeedback('light');
                next();
              } else if (info.offset.x > 100) {
                triggerHapticFeedback('light');
                prev();
              }
            }}
            className="bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 p-8 md:p-12 shadow-2xl shadow-blue-500/5 flex flex-col items-center text-center space-y-6 relative overflow-hidden cursor-auto touch-none select-text"
          >
              <div className="absolute top-0 right-0 p-8 opacity-5 select-none">
                <Sparkles size={100} />
              </div>
              
              <div className="space-y-3 relative z-10 w-full">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1 select-none">Original</p>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-snug selection:bg-blue-100">
                  "{current.proverbEn}"
                </h2>
              </div>

              <div className="w-10 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full select-none" />

              <div className="space-y-3 relative z-10 w-full">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 select-none">Bengali Equivalent</p>
                <p className="font-bengali text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 selection:bg-blue-100">
                  {current.proverbBn}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 select-none">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHapticFeedback('light');
                    speak(current.proverbEn);
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm active:scale-95"
                  title="Pronounce English"
                >
                  <Volume2 size={18} />
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHapticFeedback('light');
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(current.proverbEn + ' explain in Bangla')}`, '_blank');
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm active:scale-95"
                  title="Search on Google"
                >
                  <Search size={18} />
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHapticFeedback('medium');
                    searchChatGPT(current.proverbEn + " explain in Bangla");
                  }}
                  className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  title="Explain with AI"
                >
                  <Sparkles size={18} />
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHapticFeedback('medium');
                    toggleStarred(current.question);
                  }}
                  className={cn(
                    "h-11 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2",
                    starred[current.question] 
                      ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30" 
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500"
                  )}
                >
                  <Star size={14} fill={starred[current.question] ? "white" : "none"} />
                  {starred[current.question] ? 'Saved' : 'Save'}
                </button>
              </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-1/2 -left-20 -translate-y-1/2 hidden lg:block">
          <button 
            onClick={prev}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg text-slate-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 hidden lg:block">
          <button 
            onClick={next}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-lg text-slate-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>



      <div className="text-center">
         <button 
           onClick={() => setProverbIdx(Math.floor(Math.random() * proverbPool.length))}
           className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all"
         >
           Surprise Me (Random)
         </button>
      </div>
    </div>
  );
}

function VerbsView({ 
  vocab, 
  verbIdx, 
  setVerbIdx, 
  speak, 
  starred, 
  toggleStarred, 
  triggerHapticFeedback, 
  autoRead,
  searchChatGPT
}: { 
  vocab: Word[];
  verbIdx: number;
  setVerbIdx: (v: any) => void;
  speak: (t: string, c?: boolean) => void;
  starred: Record<string, boolean>;
  toggleStarred: (id: string) => void;
  triggerHapticFeedback: (t?: any) => void;
  autoRead: boolean;
  searchChatGPT: (q: string) => void;
}) {
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showExampleMobile, setShowExampleMobile] = useState(false);
  
  const verbPool = useMemo(() => {
    const base = vocab.filter(v => v.verbEn && v.verbMeaningBn);
    if (showSavedOnly) {
      return base.filter(v => starred[v.question]);
    }
    return base;
  }, [vocab, showSavedOnly, starred]);
  
  useEffect(() => {
    if (verbPool.length > 0 && verbIdx >= verbPool.length) {
      setVerbIdx(0);
    }
  }, [verbPool, verbIdx, setVerbIdx]);

  const current = verbPool[verbIdx];

  const lastSpokenRef = useRef<number>(-1);
  useEffect(() => {
    let t1: any;
    if (!autoRead) {
      lastSpokenRef.current = -1;
      return;
    }
    
    if (current && lastSpokenRef.current !== verbIdx) {
      lastSpokenRef.current = verbIdx;
      window.speechSynthesis.cancel();
      
      t1 = setTimeout(() => {
        speak(current.verbEn, true);
      }, 400);
    }

    return () => {
      clearTimeout(t1);
      window.speechSynthesis.cancel();
    };
  }, [verbIdx, autoRead, speak, current]);

  if (verbPool.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
      <RotateCw size={48} className="text-slate-300" />
      <p className="text-sm font-bold">No verbs found in the current library.</p>
    </div>
  );

  const progressPct = ((verbIdx + 1) / verbPool.length) * 100;

  const next = useCallback(() => setVerbIdx((prev: number) => (prev + 1) % verbPool.length), [verbPool.length, setVerbIdx]);
  const prev = useCallback(() => setVerbIdx((prev: number) => (prev - 1 + verbPool.length) % verbPool.length), [verbPool.length, setVerbIdx]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4 md:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <RotateCw size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Action Words</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-none">Verbs & Actions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium pt-1">Master conjugation and usage.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
           <button 
             onClick={() => {
               triggerHapticFeedback('light');
               setShowSavedOnly(!showSavedOnly);
               setVerbIdx(0);
             }}
             className={cn(
               "h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
               showSavedOnly 
                 ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" 
                 : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500"
             )}
           >
             <Star size={14} fill={showSavedOnly ? "white" : "none"} />
             <span>{showSavedOnly ? "Saved Only" : "All Verbs"}</span>
           </button>

           <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

           <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Progress</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{verbIdx + 1}/{verbPool.length}</p>
              </div>
              <div className="w-10 h-10 relative flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                   <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-800" />
                   <circle 
                     cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100.53"
                     style={{ strokeDashoffset: 100.53 - (100.53 * progressPct) / 100 }}
                     className="text-emerald-500 transition-all duration-500"
                   />
                 </svg>
                 <span className="absolute text-[8px] font-black">{Math.round(progressPct)}%</span>
              </div>
           </div>
        </div>
      </div>

      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={verbIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) { triggerHapticFeedback('light'); next(); }
              else if (info.offset.x > 100) { triggerHapticFeedback('light'); prev(); }
            }}
            className="relative bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-2xl shadow-emerald-500/5 overflow-hidden cursor-auto touch-none flex flex-col md:flex-row md:min-h-[440px] select-text"
          >
              <button 
                onClick={(e) => { e.stopPropagation(); speak(current.verbEn); }}
                className="md:hidden absolute top-6 right-6 z-30 w-10 h-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm active:scale-95 transition-all"
                title="Pronounce"
              >
                <Volume2 size={18} />
              </button>

              <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:border-r border-slate-50 dark:border-slate-800 pointer-events-auto">
                <div className="space-y-4 w-full">
                  <div className="flex items-center justify-center gap-2 select-none">
                    <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 dark:border-emerald-800/50">
                      {current.verbPron || 'Verb'}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight selection:bg-emerald-100 dark:selection:bg-emerald-500/30">
                    {current.verbEn}
                  </h2>

                  {current.verbForms && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Verb Forms</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 italic font-mono">{current.verbForms}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); speak(current.verbForms); }}
                          className="p-1 text-slate-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          title="Pronounce forms"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 select-none hidden md:block">
                    <button 
                      onClick={(e) => { e.stopPropagation(); speak(current.verbEn); }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all active:scale-95"
                    >
                      <Volume2 size={16} /> Pronounce
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/30 p-8 md:p-12 flex flex-col justify-center space-y-6 md:space-y-8 pointer-events-auto">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">Bengali Meaning</p>
                    <p className="font-bengali text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight selection:bg-emerald-100">
                      {current.verbMeaningBn || "অর্থ পাওয়া যায়নি"}
                    </p>
                  </div>

                  {(current.verbExEn || current.verbExBn) && (
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowExampleMobile(!showExampleMobile)}
                        className="md:hidden w-full p-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
                      >
                        {showExampleMobile ? (
                          <>Hide Example <ChevronUp size={14} /></>
                        ) : (
                          <>Show Example <ChevronDown size={14} /></>
                        )}
                      </button>

                      <AnimatePresence>
                        {(showExampleMobile || window.innerWidth >= 768) && (
                          <motion.div 
                            initial={window.innerWidth < 768 ? { height: 0, opacity: 0 } : false}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden md:!h-auto md:!opacity-100"
                          >
                            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 mt-4 md:mt-0">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 select-none">Example Sentence</p>
                              <div className="space-y-2">
                                {current.verbExEn && (
                                  <p className="text-lg md:text-xl font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed selection:bg-emerald-100">
                                    "{current.verbExEn}"
                                  </p>
                                )}
                                {current.verbExBn && (
                                  <p className="font-bengali text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-2 selection:bg-emerald-100">
                                    {current.verbExBn}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-3 select-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarred(current.question);
                    }}
                    className={cn(
                      "flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                      starred[current.question] 
                        ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30" 
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-yellow-500 hover:text-yellow-600"
                    )}
                  >
                    <Star size={16} fill={starred[current.question] ? "white" : "none"} />
                    {starred[current.question] ? 'Saved' : 'Save'}
                  </button>

                  <button 
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`"${current.verbEn}" meaning en & bn with examples`)}`, '_blank')}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all shadow-sm"
                    title="Search on Google"
                  >
                    <Search size={18} />
                  </button>
                  
                  <button 
                    onClick={() => searchChatGPT(`Verb: "${current.verbEn}" - explain meaning in Bengali, provide V1, V2, V3 forms, and 3 simple usage examples in English with Bengali translations.`)}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                    title="Deep Dive with AI"
                  >
                    <Sparkles size={18} />
                  </button>
                </div>
              </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-1/2 -left-16 -translate-y-1/2 hidden lg:block">
          <button onClick={prev} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xl text-slate-400 hover:text-emerald-600 transition-all hover:scale-110 active:scale-90">
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 -right-16 -translate-y-1/2 hidden lg:block">
          <button onClick={next} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-xl text-slate-400 hover:text-emerald-600 transition-all hover:scale-110 active:scale-90">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="md:hidden flex justify-center pb-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600 flex items-center gap-2">
          <ArrowLeft size={10} /> Swipe to Navigate <ArrowRight size={10} />
        </p>
      </div>

      <div className="text-center">
         <button 
           onClick={() => setVerbIdx(Math.floor(Math.random() * verbPool.length))}
           className="px-6 py-2 bg-emerald-100 dark:bg-slate-800 text-emerald-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 transition-all shadow-sm"
         >
           Random Verb
         </button>
      </div>
    </div>
  );
}

function HeaderNavItem({ 
  icon, 
  label, 
  id, 
  currentView, 
  setView 
}: { 
  icon: React.ReactNode; 
  label: string; 
  id: string; 
  currentView: string;
  setView: (v: any) => void;
}) {
  return (
    <button
      onClick={() => setView(id)}
      className={cn(
        "flex items-center gap-2 rounded-xl font-bold transition-all text-sm px-4 py-2",
        currentView === id 
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function NavItem({ 
  icon, 
  label, 
  id, 
  currentView, 
  setView, 
  setIsMobileMenuOpen 
}: { 
  icon: React.ReactNode; 
  label: string; 
  id: string; 
  currentView: string;
  setView: (v: any) => void;
  setIsMobileMenuOpen: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => {
        setView(id);
        setIsMobileMenuOpen(false);
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all w-full text-left",
        currentView === id 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <span className={cn(
        "transition-colors",
        currentView === id ? "text-white" : "text-slate-400 dark:text-slate-500"
      )}>{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}

function MobileNavItem({ 
  id, 
  icon, 
  view, 
  setView, 
  label 
}: { 
  id: string; 
  icon: React.ReactNode; 
  view: string; 
  setView: (v: any) => void;
  label?: string;
}) {
  return (
    <button 
      onClick={() => setView(id)}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-xl transition-all min-w-[64px]",
        view === id ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-slate-400 dark:text-slate-600"
      )}
    >
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label || id}</span>
    </button>
  );
}

function ResetButton({ onConfirm }: { onConfirm: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className="relative">
      {showConfirm ? (
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-lg animate-in zoom-in-95 duration-200">
           <button 
             onClick={() => { onConfirm(); setShowConfirm(false); }}
             className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-red-600 transition"
           >
             Yes, Clear
           </button>
           <button 
             onClick={() => setShowConfirm(false)}
             className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-black uppercase rounded-lg hover:bg-slate-200 transition"
           >
             No
           </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:text-red-500 transition-colors text-[10px] font-black uppercase shadow-sm"
        >
          <Trash2 size={14} />
          <span>Reset Review</span>
        </button>
      )}
    </div>
  );
}

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, logout } = useAuth();
  // --- Core State ---
  const [vocab, setVocab] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dash' | 'browse' | 'flash' | 'quiz' | 'saved' | 'proverbs' | 'phrases' | 'verbs'>('browse');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [proverbIdx, setProverbIdx] = useState(() => Number(localStorage.getItem('hscProverbIdx') || '0'));
  const [phraseIdx, setPhraseIdx] = useState(() => Number(localStorage.getItem('hscPhraseIdx') || '0'));
  const [verbIdx, setVerbIdx] = useState(() => Number(localStorage.getItem('hscVerbIdx') || '0'));

  // --- Persistence ---
  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      return JSON.parse(localStorage.getItem('hscProgress') || '{}') || {};
    } catch { return {}; }
  });
  const [starred, setStarred] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('hscStarred') || '{}') || {};
    } catch { return {}; }
  });
  const [srsData, setSrsData] = useState<SRSData>(() => {
    try {
      return JSON.parse(localStorage.getItem('hscSRS') || '{}') || {};
    } catch { return {}; }
  });
  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    try {
      return JSON.parse(localStorage.getItem('hscDaily') || '{}') || {};
    } catch { return {}; }
  });
  const [recentQuestions, setRecentQuestions] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hscRecent') || '[]') || [];
    } catch { return []; }
  });
  const [customSubCategoryOrder, setCustomSubCategoryOrder] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hscSubOrder') || '[]') || [];
    } catch { return []; }
  });
  const [hasLoadedFromCloud, setHasLoadedFromCloud] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const lastSyncedStateRef = useRef<string>('');
  const quotaTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Firestore Sync ---
  useEffect(() => {
    if (!user) {
      setHasLoadedFromCloud(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen for cloud changes
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        
        // Only update state if cloud data differs from current state to prevent loops
        setProgress(prev => {
          const next = data.progress || {};
          return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
        setStarred(prev => {
          const next = data.starred || {};
          return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
        setSrsData(prev => {
          const next = data.srs || {};
          return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
        setDailyLog(prev => {
          const next = data.dailyLog || {};
          return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
        setRecentQuestions(prev => {
          const next = data.recent || [];
          return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
        setCustomSubCategoryOrder(prev => {
          const next = data.subCategoryOrder || [];
          return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
      }
      setHasLoadedFromCloud(true);
    }, (error) => {
      if (error instanceof Error && (error.message.includes('Quota exceeded') || error.message.includes('resource-exhausted'))) {
        setIsQuotaExceeded(true);
        setHasLoadedFromCloud(true); // Don't block UI if quota hit during initial load
      } else {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Push changes to cloud with debounce
  useEffect(() => {
    if (!user || !hasLoadedFromCloud || isQuotaExceeded) return;

    const currentState = JSON.stringify({ 
      progress, 
      starred, 
      srs: srsData, 
      dailyLog, 
      recent: recentQuestions, 
      subCategoryOrder: customSubCategoryOrder 
    });

    // Don't sync if data hasn't changed since last successful sync
    if (currentState === lastSyncedStateRef.current) return;

    const syncToCloud = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          progress,
          starred,
          srs: srsData,
          dailyLog,
          recent: recentQuestions,
          subCategoryOrder: customSubCategoryOrder,
          updatedAt: serverTimestamp()
        }, { merge: true });
        
        lastSyncedStateRef.current = currentState;
        setIsQuotaExceeded(false); // Reset if successful
      } catch (error) {
        // If quota is hit, we still have local storage as fallback
        if (error instanceof Error && (error.message.includes('Quota exceeded') || error.message.includes('resource-exhausted'))) {
          console.warn('Firestore write quota exceeded. Pausing sync for 30m.');
          setIsQuotaExceeded(true);
          if (quotaTimeoutRef.current) clearTimeout(quotaTimeoutRef.current);
          quotaTimeoutRef.current = setTimeout(() => setIsQuotaExceeded(false), 30 * 60 * 1000);
          return;
        }
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    };

    const timeout = setTimeout(syncToCloud, 30000); // 30s debounce to save quota
    return () => clearTimeout(timeout);
  }, [user, progress, starred, srsData, dailyLog, recentQuestions, customSubCategoryOrder, hasLoadedFromCloud, isQuotaExceeded]);

  // Update hash when cloud data is initially loaded
  useEffect(() => {
    if (hasLoadedFromCloud && !isQuotaExceeded) {
      lastSyncedStateRef.current = JSON.stringify({ 
        progress, 
        starred, 
        srs: srsData, 
        dailyLog, 
        recent: recentQuestions, 
        subCategoryOrder: customSubCategoryOrder 
      });
    }
  }, [hasLoadedFromCloud, isQuotaExceeded]);

  useEffect(() => {
    localStorage.setItem('hscRecent', JSON.stringify(recentQuestions));
  }, [recentQuestions]);

  useEffect(() => {
    localStorage.setItem('hscStarred', JSON.stringify(starred));
  }, [starred]);

  const addToRecent = useCallback((q: string) => {
    setRecentQuestions(prev => {
      const filtered = prev.filter(item => item !== q);
      return [q, ...filtered].slice(0, 10);
    });
  }, []);

  // --- Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [browseLevel, setBrowseLevel] = useState<'main' | 'sub' | 'questions'>('main');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'alpha' | 'sn' | 'sub'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [browseFontSize, setBrowseFontSize] = useState(20);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('hscSubOrder', JSON.stringify(customSubCategoryOrder));
  }, [customSubCategoryOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    if (!searchQuery && browseLevel !== 'questions') {
      // If user starts searching, we might want to jump to questions view or just filter categories?
      // For now, let's keep search separate or let it jump to questions if it's long?
    }
  }, [searchQuery, selectedMainCategory, selectedSubCategory, selectedStatus, view]);

  // Reset drill level when view changes from browse
  useEffect(() => {
    if (view !== 'browse') {
      // setBrowseLevel('main'); // Maybe keep state? Users usually like it kept.
    }
  }, [view]);

  // --- Scroll to top on page or view change ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, view, browseLevel, selectedSubCategory]);

  // --- Load Data ---
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(SHEET_LINK);
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: false }).data as string[][];
        
        // Remove header row and map to Word objects
        const words: Word[] = parsed.slice(1).filter(row => (row[1] && row[2]) || (row[6] && row[7]) || (row[8] && row[9]) || (row[14] && row[16])).map(row => {
          return {
            sn: row[0],
            question: (row[1] || row[6] || row[8] || row[14] || `ITEM-${row[0]}`).trim(), 
            answer: (row[2] || row[7] || row[9] || row[16] || '').trim(),
            mainCategory: row[3] || 'General',
            subCategory: row[4] || 'General',
            category: row[3] || 'General', 
            importance: parseInt(row[5]) || 0,
            proverbEn: row[6] || '',
            proverbBn: row[7] || '',
            phraseEn: row[8] || '',
            phrasePos: row[9] || '',
            phraseMeaningEn: row[10] || '',
            phraseMeaningBn: row[11] || '',
            phraseExEn: row[12] || '',
            phraseExBn: row[13] || '',
            verbEn: row[14] || '',
            verbPron: row[15] || '',
            verbMeaningBn: row[16] || '',
            verbForms: row[17] || '',
            verbExEn: row[18] || '',
            verbExBn: row[19] || ''
          };
        });
        
        setVocab(words);
      } catch (err) {
        console.error("Failed to load spreadsheet", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Persistence Side Effects ---
  useEffect(() => {
    localStorage.setItem('hscProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('hscSRS', JSON.stringify(srsData));
  }, [srsData]);

  useEffect(() => {
    localStorage.setItem('hscDaily', JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('autoRead', JSON.stringify(autoRead));
  }, [autoRead]);

  useEffect(() => {
    localStorage.setItem('hscProverbIdx', proverbIdx.toString());
  }, [proverbIdx]);

  useEffect(() => {
    localStorage.setItem('hscPhraseIdx', phraseIdx.toString());
  }, [phraseIdx]);

  useEffect(() => {
    localStorage.setItem('hscVerbIdx', verbIdx.toString());
  }, [verbIdx]);

  // --- Helper Functions ---
  const toggleStarred = (id: string) => {
    setStarred(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleStatus = (id: string, status: WordStatus) => {
    setProgress(prev => {
      const next = { ...prev };
      if (next[id] === status) {
        delete next[id];
      } else {
        next[id] = status;
        const now = Date.now();
        setSrsData(prevSrs => ({
          ...prevSrs,
          [id]: {
            interval: 1,
            ease: 2.5,
            next: now + 1 * 24 * 60 * 60 * 1000
          }
        }));
      }
      return next;
    });
  };

  const [bnVoice, setBnVoice] = useState<SpeechSynthesisVoice | null>(null);

  // --- Load Voices ---
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.toLowerCase().startsWith('bn')) || 
                    voices.find(v => v.name.toLowerCase().includes('bengali'));
      if (voice) setBnVoice(voice);
    };

    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = useCallback((text: string, cancel = true) => {
    if (!window.speechSynthesis) return;
    if (cancel) window.speechSynthesis.cancel();
    
    // Check if text contains Bengali characters
    const isBengali = /[\u0980-\u09FF]/.test(text);
    
    // For English, clean text more strictly. For others, be more permissive.
    let cleanText = text;
    if (!isBengali) {
      // Keep hyphen and apostrophe for words like "don't" or "full-time"
      cleanText = text.replace(/[^\w\s'-]/g, ' ').trim();
    }
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (isBengali) {
      // Find a bangla voice if possible
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        voices = window.speechSynthesis.getVoices();
      }
      
      const voice = bnVoice || 
                    voices.find(v => {
                      const l = v.lang.toLowerCase();
                      const n = v.name.toLowerCase();
                      return l.startsWith('bn') || l.includes('bengali') || n.includes('bengali') || n.includes('bangla');
                    });
      
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // Fallback languages - try common ones 
        utterance.lang = 'bn';
      }
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, [bnVoice]);

  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      window.navigator.vibrate(patterns[type]);
    }
  }, []);

  const searchGoogle = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const searchChatGPT = (query: string) => {
    const prompt = `Can you explain the meaning and usage of "${query}"? Provide some examples.`;
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank');
  };

  // --- Computed Data ---
  const categories = useMemo(() => Array.from(new Set(vocab.map(v => v.category))).sort(), [vocab]);
  const mainCategories = useMemo(() => Array.from(new Set(vocab.map(v => v.mainCategory))).sort(), [vocab]);
  const subCategories = useMemo(() => {
    const subset = selectedMainCategory 
      ? vocab.filter(v => v.mainCategory === selectedMainCategory)
      : vocab;
    const base = Array.from(new Set(subset.map(v => v.subCategory))).sort() as string[];
    
    if (customSubCategoryOrder.length > 0) {
      return [...base].sort((a: string, b: string) => {
        const idxA = customSubCategoryOrder.indexOf(a);
        const idxB = customSubCategoryOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
    }
    return base;
  }, [vocab, selectedMainCategory, customSubCategoryOrder]);
  
  const filteredVocab = useMemo(() => {
    const list = vocab.filter(v => {
      const matchesSearch = v.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMainCat = !selectedMainCategory || v.mainCategory === selectedMainCategory;
      const matchesSubCat = !selectedSubCategory || v.subCategory === selectedSubCategory;
      const status = progress[v.question];
      const matchesStatus = !selectedStatus || 
                            (selectedStatus === 'new' && !status) || 
                            (selectedStatus === 'mastered' && status === 'mastered') ||
                            (selectedStatus === 'review' && starred[v.question]);
      return matchesSearch && matchesMainCat && matchesSubCat && matchesStatus;
    });

    // Sort: Mastered words ('mastered') move to the bottom, then by user selected option
    return [...list].sort((a, b) => {
      const statusA = progress[a.question] === 'mastered' ? 1 : 0;
      const statusB = progress[b.question] === 'mastered' ? 1 : 0;
      
      if (statusA !== statusB) return statusA - statusB;

      if (sortBy === 'alpha') {
        return a.question.localeCompare(b.question);
      }
      if (sortBy === 'sn') {
        return (parseInt(a.sn) || 0) - (parseInt(b.sn) || 0);
      }
      if (sortBy === 'sub') {
        return a.subCategory.localeCompare(b.subCategory);
      }
      
      return 0; // Default: sheet order
    });
  }, [vocab, searchQuery, selectedMainCategory, selectedSubCategory, selectedStatus, progress, starred, sortBy]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCustomSubCategoryOrder((items) => {
        const currentList = items.length > 0 ? items : subCategories;
        const oldIndex = currentList.indexOf(active.id as string);
        const newIndex = currentList.indexOf(over.id as string);
        if (oldIndex === -1 || newIndex === -1) return currentList;
        return arrayMove(currentList, oldIndex, newIndex);
      });
    }
  };

  const paginatedVocab = filteredVocab.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredVocab.length / pageSize);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-emerald-500/20" />
          <p className="font-bold text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signInWithGoogle} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto shadow-lg shadow-blue-500/20" />
          <p className="font-bold text-slate-500 dark:text-slate-400">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-300 font-sans selection:bg-blue-100 dark:selection:bg-blue-900/30">
      
      {/* Sidebar removed for PC as requested, kept for state if needed by mobile drawer but aside is gone */}

      {/* --- Main Content Area Wrapper --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- Global Header --- */}
        {isHeaderVisible && (
          <header className={cn(
            "flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 sticky top-0 z-50 w-full transition-all duration-300",
            "h-16 md:h-20 px-4 md:px-12 shadow-sm"
          )}>
             <button 
              onClick={() => setView('dash')}
              className="flex items-center gap-2 hover:opacity-80 transition-all active:scale-95 group"
            >
               <div className="bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 w-9 h-9 md:w-10 md:h-10 transition-transform group-hover:rotate-6">
                 <FalconLogo size={24} />
               </div>
               <span className="font-black text-xl md:text-2xl tracking-tighter text-slate-900 dark:text-white">19questions</span>
            </button>
            
              <nav className="hidden md:flex items-center gap-1">
                <HeaderNavItem id="dash" icon={<LayoutDashboard size={16} />} label="Dash" currentView={view} setView={setView} />
                <HeaderNavItem id="browse" icon={<LibraryIcon size={16} />} label="Library" currentView={view} setView={setView} />
                <HeaderNavItem id="flash" icon={<Library size={16} />} label="Flashcards" currentView={view} setView={setView} />
                <HeaderNavItem id="proverbs" icon={<Sparkles size={16} />} label="Proverbs" currentView={view} setView={setView} />
                <HeaderNavItem id="phrases" icon={<TrendingUp size={16} />} label="Phrases" currentView={view} setView={setView} />
                <HeaderNavItem id="verbs" icon={<RotateCw size={16} />} label="Verbs" currentView={view} setView={setView} />
                <HeaderNavItem id="quiz" icon={<Zap size={16} />} label="Quiz" currentView={view} setView={setView} />
                <HeaderNavItem id="saved" icon={<Star size={16} />} label="Review" currentView={view} setView={setView} />
              </nav>

            <div className="flex items-center gap-1 md:gap-3">
              {/* Mobile Search Expandable */}
              {isSearchExpanded ? (
                <div 
                  className="relative flex items-center"
                  style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '160px' : '240px' }}
                >
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); if (view !== 'browse') setView('browse'); }}
                    onBlur={() => { if (!searchQuery) setIsSearchExpanded(false); }}
                    className="w-full pl-8 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 border-none"
                  />
                  <button 
                    onClick={() => { setSearchQuery(''); setIsSearchExpanded(false); }}
                    className="absolute right-2 text-slate-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsSearchExpanded(true)}
                  className="md:hidden p-2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <Search size={20} />
                </button>
              )}

              <div className={cn(
                "hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 transition-all duration-300 gap-3",
                "h-9 py-1.5"
              )}>
                <button 
                  onClick={() => setAutoRead(!autoRead)}
                  className={cn(
                    "flex items-center gap-1.5 text-[10px] font-black uppercase transition",
                    autoRead ? "text-blue-600" : "text-slate-400"
                  )}
                  title="Auto Read"
                >
                  <Volume2 size={14} />
                  <span>{autoRead ? "ON" : "OFF"}</span>
                </button>
                <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700" />
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                </button>
              </div>

              <div className="md:hidden flex items-center gap-1">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {user && (
                <button 
                  onClick={() => setView('profile')}
                  className={cn(
                    "hidden md:flex items-center gap-2 pr-3 pl-1 h-9 rounded-xl transition-all text-[10px] font-black uppercase",
                    view === 'profile' 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                      : (isQuotaExceeded 
                          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-800" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700")
                  )}
                >
                  <div className="relative">
                    <img 
                      src={user.photoURL || ''} 
                      className="w-7 h-7 rounded-lg border-2 border-white/20" 
                      referrerPolicy="no-referrer"
                      alt=""
                    />
                    {isQuotaExceeded && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                    )}
                  </div>
                  <span>{isQuotaExceeded ? "Sync Paused" : "Profile"}</span>
                </button>
              )}

              {user && (
                <button 
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 px-3 h-9 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:text-red-500 transition-colors text-[10px] font-black uppercase shadow-sm"
                >
                  <X size={14} />
                  <span>Log Out</span>
                </button>
              )}
              
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition ml-1"
                title="Open Menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </header>
        )}

        {/* Floating Toggle if Header is hidden */}
        {!isHeaderVisible && (
          <button 
            onClick={() => setIsHeaderVisible(true)}
            className="fixed top-4 right-4 z-[100] p-3 bg-blue-600 text-white rounded-full shadow-2xl transition active:scale-95"
            title="Show Header"
          >
            <Eye size={20} />
          </button>
        )}

        {/* --- Mobile Nav Drawer --- */}
        {isMobileMenuOpen && (
          <>
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            <div 
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 z-[70] p-6 flex flex-col md:hidden border-l border-white dark:border-slate-800/50"
            >
              <div className="flex justify-between items-center mb-10 text-slate-900 dark:text-white">
                <h2 className="text-xl font-black italic">MENU</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                >
                  <X />
                </button>
              </div>
              <nav className="space-y-4 flex-1">
                <NavItem id="dash" icon={<LayoutDashboard size={20} />} label="Dashboard" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <NavItem id="browse" icon={<LibraryIcon size={20} />} label="Browse Library" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <NavItem id="flash" icon={<Library size={20} />} label="Flashcards" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <NavItem id="proverbs" icon={<Sparkles size={20} />} label="Proverbs" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <NavItem id="phrases" icon={<TrendingUp size={20} />} label="Phrases & Idioms" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <NavItem id="quiz" icon={<Zap size={20} />} label="Quiz Mode" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <NavItem id="saved" icon={<Star size={20} />} label="Review Questions" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                  <NavItem id="profile" icon={<User size={20} />} label="My Profile" currentView={view} setView={setView} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                </div>
              </nav>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 mb-10">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Volume2 size={18} /> Auto Read
                  </span>
                  <button 
                    onClick={() => setAutoRead(!autoRead)}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-all duration-300",
                      autoRead ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                      autoRead ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      {/* --- Main Content --- */}
      <main className={cn("flex-1 px-4 pb-6 md:px-12 md:pb-12 max-w-7xl mx-auto w-full overflow-x-hidden", view === 'dash' ? "pt-0 md:pt-4" : "pt-2 md:pt-4")}>
        
         {/* --- Toolbar (Only for Browse) --- */}
         {view === 'browse' && (
            <div className="mb-8 max-w-5xl mx-auto">
               <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
                 {/* Back button (Only if drilling) */}
                 {browseLevel !== 'main' && !searchQuery && (
                   <div className="flex items-center gap-3">
                     <button 
                       onClick={() => {
                         if (browseLevel === 'questions') {
                           setBrowseLevel('sub');
                           setSelectedSubCategory('');
                         } else if (browseLevel === 'sub') {
                           setBrowseLevel('main');
                           setSelectedMainCategory('');
                         }
                       }}
                       className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm group"
                     >
                       <ChevronLeft size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                     </button>
                     <div className="flex flex-col border-l border-slate-100 dark:border-slate-800 pl-3">
                        <span className="text-[9px] font-black uppercase text-slate-400 leading-none mb-0.5">
                          {browseLevel === 'questions' ? selectedMainCategory : 'Library'}
                        </span>
                        <span className="text-[11px] font-bold text-blue-600 leading-none">
                          {browseLevel === 'questions' ? selectedSubCategory : selectedMainCategory}
                        </span>
                     </div>
                   </div>
                 )}

                  <div className="hidden md:block flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                    <input 
                     type="text" 
                     placeholder="Search words..."
                     className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm text-sm dark:placeholder:text-slate-600"
                     value={searchQuery}
                     onChange={(e) => { 
                       setSearchQuery(e.target.value); 
                       setCurrentPage(1); 
                     }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
                     {/* Sub-Category Filter (Contextual) */}
                     {browseLevel === 'questions' && subCategories.length > 1 && !searchQuery && (
                       <div className="flex-1 md:flex-none md:w-[160px]">
                         <select 
                           className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs outline-none shadow-sm cursor-pointer hover:border-emerald-500 transition border-emerald-50 text-emerald-700 dark:text-emerald-400"
                           value={selectedSubCategory}
                           onChange={(e) => { setSelectedSubCategory(e.target.value); setCurrentPage(1); }}
                         >
                           {subCategories.map(sub => (
                             <option key={sub} value={sub}>{sub}</option>
                           ))}
                         </select>
                       </div>
                     )}

                     {/* Sort Filter */}
                     <div className="flex-1 md:flex-none md:w-[130px]">
                       <select 
                         className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs outline-none shadow-sm cursor-pointer hover:border-blue-500 transition"
                         value={sortBy}
                         onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                       >
                         <option value="default">Default Sort</option>
                         <option value="alpha">Alphabetical</option>
                         <option value="sn">Serial No (SN)</option>
                         <option value="sub">Sub Category</option>
                       </select>
                     </div>

                     {/* Status Filter */}
                     <div className="flex-1 md:flex-none md:w-[130px]">
                       <select 
                         className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs outline-none shadow-sm cursor-pointer hover:border-blue-500 transition"
                         value={selectedStatus}
                         onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                       >
                         <option value="">All Status</option>
                         <option value="new">New</option>
                         <option value="mastered">Mastered</option>
                         <option value="review">Saved</option>
                       </select>
                     </div>

                     {/* Font Size */}
                     <div className="flex-[0.3] md:flex-none md:w-[100px] flex items-center justify-between px-2 bg-white dark:bg-slate-900 h-[46px] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                       <button 
                        onClick={() => setBrowseFontSize(s => Math.max(10, s - 2))}
                        className="p-1 hover:text-blue-500"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">{browseFontSize}</span>
                      <button 
                        onClick={() => setBrowseFontSize(s => Math.min(48, s + 2))}
                        className="p-1 hover:text-blue-500"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                 </div>
               </div>
            </div>
         )}

        <div className="pb-20">
          {view === 'dash' && (
            <DashboardView 
              vocab={vocab}
              progress={progress}
              starred={starred}
              recentQuestions={recentQuestions}
              setView={setView}
              setSearchQuery={setSearchQuery}
              mainCategories={mainCategories}
              setBrowseLevel={setBrowseLevel}
              setSelectedMainCategory={setSelectedMainCategory}
            />
          )}
          {view === 'browse' && (
            <div className="space-y-8 max-w-5xl mx-auto">
              
              {/* --- Drill Down Navigation --- */}
              {!searchQuery && browseLevel === 'main' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-blue-600 rounded-full" />
                      <h2 className="text-xl font-black text-slate-800 dark:text-white">Choose a Main Category</h2>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedMainCategory('');
                        setBrowseLevel('sub');
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-transparent hover:border-slate-300"
                    >
                      View All Sub-Categories
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mainCategories.map(cat => {
                      const catWords = vocab.filter(v => v.mainCategory === cat);
                      const count = catWords.length;
                      const completedCount = catWords.filter(v => progress[v.question] === 'mastered').length;
                      const isCompleted = count > 0 && completedCount === count;
                      const progressPct = count > 0 ? Math.round((completedCount / count) * 100) : 0;
                      
                      return (
                        <button 
                          key={cat}
                          id={`cat-${cat}`}
                          onClick={() => {
                            setSelectedMainCategory(cat);
                            setBrowseLevel('sub');
                          }}
                          className={cn(
                            "group relative bg-white dark:bg-slate-900 p-6 pb-8 rounded-[24px] border transition-all active:scale-[0.98]",
                            isCompleted 
                              ? "border-emerald-500 dark:border-emerald-800 shadow-lg shadow-emerald-500/10 hover:border-emerald-600" 
                              : "border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "text-lg font-black transition-colors",
                              isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white group-hover:text-blue-600"
                            )}>
                              {cat}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 capitalize">{count} questions available</span>
                              {progressPct > 0 && (
                                <span className={cn(
                                  "text-xs font-black",
                                  isCompleted ? "text-emerald-500" : "text-blue-500"
                                )}>{progressPct}%</span>
                              )}
                            </div>
                            {isCompleted && (
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-500">Mastered</span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="absolute bottom-4 left-6 right-6 h-1 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPct}%` }}
                              className={cn(
                                "h-full transition-all duration-500",
                                isCompleted ? "bg-emerald-500" : "bg-blue-500"
                              )}
                            />
                          </div>

                          <div className={cn(
                            "absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                            isCompleted 
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white"
                          )}>
                             <ChevronRight size={20} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!searchQuery && browseLevel === 'sub' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-1 px-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                       <span onClick={() => { setBrowseLevel('main'); setSelectedMainCategory(''); }} className="cursor-pointer hover:underline">Categories</span>
                       {selectedMainCategory && (
                         <>
                           <ChevronRight size={10} />
                           <span>{selectedMainCategory}</span>
                         </>
                       )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-blue-600 rounded-full" />
                      <h2 className="text-xl font-black text-slate-800 dark:text-white">
                        {selectedMainCategory ? 'Choose a Sub Category' : 'All Sub-Categories'}
                      </h2>
                      {customSubCategoryOrder.length > 0 && (
                        <button 
                          onClick={() => setCustomSubCategoryOrder([])}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-500 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-colors"
                          title="Reset manual order"
                        >
                          <RotateCcw size={10} />
                          Reset Order
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 italic">Drag the handles to rearrange topics</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={subCategories}
                        strategy={rectSortingStrategy}
                      >
                        {subCategories.map(sub => {
                          const subWords = vocab.filter(v => v.subCategory === sub && (!selectedMainCategory || v.mainCategory === selectedMainCategory));
                          const count = subWords.length;
                          const completedCount = subWords.filter(v => progress[v.question] === 'mastered').length;
                          const isCompleted = count > 0 && completedCount === count;
                          const progressPct = count > 0 ? Math.round((completedCount / count) * 100) : 0;
                          
                          return (
                            <SortableSubCategoryItem 
                              key={sub}
                              id={sub}
                              count={count}
                              isCompleted={isCompleted}
                              progressPct={progressPct}
                              onClick={() => {
                                setSelectedSubCategory(sub);
                                setBrowseLevel('questions');
                              }}
                            />
                          );
                        })}
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              )}

              {/* --- Questions View (Active when level is questions OR searching) --- */}
              {(browseLevel === 'questions' || searchQuery) && (
                <div className="space-y-8 max-w-5xl mx-auto">
                  {!searchQuery && (
                    <div className="flex flex-col gap-1 px-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                         <span onClick={() => { setBrowseLevel('main'); setSelectedMainCategory(''); setSelectedSubCategory(''); }} className="cursor-pointer hover:text-blue-600 transition-colors">Categories</span>
                         {selectedMainCategory && (
                           <>
                             <ChevronRight size={10} />
                             <span onClick={() => { setBrowseLevel('sub'); setSelectedSubCategory(''); }} className="cursor-pointer hover:text-blue-600 transition-colors">{selectedMainCategory}</span>
                           </>
                         )}
                         <ChevronRight size={10} />
                         <span className="text-blue-600">{selectedSubCategory}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedVocab.map((w, idx) => (
                      <WordCard 
                        key={w.question + idx} 
                        word={w} 
                        progress={progress}
                        starred={starred}
                        autoRead={autoRead}
                        speak={speak}
                        toggleStatus={toggleStatus}
                        toggleStarred={toggleStarred}
                        searchGoogle={searchGoogle}
                        searchChatGPT={searchChatGPT}
                        index={(currentPage - 1) * pageSize + idx + 1}
                        fontSize={browseFontSize}
                        addToRecent={addToRecent}
                      />
                    ))}
                  </div>
                  {filteredVocab.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <Library className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-black">No questions found</h3>
                      <p className="text-slate-500 text-sm font-medium">No results match your current level or filters.</p>
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-600 font-bold hover:underline">Clear search</button>
                      )}
                    </div>
                  )}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-10">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 shadow-sm"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Page</span>
                        <input 
                          type="number" 
                          min="1" 
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1 && val <= totalPages) {
                              setCurrentPage(val);
                            }
                          }}
                          className="w-12 px-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="font-bold text-sm text-slate-400">/ {totalPages}</span>
                      </div>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-50 shadow-sm"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {view === 'flash' && (
             <div className="max-w-4xl mx-auto">
                <FlashcardSession 
                  vocab={vocab} 
                  onToggleStatus={toggleStatus}
                  toggleStarred={toggleStarred}
                  progress={progress}
                  starred={starred}
                  autoRead={autoRead}
                  searchGoogle={searchGoogle}
                  searchChatGPT={searchChatGPT}
                  speak={speak}
                  triggerHapticFeedback={triggerHapticFeedback}
                  addToRecent={addToRecent}
                  isHeaderVisible={isHeaderVisible}
                  setIsHeaderVisible={setIsHeaderVisible}
                  isNavVisible={isNavVisible}
                  setIsNavVisible={setIsNavVisible}
                />
             </div>
          )}
          {view === 'profile' && (
            <div className="max-w-4xl mx-auto py-8 space-y-12">
              {/* Profile Header */}
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left transition-all duration-500">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={user?.photoURL || ''} 
                    alt={user?.displayName || 'User'} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 scale-100 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 z-20 flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">{user?.displayName}</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{user?.email}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                      Standard Plan
                    </div>
                    <div className="px-5 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20 flex items-center gap-2">
                      <Calendar size={14} />
                      Joined {new Date(user?.metadata.creationTime || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Words Mastered" 
                  value={Object.values(progress).filter(s => s === 'mastered').length} 
                  icon={<Trophy className="text-yellow-500" size={24} />} 
                  color="bg-yellow-50 dark:bg-yellow-500/10"
                />
                <StatCard 
                  title="Words in Review" 
                  value={Object.values(progress).filter(s => s === 'review').length} 
                  icon={<Zap className="text-blue-500" size={24} />} 
                  color="bg-blue-50 dark:bg-blue-500/10"
                />
                <StatCard 
                  title="Saved Items" 
                  value={Object.keys(starred).length} 
                  icon={<Star className="text-emerald-500" size={24} />} 
                  color="bg-emerald-50 dark:bg-emerald-500/10"
                />
                <StatCard 
                  title="Learning Streak" 
                  value={Object.keys(dailyLog).length} 
                  icon={<Flame className="text-orange-500" size={24} />} 
                  color="bg-orange-50 dark:bg-orange-500/10"
                />
              </div>

              {/* Profile Actions */}
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 border border-slate-200 dark:border-slate-800 transition-all">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Account Settings</h3>
                <div className="space-y-4">
                  <button onClick={logout} className="w-full flex items-center justify-between p-6 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-3xl transition-all group font-bold">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/10">
                        <LogOut size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-lg">Log Out</p>
                        <p className="text-sm opacity-60">Sign out of your session on this device</p>
                      </div>
                    </div>
                    <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all" />
                  </button>
                  <button className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-3xl transition-all group font-bold border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-md">
                        <Shield size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-lg">Privacy Settings</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your data and visibility</p>
                      </div>
                    </div>
                    <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          )}
          {view === 'quiz' && <QuizView vocab={vocab} triggerHapticFeedback={triggerHapticFeedback} />}
          {view === 'phrases' && (
            <PhrasesView 
              vocab={vocab} 
              phraseIdx={phraseIdx} 
              setPhraseIdx={setPhraseIdx} 
              speak={speak} 
              starred={starred} 
              toggleStarred={toggleStarred} 
              triggerHapticFeedback={triggerHapticFeedback}
              autoRead={autoRead}
              searchChatGPT={searchChatGPT}
            />
          )}
          {view === 'proverbs' && (
            <ProverbsView 
              vocab={vocab}
              proverbIdx={proverbIdx}
              setProverbIdx={setProverbIdx}
              speak={speak}
              starred={starred}
              toggleStarred={toggleStarred}
              triggerHapticFeedback={triggerHapticFeedback}
              autoRead={autoRead} 
              searchChatGPT={searchChatGPT}
            />
          )}
          {view === 'verbs' && (
            <VerbsView 
              vocab={vocab}
              verbIdx={verbIdx}
              setVerbIdx={setVerbIdx}
              speak={speak}
              starred={starred}
              toggleStarred={toggleStarred}
              triggerHapticFeedback={triggerHapticFeedback}
              autoRead={autoRead}
              searchChatGPT={searchChatGPT}
            />
          )}
          {view === 'saved' && (
            <div className="max-w-5xl mx-auto space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                 <div className="flex items-center gap-3">
                   <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Review Questions</h2>
                   <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
                      <button 
                        onClick={() => setBrowseFontSize(s => Math.max(12, s - 2))}
                        className="p-1 text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-[10px] font-black tabular-nums">{browseFontSize}px</span>
                      <button 
                        onClick={() => setBrowseFontSize(s => Math.min(48, s + 2))}
                        className="p-1 text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                   </div>
                 </div>
                 {Object.values(starred).filter(Boolean).length > 0 && (
                   <div className="flex items-center gap-2">
                     <ResetButton 
                        onConfirm={() => {
                          setStarred({});
                        }}
                     />
                   </div>
                 )}
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {vocab.filter(v => starred[v.question] && progress[v.question] !== 'mastered').map((w, idx) => (
                    <WordCard 
                      key={w.question + idx} 
                      word={w} 
                      progress={progress}
                      starred={starred}
                      autoRead={autoRead}
                      speak={speak}
                      toggleStatus={toggleStatus}
                      toggleStarred={toggleStarred}
                      searchGoogle={searchGoogle}
                      searchChatGPT={searchChatGPT}
                      index={idx + 1}
                      fontSize={browseFontSize}
                      addToRecent={addToRecent}
                    />
                  ))}
                  {vocab.filter(v => starred[v.question] && progress[v.question] !== 'mastered').length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-50">You have no items in your review list.</div>
                  )}
               </div>
            </div>
          )}
        </div>
      </main>

      {/* --- Footer / Navigation (Mobile) --- */}
      {isNavVisible && (
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-1 flex justify-around z-40 pb-safe shadow-lg overflow-x-auto whitespace-nowrap scrollbar-hide">
          <MobileNavItem id="dash" icon={<LayoutDashboard size={20} />} view={view} setView={setView} label="Dash" />
          <MobileNavItem id="browse" icon={<LibraryIcon size={20} />} view={view} setView={setView} label="Library" />
          <MobileNavItem id="flash" icon={<Library size={20} />} view={view} setView={setView} label="Flash" />
          <MobileNavItem id="proverbs" icon={<Sparkles size={20} />} view={view} setView={setView} label="Wisdom" />
          <MobileNavItem id="phrases" icon={<TrendingUp size={20} />} view={view} setView={setView} label="Phrases" />
          <MobileNavItem id="verbs" icon={<RotateCw size={20} />} view={view} setView={setView} label="Verbs" />
          <MobileNavItem id="quiz" icon={<Zap size={20} />} view={view} setView={setView} label="Quiz" />
          <MobileNavItem id="saved" icon={<Star size={20} />} view={view} setView={setView} label="Review" />
        </footer>
      )}

      {/* Floating Toggle if Nav is hidden */}
      {!isNavVisible && (
        <button 
          onClick={() => setIsNavVisible(true)}
          className="fixed bottom-6 right-6 z-[100] p-3 bg-indigo-600 text-white rounded-full shadow-2xl transition active:scale-95"
        >
          <RotateCw size={20} />
        </button>
      )}
    </div>
  </div>
);
}

function SortableSubCategoryItem({ id, count, isCompleted, progressPct, onClick }: { id: string, count: number, isCompleted: boolean, progressPct: number, onClick: () => void, key?: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group relative bg-white dark:bg-slate-900 p-5 pb-7 rounded-[20px] border transition-all active:scale-[0.98]",
        isCompleted 
          ? "border-emerald-500 dark:border-emerald-800 shadow-lg shadow-emerald-500/10 hover:border-emerald-600" 
          : "border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10",
        isDragging ? "shadow-2xl ring-2 ring-blue-500 border-transparent opacity-50 cursor-grabbing" : "cursor-default"
      )}
    >
      <div 
        onClick={onClick}
        className="flex flex-col gap-1 cursor-pointer pr-10"
      >
        <span className={cn(
          "text-base font-bold transition-colors line-clamp-1",
          isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200 group-hover:text-blue-600"
        )}>
          {id}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400">{count} items</span>
          {progressPct > 0 && (
            <span className={cn(
              "text-[10px] font-black",
              isCompleted ? "text-emerald-500" : "text-blue-500"
            )}>{progressPct}%</span>
          )}
        </div>
        {isCompleted && (
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-500">Topic Done</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-3 left-5 right-5 h-1 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          className={cn(
            "h-full transition-all duration-500",
            isCompleted ? "bg-emerald-500" : "bg-blue-500"
          )}
        />
      </div>
      
      {/* Drag Handle */}
      <div 
        {...listeners}
        className={cn(
          "absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-grab active:cursor-grabbing shadow-sm",
          isCompleted
            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-600 hover:text-white"
            : "bg-slate-50 dark:bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white"
        )}
      >
        <div className="flex flex-col gap-0.5">
           <div className="w-3 h-0.5 bg-current rounded-full" />
           <div className="w-3 h-0.5 bg-current rounded-full" />
           <div className="w-3 h-0.5 bg-current rounded-full" />
        </div>
      </div>
    </div>
  );
}

function WordCard({ 
  word, 
  progress, 
  starred,
  autoRead, 
  speak, 
  toggleStatus, 
  toggleStarred,
  searchGoogle, 
  searchChatGPT,
  index,
  fontSize,
  addToRecent
}: { 
  word: Word; 
  progress: ProgressData; 
  starred: Record<string, boolean>;
  autoRead: boolean; 
  speak: (t: string, c?: boolean) => void; 
  toggleStatus: (id: string, status: WordStatus) => void;
  toggleStarred: (id: string) => void;
  searchGoogle: (q: string) => void;
  searchChatGPT: (q: string) => void;
  index: number;
  fontSize?: number;
  addToRecent: (q: string) => void;
  key?: any;
}) {
  const status = progress[word.question];
  const isStarred = starred[word.question];
  const [showAnswer, setShowAnswer] = useState(false);

  const handleCardClick = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    
    const nextShow = !showAnswer;
    setShowAnswer(nextShow);
    if (nextShow) {
      if (autoRead) {
        speak(word.question);
        speak(word.answer, false);
      }
      addToRecent(word.question);
    }
  };

  const currentFontSize = fontSize || 20;

  const isProverb = !!(word.proverbEn && word.proverbBn);
  const displayQuestion = isProverb ? word.proverbEn : word.question;
  const displayAnswer = isProverb ? word.proverbBn : word.answer;

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl p-4 border-l-[4px] transition-all hover:shadow-md cursor-pointer group",
        status === 'mastered' ? "border-emerald-500 shadow-sm opacity-60" : 
        isStarred ? "border-orange-400 shadow-sm" : 
        "border-slate-200 dark:border-slate-800 shadow-sm"
      )}
    >
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-50 dark:border-slate-800/20">
        <div className="flex items-center gap-1.5 flex-wrap">
           <span className="text-[10px] font-bold text-slate-400 tabular-nums mr-1">
             #{index.toString().padStart(2, '0')}
           </span>
           {isProverb ? (
             <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 bg-blue-500 text-white rounded-md">
               Proverb
             </span>
           ) : (
             <>
               <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
                {word.mainCategory}
              </span>
              <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                {word.subCategory}
              </span>
             </>
           )}
        </div>
        <div className="flex gap-1">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              toggleStatus(word.question, 'mastered'); 
            }}
            className={cn(
              "p-1.5 rounded-md transition border",
              status === 'mastered' 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 border-transparent shadow-sm"
            )}
            title={status === 'mastered' ? "Mastered" : "Mark as Mastered"}
          >
            <Check size={13} className={status === 'mastered' ? "stroke-[4px]" : "stroke-[2px]"} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); speak(displayQuestion); }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-500 transition border border-transparent"
          >
            <Volume2 size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <h3 
          className="font-black text-slate-900 dark:text-slate-100 leading-tight flex-1"
          style={{ fontSize: currentFontSize * (isProverb ? 0.75 : 0.9) }}
        >
          {displayQuestion}
        </h3>
        {!showAnswer && (
          <button 
            onClick={(e) => { e.stopPropagation(); toggleStarred(word.question); }}
            className={cn(
              "p-1.5 rounded-lg transition border mb-1",
              isStarred 
                ? "bg-orange-50 border-orange-200 text-orange-500 dark:bg-orange-950/30 dark:border-orange-900/50" 
                : "bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-orange-400 border-transparent shadow-sm"
            )}
          >
            <Star size={13} fill={isStarred ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      
      {showAnswer ? (
          <div 
            className="mt-2 pt-2 border-t border-slate-50 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p 
                  className="font-bengali text-blue-600 dark:text-blue-400 font-bold leading-tight"
                  style={{ fontSize: currentFontSize * (isProverb ? 0.75 : 0.85) }}
                >
                  {displayAnswer}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(displayAnswer); }}
                  className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition"
                >
                  <Volume2 size={12} />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2 items-center">
              <button 
                onClick={(e) => { e.stopPropagation(); searchGoogle(displayQuestion + ' explain in Bangla'); }}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg transition hover:bg-blue-50 dark:hover:bg-blue-900/20 group/btn"
              >
                <Search size={14} className="text-slate-400 group-hover/btn:text-blue-500" />
                <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-blue-600">Google</span>
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); searchChatGPT(displayQuestion + ' explain in Bangla'); }}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg transition hover:bg-slate-900 hover:text-white dark:hover:bg-black group/btn"
              >
                <MessageSquare size={14} className="text-slate-400 group-hover/btn:text-white" />
                <span className="text-[10px] font-bold text-slate-500 group-hover/btn:text-white">ChatGPT</span>
              </button>

              <div className="ml-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleStarred(word.question); }}
                  className={cn(
                    "p-2 rounded-lg transition border",
                    isStarred 
                      ? "bg-orange-50 border-orange-200 text-orange-500 dark:bg-orange-950/30 dark:border-orange-900/50" 
                      : "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-300 hover:text-orange-400"
                  )}
                  title="Add to Review"
                >
                  <Star size={14} fill={isStarred ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  description,
  color = "bg-white dark:bg-slate-900" 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  description?: string;
  color?: string 
}) {
  return (
    <div 
      className={cn(
        "p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full", 
        color
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</span>
      </div>
      <div>
        <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight mb-1">{value}</div>
        {description && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">{description}</p>}
      </div>
    </div>
  );
}

function FlashcardSession({ 
  vocab, 
  onToggleStatus, 
  toggleStarred,
  progress, 
  starred,
  autoRead, 
  searchGoogle,
  searchChatGPT,
  speak,
  triggerHapticFeedback,
  addToRecent,
  isHeaderVisible,
  setIsHeaderVisible,
  isNavVisible,
  setIsNavVisible
}: { 
  vocab: Word[]; 
  onToggleStatus: (id: string, status: WordStatus) => void;
  toggleStarred: (id: string) => void;
  progress: ProgressData;
  starred: Record<string, boolean>;
  autoRead: boolean; 
  searchGoogle: (q: string) => void;
  searchChatGPT: (q: string) => void;
  speak: (t: string, c?: boolean) => void;
  triggerHapticFeedback: (type?: 'light' | 'medium' | 'heavy') => void;
  addToRecent: (q: string) => void;
  isHeaderVisible: boolean;
  setIsHeaderVisible: (v: boolean) => void;
  isNavVisible: boolean;
  setIsNavVisible: (v: boolean) => void;
}) {
  const [session, setSession] = useState<Word[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [drillLevel, setDrillLevel] = useState<'main' | 'sub' | 'active'>('main');
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [fontSize, setFontSize] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768 ? 28 : 20); // Default size in px

  const mainCats = useMemo(() => Array.from(new Set(vocab.map(v => v.mainCategory))).sort(), [vocab]);
  const subCats = useMemo(() => {
    return Array.from(new Set(vocab.filter(v => v.mainCategory === selectedMain).map(v => v.subCategory))).sort();
  }, [vocab, selectedMain]);

  useEffect(() => {
    if (drillLevel === 'active') {
      let pool = [...vocab];
      if (selectedMain) pool = pool.filter(v => v.mainCategory === selectedMain);
      if (selectedSub) pool = pool.filter(v => v.subCategory === selectedSub);
      if (pool.length) setSession(pool.sort(() => Math.random() - 0.5).slice(0, 20));
      setIdx(0);
      setFlipped(false);
    }
  }, [vocab, selectedMain, selectedSub, drillLevel]);

  const current = session[idx];
  const status = current ? progress[current.question] : null;
  const isStarred = current ? starred[current.question] : false;

  // Speak when flipped (answer)
  const lastSpokenAnswer = useRef<string | null>(null);
  useEffect(() => {
    if (!autoRead) {
      lastSpokenAnswer.current = null;
      return;
    }
    if (flipped && current && lastSpokenAnswer.current !== current.answer) {
      lastSpokenAnswer.current = current.answer;
      speak(current.answer, true);
    }
  }, [flipped, current, autoRead, speak]);

  // Speak when navigating (question)
  const lastSpokenQuestion = useRef<string | null>(null);
  useEffect(() => {
    if (!autoRead) {
      lastSpokenQuestion.current = null;
      return;
    }
    if (!flipped && current && lastSpokenQuestion.current !== current.question) {
      lastSpokenQuestion.current = current.question;
      speak(current.question, true);
    }
    // Reset answer ref when moving to new card
    if (!flipped) lastSpokenAnswer.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, autoRead]); 

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (drillLevel !== 'active') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [drillLevel, idx, flipped, session.length]);

  const handleNext = useCallback(() => {
    if (idx < session.length - 1) {
      setIdx(idx + 1);
      setFlipped(false);
    } else {
      setIdx(session.length); // Trigger session complete
    }
  }, [idx, session.length]);

  const handlePrev = useCallback(() => {
    if (idx > 0) {
      setIdx(idx - 1);
      setFlipped(false);
    }
  }, [idx]);

  // Handle Recent Study
  useEffect(() => {
    if (current) {
      addToRecent(current.question);
    }
  }, [current, addToRecent]);

  if (drillLevel === 'main') {
    return (
      <div className="space-y-6 pt-4">
        <h2 className="text-xl font-black text-center text-slate-800 dark:text-white mb-8">Flashcards: Choose Main Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainCats.map(cat => (
            <button
               key={cat}
               onClick={() => { setSelectedMain(cat); setDrillLevel('sub'); }}
               className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left font-bold hover:border-blue-500 transition-all active:scale-[0.98] flex justify-between items-center group"
            >
               <span>{cat}</span>
               <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (drillLevel === 'sub') {
    return (
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => { setDrillLevel('main'); setSelectedMain(''); }}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm group"
          >
            <ChevronLeft size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Categories</p>
            <h2 className="text-lg font-black text-slate-800 dark:text-white leading-none">{selectedMain}</h2>
          </div>
        </div>
        
        <h2 className="text-xl font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Choose Sub Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCats.map(sub => (
            <button
               key={sub}
               onClick={() => { setSelectedSub(sub); setDrillLevel('active'); }}
               className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left font-bold hover:border-blue-500 transition-all active:scale-[0.98] flex justify-between items-center group"
            >
               <span>{sub}</span>
               <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (session.length === 0 && drillLevel === 'active') return (
    <div className="text-center py-20 space-y-4 px-4">
      <p className="text-slate-400">No words found in this category.</p>
      <button onClick={() => setDrillLevel('main')} className="text-blue-600 font-bold hover:underline">Back to Selection</button>
    </div>
  );

  if (idx >= session.length) return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-8 text-center">
      <div 
        className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-500/20"
      >
        <Zap className="w-12 h-12 fill-current" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">Fantastic Work!</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          You've just conquered <span className="font-bold text-blue-600">20 words</span> in this session. Your vocabulary is growing!
        </p>
      </div>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button 
          onClick={() => { 
            setIdx(0); 
            let pool = [...vocab];
            if (selectedMain) pool = pool.filter(v => v.mainCategory === selectedMain);
            if (selectedSub) pool = pool.filter(v => v.subCategory === selectedSub);
            setSession(pool.sort(() => Math.random() - 0.5).slice(0, 20)); 
          }}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition active:scale-95"
        >
          Keep Going!
        </button>
        <button 
          onClick={() => setIdx(0)}
          className="w-full py-4 bg-white dark:bg-slate-800 text-slate-500 rounded-2xl font-bold border border-slate-100 dark:border-slate-700"
        >
          Review Same Session
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pt-4 px-1 sm:px-4">
      <div className="flex flex-wrap justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm gap-3">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap text-slate-900 dark:text-white">
          <button 
            onClick={() => { setDrillLevel('sub'); setSelectedSub(''); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition border border-slate-100 dark:border-slate-700"
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>
          <div className="flex flex-col ml-2 border-l border-slate-100 dark:border-slate-800 pl-3">
            <span className="text-[9px] font-black uppercase text-slate-400 leading-none mb-0.5">{selectedMain}</span>
            <span className="text-[11px] font-bold text-blue-600 leading-none">{selectedSub}</span>
          </div>
          <div className="flex items-center border-l border-slate-100 dark:border-slate-800 ml-2 pl-2 gap-1">
            <button 
              onClick={() => setFontSize(s => Math.max(16, s - 4))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              title="Decrease Font"
            >
              <Minus size={14} />
            </button>
            <span className="text-[10px] font-bold text-slate-400 min-w-[2.5ch] text-center">{fontSize}</span>
            <button 
              onClick={() => setFontSize(s => Math.min(64, s + 4))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              title="Increase Font"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-100 dark:border-slate-800 ml-2 pl-2">
            <button 
              onClick={() => {
                triggerHapticFeedback('light');
                setIsHeaderVisible(!isHeaderVisible);
              }}
              className={cn(
                "p-1.5 rounded-lg transition",
                isHeaderVisible ? "text-slate-400" : "bg-blue-600 text-white"
              )}
              title="Toggle Header (Focus Mode)"
            >
              {isHeaderVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button 
              onClick={() => {
                triggerHapticFeedback('light');
                setIsNavVisible(!isNavVisible);
              }}
              className={cn(
                "p-1.5 rounded-lg transition",
                isNavVisible ? "text-slate-400" : "bg-blue-600 text-white"
              )}
              title="Toggle Mobile Nav"
            >
              <LayoutDashboard size={14} />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end pr-2">
          <span className="text-xs font-bold text-slate-400">{idx + 1} / {session.length}</span>
          <span className="text-[10px] font-medium text-slate-300 dark:text-slate-600">Pool: {vocab.filter(v => (!selectedMain || v.mainCategory === selectedMain) && (!selectedSub || v.subCategory === selectedSub)).length}</span>
        </div>
      </div>

      <div className="relative h-[400px] sm:h-[420px] lg:h-[480px] [perspective:1000px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) {
                triggerHapticFeedback('light');
                handleNext();
              } else if (info.offset.x > 100) {
                triggerHapticFeedback('light');
                handlePrev();
              }
            }}
            className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer touch-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={(e) => {
                const selection = window.getSelection();
                if (selection && selection.toString().length > 0) return;
                setFlipped(!flipped);
              }}
            >
              {/* Front */}
              <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center p-8 backface-hidden [backface-visibility:hidden] shadow-sm">
                <span className="text-[10px] font-black uppercase text-blue-500 mb-6 tracking-widest px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">{current.category}</span>
                <h2 
                  className="font-black text-center break-words leading-tight text-slate-900 dark:text-slate-200"
                  style={{ fontSize: fontSize }}
                >
                  {current.question}
                </h2>
                <div className="mt-10 flex flex-col items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300 dark:text-slate-600">Tap to flip • Swipe to navigate</span>
                </div>
              </div>
              {/* Back */}
              <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[32px] border-2 border-blue-500 flex flex-col items-center justify-center p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl overflow-hidden">
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); speak(current.answer); }}
                    className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 hover:scale-110 transition active:scale-95 border border-blue-100 dark:border-blue-800/50"
                    title="Pronounce"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                  <h2 
                    className="font-bengali text-blue-600 dark:text-blue-500 mb-8 text-center leading-relaxed"
                    style={{ fontSize: fontSize + 4 }}
                  >
                    {current.answer}
                  </h2>
                        
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[320px] mb-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); searchGoogle(current.question + ' explain in Bangla'); }}
                      className="flex items-center justify-center gap-2 px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-bold hover:bg-blue-500 hover:text-white transition active:scale-95 shadow-sm text-slate-600 dark:text-slate-300"
                    >
                      <Search size={14} /> Google
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); searchChatGPT(current.question + ' explain in Bangla'); }}
                      className="flex items-center justify-center gap-2 px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-bold hover:bg-slate-900 hover:text-white transition active:scale-95 shadow-sm text-slate-600 dark:text-slate-300"
                    >
                      <MessageSquare size={14} /> ChatGPT
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 w-full max-w-[320px]">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleStarred(current.question); }}
                      className={cn(
                        "w-full px-4 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95 shadow-lg",
                        isStarred ? "bg-orange-500 text-white shadow-orange-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-orange-500 hover:text-white"
                      )}
                    >
                      <Star size={14} fill={isStarred ? "currentColor" : "none"} /> {isStarred ? 'Starred for Review' : 'Star for Review'}
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onToggleStatus(current.question, 'mastered');
                      }}
                      className={cn(
                        "w-full px-4 py-4 rounded-2xl text-sm font-black transition flex items-center justify-center gap-2 active:scale-95 shadow-lg",
                        status === 'mastered' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white"
                      )}
                    >
                      <Check size={20} className={status === 'mastered' ? "stroke-[4px]" : "stroke-[2px]"} /> {status === 'mastered' ? 'Mastered!' : 'Mastered'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
                    >
                      Next Card
                    </button>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="mt-6 p-2 text-xs font-bold text-slate-400 hover:text-blue-500 transition active:scale-95"
                  >
                    Skip Card
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hidden sm:flex justify-between items-center px-4 pt-4">
        <button 
          onClick={handlePrev} 
          disabled={idx === 0}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl font-bold text-slate-400 hover:text-blue-500 transition border border-slate-100 dark:border-slate-700 active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
           <ChevronLeft /> <span>Prev</span>
        </button>
        <button 
          onClick={handleNext} 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-500/20"
        >
           <span>Next</span> <ChevronRight />
        </button>
      </div>
    </div>
  );
}

