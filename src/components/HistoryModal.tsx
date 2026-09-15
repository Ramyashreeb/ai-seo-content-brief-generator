import React from "react";
import { X, Clock, FileText, Trash2, ArrowRight } from "lucide-react";
import { SavedBrief } from "../types";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBriefs: SavedBrief[];
  onSelectBrief: (brief: SavedBrief) => void;
  onDeleteBrief: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  savedBriefs,
  onSelectBrief,
  onDeleteBrief,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Saved SEO Briefs History</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {savedBriefs.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedBriefs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No saved briefs yet. Generate your first brief to keep track of previous work.
            </div>
          ) : (
            savedBriefs.map((brief) => (
              <div
                key={brief.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all group"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectBrief(brief);
                    onClose();
                  }}
                  className="flex-1 text-left min-w-0 pr-3 cursor-pointer"
                >
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                    {brief.primaryKeyword}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {brief.businessContext}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(brief.generatedAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectBrief(brief);
                      onClose();
                    }}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                    title="Load brief"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteBrief(brief.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Delete brief"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {savedBriefs.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs">
            <span className="text-slate-500">Briefs are securely stored in your browser session.</span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-red-600 hover:text-red-700 font-medium hover:underline cursor-pointer"
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
