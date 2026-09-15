export interface BriefInput {
  primaryKeyword: string;
  businessContext: string;
  targetAudience: string;
  contentGoal: string;
  contentType: string;
  additionalNotes: string;
}

export interface SavedBrief {
  id: string;
  primaryKeyword: string;
  businessContext: string;
  briefMarkdown: string;
  generatedAt: string;
  checkedChecklistItems?: string[];
}

export interface PresetExample {
  title: string;
  tag: string;
  input: BriefInput;
}
