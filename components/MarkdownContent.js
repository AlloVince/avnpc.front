'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MarkdownContent({ html }) {
  const contentRef = useRef(null);

  useEffect(() => {
    let active = true;
    const renderDiagrams = async () => {
      const diagrams = contentRef.current?.querySelectorAll('pre.mermaid');
      if (!diagrams?.length) return;
      const { default: mermaid } = await import('mermaid');
      if (!active) return;
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
      for (const diagram of diagrams) {
        if (!active) return;
        try {
          await mermaid.run({ nodes: [diagram] });
        } catch {
          diagram.classList.add('mermaid-error');
        }
      }
    };
    renderDiagrams();
    return () => { active = false; };
  }, [html]);

  return <div ref={contentRef} className="prose" dangerouslySetInnerHTML={{ __html: html }}/>;
}
