import React, { useState } from 'react';

interface ResponseViewerProps {
  data: unknown;
  title?: string;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  data,
  title = 'Réponse SDK',
}) => {
  const [collapsed, setCollapsed] = useState(false);

  if (data === undefined || data === null) return null;

  const json = JSON.stringify(data, null, 2);

  return (
    <div style={{
      marginTop: '16px',
      border: '1px solid rgba(96,165,250,0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'rgba(15,23,42,0.6)',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(59,130,246,0.08)',
          borderBottom: collapsed ? 'none' : '1px solid rgba(96,165,250,0.15)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {title}
          </span>
          <span style={{
            fontSize: '10px',
            background: 'rgba(16,185,129,0.15)',
            color: '#6EE7B7',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '999px',
            padding: '1px 8px',
            fontWeight: 600,
          }}>
            JSON
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', transform: collapsed ? 'rotate(-90deg)' : 'none', transition: '150ms' }}>
          ▼
        </span>
      </div>

      {/* Content */}
      {!collapsed && (
        <pre style={{
          margin: 0,
          padding: '14px 16px',
          fontSize: '12px',
          lineHeight: '1.6',
          color: 'rgba(255,255,255,0.75)',
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          overflowX: 'auto',
          maxHeight: '320px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          <code dangerouslySetInnerHTML={{
            __html: syntaxHighlight(json)
          }} />
        </pre>
      )}
    </div>
  );
};

function syntaxHighlight(json: string): string {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'color:#93C5FD'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'color:#C4B5FD'; // key
          } else {
            cls = 'color:#6EE7B7'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'color:#FCD34D'; // boolean
        } else if (/null/.test(match)) {
          cls = 'color:#FDA4AF'; // null
        }
        return `<span style="${cls}">${match}</span>`;
      }
    );
}
