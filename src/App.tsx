/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  History,
  PlusCircle,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
} from "lucide-react";
import { BriefInput, SavedBrief, PresetExample } from "./types";
import { PRESET_EXAMPLES } from "./data/presets";
import { BriefForm } from "./components/BriefForm";
import { BriefViewer } from "./components/BriefViewer";
import { EmptyState } from "./components/EmptyState";
import { HistoryModal } from "./components/HistoryModal";

const STORAGE_KEY = "seo_content_briefs_history_v1";

const DEFAULT_INPUT: BriefInput = {
  primaryKeyword: "",
  businessContext: "",
  targetAudience: "",
  contentGoal: "",
  contentType: "Comprehensive Guide / Long-form Pillar",
  additionalNotes: "",
};

export default function App() {
  const [input, setInput] = useState<BriefInput>(DEFAULT_INPUT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBrief, setCurrentBrief] = useState<SavedBrief | null>(null);
  const [savedBriefs, setSavedBriefs] = useState<SavedBrief[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<string[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedBriefs(parsed);
          // If there's a stored brief, load the latest as preview if available
          if (parsed.length > 0 && !currentBrief) {
            setCurrentBrief(parsed[0]);
            setCheckedChecklistItems(parsed[0].checkedChecklistItems || []);
          }
        }
      }
    } catch (e) {
      console.warn("Could not load briefs from local storage", e);
    }
  }, []);

  // Save history to localStorage
  const persistBriefs = (updatedBriefs: SavedBrief[]) => {
    setSavedBriefs(updatedBriefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBriefs));
    } catch (e) {
      console.warn("Could not save briefs to local storage", e);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate SEO content brief.");
      }

      const newBrief: SavedBrief = {
        id: `brief-${Date.now()}`,
        primaryKeyword: input.primaryKeyword.trim(),
        businessContext: input.businessContext.trim(),
        briefMarkdown: data.briefMarkdown,
        generatedAt: data.generatedAt || new Date().toISOString(),
        checkedChecklistItems: [],
      };

      const updated = [newBrief, ...savedBriefs.filter((b) => b.id !== newBrief.id)];
      persistBriefs(updated);
      setCurrentBrief(newBrief);
      setCheckedChecklistItems([]);
    } catch (err: unknown) {
      console.error("Generate brief error:", err);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetExample) => {
    setInput({ ...preset.input });
    setError(null);
  };

  const handleNewBrief = () => {
    setInput(DEFAULT_INPUT);
    setCurrentBrief(null);
    setCheckedChecklistItems([]);
    setError(null);
  };

  const handleToggleChecklistItem = (item: string) => {
    const updated = checkedChecklistItems.includes(item)
      ? checkedChecklistItems.filter((it) => it !== item)
      : [...checkedChecklistItems, item];
    setCheckedChecklistItems(updated);

    if (currentBrief) {
      const updatedBriefs = savedBriefs.map((b) =>
        b.id === currentBrief.id ? { ...b, checkedChecklistItems: updated } : b
      );
      persistBriefs(updatedBriefs);
    }
  };

  const handleResetChecklist = () => {
    setCheckedChecklistItems([]);
    if (currentBrief) {
      const updatedBriefs = savedBriefs.map((b) =>
        b.id === currentBrief.id ? { ...b, checkedChecklistItems: [] } : b
      );
      persistBriefs(updatedBriefs);
    }
  };

  const handleSelectAllChecklist = () => {
    // In BriefViewer, we can pass down all items or we can toggle
    // For simplicity, BriefViewer can compute full list
  };

  const handleDeleteBrief = (id: string) => {
    const filtered = savedBriefs.filter((b) => b.id !== id);
    persistBriefs(filtered);
    if (currentBrief?.id === id) {
      if (filtered.length > 0) {
        setCurrentBrief(filtered[0]);
        setCheckedChecklistItems(filtered[0].checkedChecklistItems || []);
      } else {
        setCurrentBrief(null);
        setCheckedChecklistItems([]);
      }
    }
  };

  const handleClearAllHistory = () => {
    persistBriefs([]);
    setCurrentBrief(null);
    setCheckedChecklistItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Top Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                AI SEO Content Brief Generator
              </span>
              <span className="hidden md:inline-block ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                14 Writer-Ready Sections
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNewBrief}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Brief</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
              {savedBriefs.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                  {savedBriefs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form & Strategy Parameters */}
        <section className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 lg:sticky lg:top-20">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">SEO Strategy Input</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your target search keyword and unique business context to generate a writer-ready brief.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <BriefForm
            input={input}
            onChange={setInput}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
        </section>

        {/* Right Column: Brief Viewer or Empty State */}
        <section className="lg:col-span-7 xl:col-span-8 bg-white rounded-xl border border-slate-200/90 shadow-xs min-h-[680px] overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="absolute -inset-1 rounded-2xl border-2 border-indigo-500/20 animate-ping" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                Constructing Writer-Ready SEO Content Brief
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                Synthesizing search intent, H1-H3 outline hierarchy, People-Also-Ask questions, and QA standards...
              </p>

              <div className="w-full max-w-xs space-y-2 text-left bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Mapping primary search intent</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Structuring H1, H2, and H3 outline</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span>Generating QA checklist & writer guidelines</span>
                </div>
              </div>
            </div>
          ) : currentBrief ? (
            <BriefViewer
              markdown={currentBrief.briefMarkdown}
              primaryKeyword={currentBrief.primaryKeyword}
              checkedChecklistItems={checkedChecklistItems}
              onToggleChecklistItem={handleToggleChecklistItem}
              onResetChecklist={handleResetChecklist}
              onSelectAllChecklist={handleSelectAllChecklist}
            />
          ) : (
            <EmptyState onSelectPreset={handleSelectPreset} />
          )}
        </section>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedBriefs={savedBriefs}
        onSelectBrief={(brief) => {
          setCurrentBrief(brief);
          setCheckedChecklistItems(brief.checkedChecklistItems || []);
          setInput({
            primaryKeyword: brief.primaryKeyword,
            businessContext: brief.businessContext,
            targetAudience: "",
            contentGoal: "",
            contentType: "Comprehensive Guide / Long-form Pillar",
            additionalNotes: "",
          });
        }}
        onDeleteBrief={handleDeleteBrief}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
