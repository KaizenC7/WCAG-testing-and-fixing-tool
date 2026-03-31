'use client';

interface AccessibilityScoreProps {
  score: number;
  issueCount: number;
}

export default function AccessibilityScore({ score, issueCount }: AccessibilityScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-600';
    if (s >= 70) return 'text-yellow-600';
    if (s >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (s: number) => {
    if (s >= 90) return 'bg-green-50 border-green-200';
    if (s >= 70) return 'bg-yellow-50 border-yellow-200';
    if (s >= 50) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getScoreBg(score)}`}>
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Accessibility Score</h3>
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold" style={{ color: getScoreColor(score).split('-')[1] }}>
          {score}
        </div>
        <div className="flex-1">
          <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </div>
          <p className="text-sm text-slate-600">
            {issueCount} {issueCount === 1 ? 'issue' : 'issues'} found
          </p>
        </div>
      </div>
      <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getScoreColor(score).replace('text', 'bg')}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
