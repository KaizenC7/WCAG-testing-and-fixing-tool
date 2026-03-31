'use client';
import { useState } from 'react';
import UrlInput from './components/UrlInput';
import IframePreview from './components/IframePreview';
import IssueList from './components/IssueList';
import FixToggle from './components/FixToggle';
import AccessibilityScore from './components/AccessibilityScore';
import runAudit from './utils/runAudit';
import type { AccessibilityIssue } from './types';

export default function Home() {
  const [url, setUrl] = useState('');
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fixesApplied, setFixesApplied] = useState(false);

  const handleAudit = () => {
    setIsLoading(true);
    setFixesApplied(false);
    
    setTimeout(() => {
      const iframe = document.getElementById('audit-iframe') as HTMLIFrameElement;
      const foundIssues = runAudit(iframe);
      setIssues(foundIssues);
      setIsLoading(false);
    }, 500);
  };

  const handleFixApplied = () => {
    setFixesApplied(true);
  };

  const score = issues.length > 0 
    ? Math.max(0, 100 - (issues.filter(i => i.severity === 'High').length * 20 + issues.filter(i => i.severity === 'Medium').length * 10))
    : 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">♿</span>
            <h1 className="text-4xl font-bold text-slate-900">
              Accessibility Testing & Fixing Tool
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Detect and fix WCAG 2.1 accessibility issues in real-time
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Input & Preview */}
          <div className="lg:col-span-2 space-y-6">
            <UrlInput 
              url={url} 
              setUrl={setUrl} 
              onAudit={handleAudit}
              isLoading={isLoading}
            />

            {url && <IframePreview url={url} />}
          </div>

          {/* Right Panel - Score & Controls */}
          <div className="space-y-6">
            {issues.length > 0 && (
              <>
                <AccessibilityScore score={score} issueCount={issues.length} />
                <FixToggle issues={issues} onFixApplied={handleFixApplied} fixesApplied={fixesApplied} />
              </>
            )}
          </div>
        </div>

        {/* Issues List */}
        <div className="mt-8">
          <IssueList issues={issues} />
        </div>
      </div>
    </main>
  );
}
