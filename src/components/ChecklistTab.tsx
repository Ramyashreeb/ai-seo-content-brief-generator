import React from "react";
import { CheckSquare, Square, CheckCircle2, Copy, Check } from "lucide-react";

interface ChecklistTabProps {
  items: string[];
  checkedItems: string[];
  onToggleItem: (item: string) => void;
  onResetAll: () => void;
  onSelectAll: () => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  items,
  checkedItems,
  onToggleItem,
  onResetAll,
  onSelectAll,
}) => {
  const [copied, setCopied] = React.useState(false);

  const completedCount = items.filter((it) => checkedItems.includes(it)).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const copyStatus = () => {
    const text = items
      .map((it) => `${checkedItems.includes(it) ? "[x]" : "[ ]"} ${it}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        No checklist items detected in Section 14. View the Full Document tab to review writer quality criteria.
      </div>
    );
  }

  return (
    <div id="interactive-checklist-tab" className="space-y-6">
      {/* Progress header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Content Writer Quality Assurance Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify your draft adheres to every search intent and quality standard before publishing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyStatus}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Checklist"}</span>
            </button>
            <button
              type="button"
              onClick={onSelectAll}
              className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
            >
              Mark All Done
            </button>
            <button
              type="button"
              onClick={onResetAll}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>
              Audit Progress: {completedCount} of {items.length} checks complete
            </span>
            <span className={progressPercent === 100 ? "text-emerald-600 font-bold" : "text-indigo-600"}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                progressPercent === 100 ? "bg-emerald-500" : "bg-indigo-600"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isChecked = checkedItems.includes(item);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onToggleItem(item)}
              className={`w-full text-left flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer ${
                isChecked
                  ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-950 shadow-xs"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="text-xs sm:text-sm flex-1 leading-relaxed">
                <span className={isChecked ? "line-through text-slate-500 font-normal" : "font-medium"}>
                  {item}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
