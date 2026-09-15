import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, FileText, Target, Building2, Users, Layers, AlertCircle, Wand2 } from "lucide-react";
import { BriefInput, PresetExample } from "../types";
import { PRESET_EXAMPLES } from "../data/presets";

interface BriefFormProps {
  input: BriefInput;
  onChange: (input: BriefInput) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const BriefForm: React.FC<BriefFormProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.primaryKeyword.trim()) {
      setValidationError("Please specify a target primary keyword.");
      return;
    }
    if (!input.businessContext.trim()) {
      setValidationError("Please provide business context so the brief can align with brand offerings.");
      return;
    }
    setValidationError(null);
    onSubmit();
  };

  const applyPreset = (preset: PresetExample) => {
    onChange({ ...preset.input });
    setValidationError(null);
  };

  return (
    <form id="seo-brief-form" onSubmit={handleSubmit} className="space-y-5">
      {/* Validation Error banner */}
      {validationError && (
        <div id="form-validation-error" className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Primary Keyword Field */}
      <div>
        <label htmlFor="primary-keyword-input" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-600" />
            1. Target Primary Keyword
            <span className="text-red-500">*</span>
          </span>
          <span className="text-xs font-normal text-slate-500">Core search query</span>
        </label>
        <input
          id="primary-keyword-input"
          type="text"
          value={input.primaryKeyword}
          onChange={(e) => {
            onChange({ ...input, primaryKeyword: e.target.value });
            if (validationError) setValidationError(null);
          }}
          placeholder="e.g., crm software for startups"
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors text-sm shadow-xs"
          disabled={isLoading}
        />
      </div>

      {/* Business Context Field */}
      <div>
        <label htmlFor="business-context-input" className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Business Context & Offering
            <span className="text-red-500">*</span>
          </span>
          <span className="text-xs font-normal text-slate-500">What you sell / your angle</span>
        </label>
        <textarea
          id="business-context-input"
          rows={3}
          value={input.businessContext}
          onChange={(e) => {
            onChange({ ...input, businessContext: e.target.value });
            if (validationError) setValidationError(null);
          }}
          placeholder="e.g., We provide lightweight CRM software built specifically for early-stage B2B SaaS teams who need zero setup time and pipeline transparency."
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors text-sm resize-y shadow-xs"
          disabled={isLoading}
        />
      </div>

      {/* Preset Quick Starters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-indigo-500" />
            Load quick scenario preset:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_EXAMPLES.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-btn-${idx}`}
              type="button"
              onClick={() => applyPreset(preset)}
              disabled={isLoading}
              className="text-left px-2.5 py-2 rounded-md border border-slate-200 bg-slate-50/80 hover:bg-indigo-50/50 hover:border-indigo-200 text-xs text-slate-700 transition-colors group cursor-pointer disabled:opacity-50"
            >
              <div className="font-medium text-slate-900 group-hover:text-indigo-700 truncate">
                {preset.title.split(":")[1] || preset.title}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {preset.tag} • &quot;{preset.input.primaryKeyword}&quot;
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Customizations Toggle */}
      <div className="pt-2 border-t border-slate-200">
        <button
          id="toggle-advanced-btn"
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {showAdvanced ? "Hide advanced brief settings" : "Show advanced audience & format settings"}
          </span>
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAdvanced && (
          <div id="advanced-settings-section" className="space-y-4 pt-3 mt-2">
            <div>
              <label htmlFor="target-audience-input" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Target Audience Persona (Optional)
              </label>
              <input
                id="target-audience-input"
                type="text"
                value={input.targetAudience}
                onChange={(e) => onChange({ ...input, targetAudience: e.target.value })}
                placeholder="e.g., Seed-stage founders, VP of Sales, Revenue Operations"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="content-type-select" className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Content Format / Type
                </label>
                <select
                  id="content-type-select"
                  value={input.contentType}
                  onChange={(e) => onChange({ ...input, contentType: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="Comprehensive Guide / Long-form Pillar">Comprehensive Guide / Long-form Pillar</option>
                  <option value="How-To Tutorial / Step-by-Step Playbook">How-To Tutorial / Step-by-Step Playbook</option>
                  <option value="Product Comparison & Evaluation">Product Comparison & Evaluation</option>
                  <option value="Curated Listicle / Best Practices">Curated Listicle / Best Practices</option>
                  <option value="Thought Leadership & Strategic Explainer">Thought Leadership & Strategic Explainer</option>
                  <option value="Case Study / Problem-Solution Breakdown">Case Study / Problem-Solution Breakdown</option>
                </select>
              </div>

              <div>
                <label htmlFor="content-goal-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Content Goal / CTA Intent
                </label>
                <input
                  id="content-goal-input"
                  type="text"
                  value={input.contentGoal}
                  onChange={(e) => onChange({ ...input, contentGoal: e.target.value })}
                  placeholder="e.g., Drive demo bookings or newsletter signups"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="additional-notes-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Writer Instructions & Constraints
              </label>
              <textarea
                id="additional-notes-input"
                rows={2}
                value={input.additionalNotes}
                onChange={(e) => onChange({ ...input, additionalNotes: e.target.value })}
                placeholder="e.g., Maintain a direct, no-fluff tone; compare pricing transparency; avoid buzzwords like 'synergy'."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        id="generate-brief-btn"
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Generating 14-Point SEO Brief...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate SEO Content Brief</span>
          </>
        )}
      </button>

      {/* Rules Notice */}
      <div className="p-3 bg-slate-100/70 border border-slate-200/80 rounded-lg text-[11px] text-slate-600 leading-relaxed">
        <span className="font-semibold text-slate-700">Strict SEO Rules Applied:</span>
        <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-500">
          <li>Prioritizes genuine search intent without keyword stuffing</li>
          <li>Never fabricates fake SERP statistics or search volumes</li>
          <li>Structured for immediate writer handoff across all 14 standard sections</li>
        </ul>
      </div>
    </form>
  );
};
