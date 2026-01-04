export interface Alert {
  id: string;
  title: string;
  snippet: string;
  source: string;
  link: string;
  relevancyScore?: number;
  relevancyReason?: string;
  draftResponse?: string;
  isScoring?: boolean;
  isDrafting?: boolean;
}
