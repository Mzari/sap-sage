import { useState } from 'react';
import { useTheme } from '../theme.jsx';

function CopyBtn({ text }) {
  const { C } = useTheme();
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text).catch(()=>{}); setOk(true); setTimeout(()=>setOk(false),1800); }}
      style={{
        background:'none', border:`1px solid ${ok ? C.green : C.borderMid}`,
        cursor:'pointer', padding:'1px 6px', borderRadius:4,
        color: ok ? C.green : C.textSub,
        fontSize:9.5, fontFamily:"'JetBrains Mono',monospace", flexShrink:0,
      }}>{ok ? '✓' : '⎘'}</button>
  );
}

function renderInline(text) {
  text = text.replace(/\[Tx:\s*([A-Z0-9_\/]+)\]/gi, '<span class="tx-badge">$1</span>');
  text = text.replace(/\b(T-code|Tcode|Transaction):\s*([A-Z0-9_\/]{2,20})\b/g, '<span class="tx-badge">$2</span>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  return text;
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;
  const lines    = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.match(/^```(\w*)/)) {
      const lang      = line.match(/^```(\w*)/)?.[1] || '';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      const code = codeLines.join('\n');
      elements.push(
        <div key={`cb-${i}`} className="cb-wrap">
          <div className="cb-head">
            <span className="cb-lang">{lang || 'code'}</span>
            <CopyBtn text={code} />
          </div>
          <div className="cb-body">{code}</div>
        </div>
      );
      i++; continue;
    }

    const h4 = line.match(/^####\s+(.*)/);
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    if (h4) { elements.push(<h4 key={i} dangerouslySetInnerHTML={{__html: renderInline(h4[1])}} />); i++; continue; }
    if (h3) { elements.push(<h3 key={i} dangerouslySetInnerHTML={{__html: renderInline(h3[1])}} />); i++; continue; }
    if (h2) { elements.push(<h2 key={i} dangerouslySetInnerHTML={{__html: renderInline(h2[1])}} />); i++; continue; }
    if (h1) { elements.push(<h1 key={i} dangerouslySetInnerHTML={{__html: renderInline(h1[1])}} />); i++; continue; }

    if (line.match(/^[-*_]{3,}$/)) { elements.push(<hr key={i} />); i++; continue; }

    if (line.startsWith('> ')) {
      elements.push(<blockquote key={i} dangerouslySetInnerHTML={{__html: renderInline(line.slice(2))}} />);
      i++; continue;
    }

    if (line.match(/^[-*+]\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-*+]\s+/)) {
        items.push(<li key={i} dangerouslySetInnerHTML={{__html: renderInline(lines[i].replace(/^[-*+]\s+/, ''))}} />);
        i++;
      }
      elements.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }

    if (line.match(/^\d+\.\s+/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(<li key={i} dangerouslySetInnerHTML={{__html: renderInline(lines[i].replace(/^\d+\.\s+/, ''))}} />);
        i++;
      }
      elements.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }

    if (line.includes('|') && lines[i+1]?.match(/^\|?[-| :]+\|?$/)) {
      const headers = line.split('|').map(c => c.trim()).filter(Boolean);
      const rows    = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i].split('|').map(c => c.trim()).filter(Boolean));
        i++;
      }
      elements.push(
        <table key={`tbl-${i}`}>
          <thead><tr>{headers.map((h, j) => <th key={j} dangerouslySetInnerHTML={{__html: renderInline(h)}} />)}</tr></thead>
          <tbody>{rows.map((row, r) => (
            <tr key={r}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{__html: renderInline(cell)}} />)}</tr>
          ))}</tbody>
        </table>
      );
      continue;
    }

    if (!line.trim()) { elements.push(<div key={i} style={{height:6}} />); i++; continue; }

    elements.push(<p key={i} dangerouslySetInnerHTML={{__html: renderInline(line)}} />);
    i++;
  }

  return <div className="md" style={{fontSize:12.5}}>{elements}</div>;
}
