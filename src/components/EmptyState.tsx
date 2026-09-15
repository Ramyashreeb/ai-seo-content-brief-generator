import React from "react";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Compass } from "lucide-react";
import { PRESET_EXAMPLES } from "../data/presets";
import { PresetExample } from "../types";

interface EmptyStateProps {
  onSelectPreset: (preset: PresetExample) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPreset }) => {
  const sectionsList = [
    "Primary Keyword",
    "Search Intent",
    "Target Audience",
    "Content Goal",
    "Recommended SEO Title",
    "Secondary Keywords",
    "Recommended Word Count",
    "Content Outline (H1, H2, H3)",
    "People-Also-Ask Questions",
    "Unique Content Angle",
    "Internal Link Opportunities",
    "Recommended CTA",
    "Writer Instructions",
    "Quality Checklist",
  ];

  return (
    <div id="empty-state-container" className="h-full flex flex-col justify-between p-6 sm:p-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Standard 14-Section Architecture
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
          Writer-Ready SEO Content Briefs in Seconds
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mb-6">
          Transform any target keyword and business context into an actionable, comprehensive SEO blueprint.
          Built strictly for content teams and freelance writers who need precise structural guidance, genuine search intent, and quality controls.
        </p>

        {/* 14 Sections Overview Grid */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Included in every generated brief
            </span>
            <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded">
              14 Essential Sections
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {sectionsList.map((sec, idx) => (
              <div key={idx} className="flex items-center gap-2 py-1 px-1.5 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{sec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical / Quality Standards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Intent Over Stuffing</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Focuses on answering the user&apos;s true question instead of repetitive keyword stuffing.
              </div>
            </div>
          </div>
          <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Zero Hallucinated SERP Data</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Never fabricates fake search volumes or ranking promises. Clearly states estimates.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <div className="text-xs font-semibold text-slate-600 mb-2.5">
          Select a sample scenario to load input and generate:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PRESET_EXAMPLES.slice(0, 4).map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  &quot;{preset.input.primaryKeyword}&quot;
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
