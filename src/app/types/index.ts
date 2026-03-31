export type Severity = 'High' | 'Medium' | 'Low' | 'Info';
export type IssueType = 'Image' | 'Form' | 'Contrast' | 'Keyboard' | 'ARIA' | 'Error' | 'Heading' | 'Link';

export interface AccessibilityIssue {
  id: HTMLElement | null;
  rule: string;
  type: IssueType;
  severity: Severity;
  message: string;
  selector?: string;
  fix?: () => void;
}
