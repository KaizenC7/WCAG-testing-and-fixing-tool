'use client';

interface IframePreviewProps {
  url: string;
}

export default function IframePreview({ url }: IframePreviewProps) {
  const getUrl = (inputUrl: string) => {
    if (inputUrl.startsWith('file://') || inputUrl.startsWith('http')) {
      return inputUrl;
    }
    return `https://${inputUrl}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Website Preview</h2>
      <div className="border-2 border-slate-300 rounded-lg overflow-hidden bg-white">
        <iframe
          id="audit-iframe"
          src={getUrl(url)}
          title="Website preview for accessibility audit"
          className="w-full h-96 border-0"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">
        ⚠️ Note: Some scripts may not run in preview mode. Fixes apply temporarily to this iframe only.
      </p>
    </div>
  );
}
