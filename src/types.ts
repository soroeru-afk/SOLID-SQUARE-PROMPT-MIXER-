export type SectionType = 1 | 2 | 3 | 4;

export interface MasterPrompt {
  id: string;
  name: string;
  content: string;
  mark?: string;
}

export interface VariationPart {
  id: string;
  section: SectionType;
  category: string;
  name: string;
  content: string;
  isPinned: boolean;
}

export interface AppData {
  masters: MasterPrompt[];
  negatives?: MasterPrompt[];
  parts: VariationPart[];
  customCategories?: { name: string, section: SectionType }[];
}
