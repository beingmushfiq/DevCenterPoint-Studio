import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useCms } from '../Context/CmsContext';

export interface OverridePayload {
  html?: string;
  css?: string;
  js?: string;
  mode?: 'off' | 'preview' | 'live';
}

interface RegionOverrideProps {
  region: 'header' | 'footer';
  /** When true, bypasses the mode gate (used by the admin preview pane). */
  forcePreview?: boolean;
  className?: string;
  minHeight?: number;
}

function composeDocument(payload: OverridePayload, region: string): string {
  const css = payload.css ?? '';
  const html = payload.html ?? '';
  const js = payload.js ?? '';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { margin: 0; padding: 0; }
  *, *::before, *::after { box-sizing: border-box; }
  ${css}
</style>
</head>
<body>
${html}
<script>
  (function () {
    function reportHeight() {
      var h = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      parent.postMessage({ type: 'dcp-override-height', region: ${JSON.stringify(
        region
      )}, height: h }, '*');
    }
    window.addEventListener('load', reportHeight);
    if (window.ResizeObserver) {
      new ResizeObserver(reportHeight).observe(document.documentElement);
    }
    setTimeout(reportHeight, 120);
  })();
</script>
<script>${js}</script>
</body>
</html>`;
}

/**
 * Renders a CMS-authored raw HTML/CSS/JS override inside a sandboxed iframe.
 * The sandbox intentionally omits `allow-same-origin` so the injected code
 * cannot access parent cookies, storage, or the DOM.
 */
export const RegionOverride: React.FC<RegionOverrideProps> = ({
  region,
  forcePreview = false,
  className = '',
  minHeight = 72,
}) => {
  const cms = useCms();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  const payload = cms.getSectionBlock<OverridePayload>(
    'appearance',
    `${region}_override`,
    {}
  );

  const mode = payload?.mode ?? 'off';
  const isActive = forcePreview || mode === 'live';

  const doc = useMemo(
    () => (isActive ? composeDocument(payload ?? {}, region) : ''),
    [isActive, payload, region]
  );

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === 'dcp-override-height' &&
        e.data.region === region &&
        typeof e.data.height === 'number'
      ) {
        setHeight(Math.max(minHeight, e.data.height));
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [minHeight, region]);

  if (!isActive || !doc) return null;

  return (
    <iframe
      ref={iframeRef}
      title={`${region} override`}
      srcDoc={doc}
      sandbox="allow-scripts allow-popups"
      scrolling="no"
      className={`w-full border-0 block ${className}`}
      style={{ height: `${height}px` }}
    />
  );
};
