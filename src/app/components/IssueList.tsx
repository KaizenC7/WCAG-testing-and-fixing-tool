'use client';

import { useState } from 'react';
import type { AccessibilityIssue } from '../types';

interface IssueListProps {
  issues: AccessibilityIssue[];
}

export default function IssueList({ issues }: IssueListProps) {
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-slate-500 text-lg">
          🎯 Enter a URL and click "Run Audit" to start testing
        </p>
      </div>
    );
  }

  const filteredIssues = issues.filter(issue => {
    const typeMatch = filterType === 'all' || issue.type === filterType;
    const severityMatch = filterSeverity === 'all' || issue.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  const issueTypes = Array.from(new Set(issues.map(i => i.type)));
  const severities = Array.from(new Set(issues.map(i => i.severity)));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Info':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return '🖼️';
      case 'Form':
        return '📝';
      case 'Contrast':
        return '🎨';
      case 'Keyboard':
        return '⌨️';
      case 'ARIA':
        return '📣';
      case 'Heading':
        return '📋';
      case 'Link':
        return '🔗';
      case 'Error':
        return '❌';
      default:
        return '⚠️';
    }
  };

  const highSeverityCount = filteredIssues.filter(i => i.severity === 'High').length;
  const mediumSeverityCount = filteredIssues.filter(i => i.severity === 'Medium').length;
  const lowSeverityCount = filteredIssues.filter(i => i.severity === 'Low').length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">📊 Accessibility Issues</h2>
        <p className="text-slate-300">
          Found {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 border-b border-slate-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{highSeverityCount}</div>
          <div className="text-sm text-slate-600">High Priority</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{mediumSeverityCount}</div>
          <div className="text-sm text-slate-600">Medium Priority</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{lowSeverityCount}</div>
          <div className="text-sm text-slate-600">Low Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-200 space-y-4">
        <div>
          <label htmlFor="filter-type" className="block text-sm font-semibold text-slate-700 mb-2">
            Filter by Type
          </label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {issueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-severity" className="block text-sm font-semibold text-slate-700 mb-2">
            Filter by Severity
          </label>
          <select
            id="filter-severity"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            {severities.sort((a, b) => {
              const order = { 'High': 0, 'Medium': 1, 'Low': 2, 'Info': 3 };
              return (order[a as keyof typeof order] || 99) - (order[b as keyof typeof order] || 99);
            }).map(severity => (
              <option key={severity} value={severity}>{severity}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="divide-y divide-slate-200">
        {filteredIssues.map((issue, index) => (
          <div
            key={index}
            className="p-6 hover:bg-slate-50 transition cursor-pointer"
            onClick={() =>
              setExpandedIssue(expandedIssue === index.toString() ? null : index.toString())
            }
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setExpandedIssue(expandedIssue === index.toString() ? null : index.toString());
              }
            }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl mt-1">{getTypeIcon(issue.type)}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{issue.message}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {issue.rule} • {issue.type}
                    </p>
                    {issue.selector && (
                      <p className="text-xs text-slate-500 mt-2 bg-slate-100 p-2 rounded font-mono">
                        {issue.selector}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getSeverityColor(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                </div>

                {/* Expanded Details */}
                {expandedIssue === index.toString() && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-slate-900 mb-2">📖 How to Fix</h4>
                      <p className="text-sm text-slate-700">{getFixDescription(issue)}</p>
                    </div>

                    {issue.fix && (
                      <div className="text-sm text-slate-600">
                        ✅ This issue can be auto-fixed using the "Apply Fixes Preview" button
                      </div>
                    )}

                    <div className="bg-slate-100 p-3 rounded text-xs font-mono text-slate-700 overflow-auto">
                      <p className="font-semibold mb-2">WCAG Reference:</p>
                      <p>{getWCAGReference(issue.rule)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          No issues found with current filters
        </div>
      )}
    </div>
  );
}

function getFixDescription(issue: any): string {
  const descriptions: Record<string, string> = {
    'alt-text': 'Add descriptive alt text to all images. Alt text should describe the image content and purpose.',
    'form-label': 'Associate labels with form inputs using the "for" attribute pointing to the input\'s id.',
    'contrast': 'Increase color contrast between text and background to meet WCAG AA standards (4.5:1 for normal text).',
    'keyboard': 'Ensure interactive elements are reachable via keyboard. Remove negative tabindex values.',
    'focus-style': 'Add visible focus indicators (outline or border) for keyboard navigation.',
    'aria-redundant': 'Remove ARIA roles from semantic HTML elements that already have native meaning.',
    'invalid-aria-role': 'Use only valid ARIA roles from the ARIA specification.',
    'heading-start': 'Start page content with an H1 heading for better document structure.',
    'heading-hierarchy': 'Use heading levels sequentially without skipping levels (H1 → H2 → H3, etc.).',
    'link-text': 'Provide meaningful text for links or use aria-label if using icon-only links.',
  };
  return descriptions[issue.rule] || 'Follow accessibility best practices to resolve this issue.';
}

function getWCAGReference(rule: string): string {
  const references: Record<string, string> = {
    'alt-text': 'WCAG 1.1.1 Non-text Content (Level A)',
    'form-label': 'WCAG 1.3.1 Info and Relationships (Level A)',
    'contrast': 'WCAG 1.4.3 Contrast (Minimum) (Level AA)',
    'keyboard': 'WCAG 2.1.1 Keyboard (Level A)',
    'focus-style': 'WCAG 2.4.7 Focus Visible (Level AA)',
    'aria-redundant': 'WCAG 1.3.1 Info and Relationships (Level A)',
    'invalid-aria-role': 'ARIA Authoring Practices Guide',
    'heading-start': 'WCAG 1.3.1 Info and Relationships (Level A)',
    'heading-hierarchy': 'WCAG 1.3.1 Info and Relationships (Level A)',
    'link-text': 'WCAG 2.4.4 Link Purpose (In Context) (Level A)',
  };
  return references[rule] || 'WCAG 2.1 Guidelines';
}
