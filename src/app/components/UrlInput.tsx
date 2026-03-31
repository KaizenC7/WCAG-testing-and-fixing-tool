'use client';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onAudit: () => void;
  isLoading: boolean;
}

export default function UrlInput({ url, setUrl, onAudit, isLoading }: UrlInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url.trim()) {
      onAudit();
    }
  };

  const handleAuditClick = () => {
    if (url.trim()) {
      onAudit();
    }
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str.startsWith('http') ? str : `https://${str}`);
      return true;
    } catch {
      return false;
    }
  };

  const isUrlValid = isValidUrl(url);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <label htmlFor="url-input" className="block text-sm font-semibold text-slate-700 mb-3">
        Enter Website URL or Local File
      </label>
      <div className="flex gap-3">
        <input
          id="url-input"
          type="text"
          placeholder="e.g., https://example.com or file:///C:/path/to/file.html"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
          aria-label="Website URL input"
        />
        <button
          onClick={handleAuditClick}
          disabled={!url.trim() || isLoading || !isUrlValid}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition whitespace-nowrap"
          aria-label="Start accessibility audit"
        >
          {isLoading ? 'Auditing...' : 'Run Audit'}
        </button>
      </div>
      {url && !isUrlValid && (
        <p className="text-red-500 text-sm mt-2">Please enter a valid URL</p>
      )}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-slate-700">
        <p className="font-semibold mb-2">💡 Testing Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Use <code>https://example.com</code> for public sites</li>
          <li>Use <code>file:///path/to/file.html</code> for local HTML files</li>
          <li>Cross-origin sites: analysis only, fixes disabled</li>
          <li>Same-origin pages: full audit and live fixes available</li>
        </ul>
      </div>
    </div>
  );
}
