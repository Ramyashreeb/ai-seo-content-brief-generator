import React from "react";
import {
  Target,
  Search,
  Users,
  Flag,
  Heading,
  Tags,
  FileText,
  ListTree,
  HelpCircle,
  Sparkles,
  Link2,
  MousePointerClick,
  PenTool,
  CheckSquare,
  BookOpen,
} from "lucide-react";

interface SectionIconProps {
  sectionNumber: number;
  className?: string;
}

export const SectionIcon: React.FC<SectionIconProps> = ({ sectionNumber, className = "w-4 h-4" }) => {
  switch (sectionNumber) {
    case 1:
      return <Target className={className} />;
    case 2:
      return <Search className={className} />;
    case 3:
      return <Users className={className} />;
    case 4:
      return <Flag className={className} />;
    case 5:
      return <Heading className={className} />;
    case 6:
      return <Tags className={className} />;
    case 7:
      return <FileText className={className} />;
    case 8:
      return <ListTree className={className} />;
    case 9:
      return <HelpCircle className={className} />;
    case 10:
      return <Sparkles className={className} />;
    case 11:
      return <Link2 className={className} />;
    case 12:
      return <MousePointerClick className={className} />;
    case 13:
      return <PenTool className={className} />;
    case 14:
      return <CheckSquare className={className} />;
    default:
      return <BookOpen className={className} />;
  }
};
