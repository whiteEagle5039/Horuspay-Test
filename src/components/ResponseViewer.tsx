import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ResponseViewerProps {
  data: unknown;
  title?: string;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  data,
  title = 'SDK Response',
}) => {
  const [collapsed, setCollapsed] = useState(false);

  if (data === undefined || data === null) return null;

  const json = JSON.stringify(data, null, 2);

  return (
    <div className="mt-4 border border-blue-500/20 rounded-lg overflow-hidden bg-slate-900/60 backdrop-blur-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 bg-blue-500/[0.08] cursor-pointer select-none border-b border-blue-500/15"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
            {title}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
            JSON
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-white/35 transition-transform duration-150 ${
            collapsed ? '-rotate-90' : ''
          }`}
        />
      </div>

      {/* Content */}
      {!collapsed && (
        <pre className="m-0 px-4 py-3.5 text-xs leading-relaxed text-white/75 font-mono overflow-auto max-h-96 whitespace-pre-wrap break-all">
          <code
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(json),
            }}
          />
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
