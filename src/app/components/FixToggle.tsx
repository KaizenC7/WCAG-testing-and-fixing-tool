'use client';

import type { AccessibilityIssue } from '../types';

interface FixToggleProps {
  issues: AccessibilityIssue[];
  onFixApplied: () => void;
  fixesApplied: boolean;
}

export default function FixToggle({ issues, onFixApplied, fixesApplied }: FixToggleProps) {
  const fixableIssues = issues.filter(issue => issue.fix && issue.id);

  const handleApplyFixes = () => {
    fixableIssues.forEach(issue => {
      try {
        issue.fix?.();
      } catch (error) {
        console.error(`Failed to apply fix for ${issue.rule}:`, error);
      }
    });
    onFixApplied();
  };

  const handleReloadFixes = () => {
    const iframe = document.getElementById('audit-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-slate-800 mb-2">🔧 Auto-Fix</h3>
        <p className="text-sm text-slate-600 mb-4">
          {fixableIssues.length} of {issues.length} issues can be auto-fixed
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleApplyFixes}
          disabled={fixableIssues.length === 0}
          className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          aria-label="Apply accessibility fixes"
        >
          ✨ Apply Fixes Preview
        </button>

        {fixesApplied && (
          <button
            onClick={handleReloadFixes}
            className="w-full px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
            aria-label="Reload and reset preview"
          >
            ↻ Reset Preview
          </button>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs text-slate-700">
        <p className="font-semibold mb-1">⚡ Important:</p>
        <p>These fixes are applied temporarily in the iframe preview. Use your browser DevTools to copy the corrected HTML or CSS for actual implementation.</p>
      </div>
    </div>
  );
}
