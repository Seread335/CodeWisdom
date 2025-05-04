import { useRef, useEffect } from 'react';

interface HtmlPreviewProps {
  html: string;
  css?: string;
}

export function HtmlPreview({ html, css = '' }: HtmlPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>${html}</body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [html, css]);

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <iframe
        ref={iframeRef}
        title="HTML Preview"
        className="w-full min-h-[300px]"
        sandbox="allow-scripts"
      />
    </div>
  );
}