import React, { useState, useMemo } from "react";
import Markdown from "react-markdown";
import {
  Copy,
  Check,
  Download,
  Printer,
  FileCode,
  BookOpen,
  ListTree,
  CheckSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { parseBriefSections, extractChecklistItems, downloadAsFile } from "../utils/briefParser";
import { SectionIcon } from "./SectionIcon";
import { ChecklistTab } from "./ChecklistTab";

interface BriefViewerProps {
  markdown: string;
  primaryKeyword: string;
  checkedChecklistItems: string[];
  onToggleChecklistItem: (item: string) => void;
  onResetChecklist: () => void;
  onSelectAllChecklist: () => void;
}

export const BriefViewer: React.FC<BriefViewerProps> = ({
  markdown,
  primaryKeyword,
  checkedChecklistItems,
  onToggleChecklistItem,
  onResetChecklist,
  onSelectAllChecklist,
}) => {
  const [activeTab, setActiveTab] = useState<"document" | "raw" | "outline" | "checklist">("document");
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedOutline, setCopiedOutline] = useState(false);
  const [copiedSectionIdx, setCopiedSectionIdx] = useState<number | null>(null);

  const sections = useMemo(() => parseBriefSections(markdown), [markdown]);
  const outlineSection = useMemo(() => sections.find((s) => s.number === 8 || s.title.toLowerCase().includes("outline")), [sections]);
  const checklistSection = useMemo(() => sections.find((s) => s.number === 14 || s.title.toLowerCase().includes("checklist")), [sections]);
  const checklistItems = useMemo(() => (checklistSection ? extractChecklistItems(checklistSection.content) : []), [checklistSection]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyOutline = () => {
    if (outlineSection) {
      navigator.clipboard.writeText(`## 8. Content Outline\n\n${outlineSection.content}`);
      setCopiedOutline(true);
      setTimeout(() => setCopiedOutline(false), 2000);
    }
  };

  const handleCopySection = (idx: number, content: string, title: string) => {
    navigator.clipboard.writeText(`## ${title}\n\n${content}`);
    setCopiedSectionIdx(idx);
    setTimeout(() => setCopiedSectionIdx(null), 1800);
  };

  const handleDownload = () => {
    const slug = primaryKeyword.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "seo-brief";
    downloadAsFile(`${slug}-content-brief.md`, markdown);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (secNumber: number) => {
    const element = document.getElementById(`section-${secNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="brief-viewer-container" className="h-full flex flex-col bg-slate-50">
      {/* Top Action & Tabs Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
          <button
            id="tab-document-btn"
            type="button"
            onClick={() => setActiveTab("document")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "document"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Interactive Brief</span>
          </button>

          <button
            id="tab-outline-btn"
            type="button"
            onClick={() => setActiveTab("outline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "outline"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Outline Only</span>
          </button>

          <button
            id="tab-checklist-btn"
            type="button"
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "checklist"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Writer QA ({checkedChecklistItems.length}/{checklistItems.length || 0})</span>
          </button>

          <button
            id="tab-raw-btn"
            type="button"
            onClick={() => setActiveTab("raw")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "raw"
                ? "bg-white text-indigo-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw Markdown</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="copy-brief-btn"
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md transition-colors shadow-2xs cursor-pointer"
            title="Copy full brief in Markdown"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedAll ? "Copied All!" : "Copy Full Brief"}</span>
          </button>

          <button
            id="download-brief-btn"
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md transition-colors shadow-2xs cursor-pointer"
            title="Download brief as .md file"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Download .md</span>
          </button>

          <button
            id="print-brief-btn"
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-md transition-colors shadow-2xs cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Tab 1: Interactive Document View */}
        {activeTab === "document" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header banner */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  SEO Content Strategy Brief
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {primaryKeyword}
                </h1>
              </div>

              {/* Quick Jump Dropdown / Pill */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-medium text-slate-400 mr-1 hidden sm:inline">Jump to:</span>
                {[
                  { num: 2, label: "Intent" },
                  { num: 5, label: "Title" },
                  { num: 6, label: "Keywords" },
                  { num: 8, label: "Outline" },
                  { num: 9, label: "PAA" },
                  { num: 13, label: "Writer Notes" },
                  { num: 14, label: "QA" },
                ].map((item) => (
                  <button
                    key={item.num}
                    type="button"
                    onClick={() => scrollToSection(item.num)}
                    className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rendered 14 Sections */}
            <div className="space-y-4">
              {sections.map((section, idx) => {
                const isOutline = section.number === 8;
                const isChecklist = section.number === 14;

                return (
                  <div
                    key={idx}
                    id={`section-${section.number}`}
                    className={`bg-white rounded-xl border transition-all ${
                      isOutline
                        ? "border-indigo-200/80 shadow-xs"
                        : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                    }`}
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <SectionIcon sectionNumber={section.number} className="w-3.5 h-3.5" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-indigo-600 font-mono text-xs">{section.number}.</span>
                          {section.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {isOutline && (
                          <button
                            type="button"
                            onClick={() => setActiveTab("outline")}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer mr-2"
                          >
                            <span>Dedicated Outline View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isChecklist && (
                          <button
                            type="button"
                            onClick={() => setActiveTab("checklist")}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer mr-2"
                          >
                            <span>Open Interactive Audit</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopySection(idx, section.content, section.title)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors cursor-pointer"
                          title="Copy section markdown"
                        >
                          {copiedSectionIdx === idx ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Section Body */}
                    <div className="p-5">
                      <div className="prose prose-slate prose-sm max-w-none text-slate-800 leading-relaxed">
                        <Markdown
                          components={{
                            h1: ({ children }) => (
                              <div className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-1.5 mb-3 mt-2 flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">H1</span>
                                <span>{children}</span>
                              </div>
                            ),
                            h2: ({ children }) => (
                              <div className="text-sm font-bold text-slate-900 mt-4 mb-2 flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-mono font-bold">H2</span>
                                <span>{children}</span>
                              </div>
                            ),
                            h3: ({ children }) => (
                              <div className="text-xs font-semibold text-slate-800 mt-3 mb-1.5 flex items-center gap-2 pl-3 border-l-2 border-slate-200">
                                <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-mono font-bold">H3</span>
                                <span>{children}</span>
                              </div>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside space-y-1 my-2 text-slate-700 pl-1 text-xs sm:text-sm">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside space-y-1 my-2 text-slate-700 pl-1 text-xs sm:text-sm">
                                {children}
                              </ol>
                            ),
                            p: ({ children }) => (
                              <p className="my-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
                                {children}
                              </p>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-slate-900">{children}</strong>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-indigo-400 bg-indigo-50/50 p-3 my-2 text-slate-800 text-xs sm:text-sm rounded-r-md">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {section.content}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Outline Only View */}
        {activeTab === "outline" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ListTree className="w-4 h-4 text-indigo-600" />
                  Heading Architecture (H1, H2, H3)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full content hierarchy ready for copying into Google Docs, Notion, or your CMS editor.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyOutline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                {copiedOutline ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOutline ? "Copied Outline!" : "Copy Outline"}</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              {outlineSection ? (
                <div className="prose prose-slate prose-sm max-w-none text-slate-800">
                  <Markdown
                    components={{
                      h1: ({ children }) => (
                        <div className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2 mb-4 mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-mono font-bold">H1</span>
                          <span>{children}</span>
                        </div>
                      ),
                      h2: ({ children }) => (
                        <div className="text-sm font-bold text-slate-900 mt-5 mb-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-xs font-mono font-bold">H2</span>
                          <span>{children}</span>
                        </div>
                      ),
                      h3: ({ children }) => (
                        <div className="text-xs font-semibold text-slate-800 mt-3 mb-1.5 flex items-center gap-2 pl-4 border-l-2 border-indigo-200">
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold">H3</span>
                          <span>{children}</span>
                        </div>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 my-2 pl-2">
                          {children}
                        </ul>
                      ),
                    }}
                  >
                    {outlineSection.content}
                  </Markdown>
                </div>
              ) : (
                <div className="text-sm text-slate-500 py-6 text-center">
                  Outline content not found. Check the full document view.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Writer QA Checklist Tab */}
        {activeTab === "checklist" && (
          <div className="max-w-3xl mx-auto">
            <ChecklistTab
              items={checklistItems}
              checkedItems={checkedChecklistItems}
              onToggleItem={onToggleChecklistItem}
              onResetAll={onResetChecklist}
              onSelectAll={onSelectAllChecklist}
            />
          </div>
        )}

        {/* Tab 4: Raw Markdown Tab */}
        {activeTab === "raw" && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-slate-500 font-mono">
                Markdown Output Structure (14 sections)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? "Copied" : "Copy Markdown"}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
              <pre className="whitespace-pre-wrap">{markdown}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
