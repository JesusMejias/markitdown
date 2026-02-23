import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import html2pdf from 'html2pdf.js';
import {
  Copy,
  ClipboardPaste,
  Trash2,
  Download,
  FileCode2,
  Moon,
  Sun,
  FileText,
  FileDown
} from 'lucide-react';

const GithubIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

function App() {
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem('markdown-content') || '';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const charCount = markdown.length;
  const wordCount = markdown.trim().split(/\s+/).filter(w => w !== '').length;

  useEffect(() => {
    localStorage.setItem('markdown-content', markdown);
  }, [markdown]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme-mode', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme-mode', 'light');
    }
  }, [isDarkMode]);

  function pasteText() {
    navigator.clipboard.readText().then(text => setMarkdown(text));
  }

  async function copyRichText() {
    const type = 'text/html';
    const blob = new Blob([document.querySelector('.markdown-preview').innerHTML], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
  }

  function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadMarkdown() {
    downloadFile(markdown, 'document.md', 'text/markdown');
  }

  function downloadHtml() {
    const htmlContent = document.querySelector('.markdown-preview').innerHTML;
    const isDark = isDarkMode;
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    padding: 2rem; 
    line-height: 1.6;
    background-color: ${isDark ? '#111827' : '#ffffff'};
    color: ${isDark ? '#f9fafb' : '#111827'};
  }
  pre { 
    background: ${isDark ? '#374151' : '#f4f4f4'}; 
    padding: 1rem; 
    border-radius: 8px; 
    overflow-x: auto; 
    border: 1px solid ${isDark ? '#4b5563' : '#ddd'};
  }
  code { font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; }
  blockquote { 
    border-left: 4px solid ${isDark ? '#4b5563' : '#ddd'}; 
    padding-left: 1rem; 
    color: ${isDark ? '#9ca3af' : '#666'}; 
    font-style: italic; 
  }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid ${isDark ? '#4b5563' : '#ddd'}; padding: 8px; text-align: left; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    downloadFile(fullHtml, 'document.html', 'text/html');
  }

  function downloadPdf() {
    const element = document.querySelector('.markdown-preview');
    const opt = {
      margin: 0.5,
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: isDarkMode ? '#111827' : '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }

  return (
    <main>
      <header className="header-toolbar">
        <div className="title-area">
          <h1>markitdown.app</h1>
          <p>A simple, premium web-based markdown editor.</p>
        </div>
        <div className="actions">
          <button onClick={() => setIsDarkMode(!isDarkMode)} title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="https://github.com/JesusMejias/markitdown" target="_blank" rel="noreferrer" title="View Source on GitHub" style={{ display: 'flex', alignItems: 'center', padding: '0.6rem', color: 'var(--text-secondary)' }}>
            <GithubIcon size={20} />
          </a>
        </div>
      </header>

      <div className="content">
        <div className="workspace">

          <div className="pane">
            <div className="pane-header">
              <span>Markdown</span>
              <div className="pane-actions">
                <button onClick={() => navigator.clipboard.writeText(markdown)} disabled={markdown === ''} title="Copy Markdown">
                  <Copy size={16} />
                </button>
                <button onClick={pasteText} title="Paste Text">
                  <ClipboardPaste size={16} />
                </button>
                <button onClick={downloadMarkdown} disabled={markdown === ''} title="Download as .md">
                  <Download size={16} />
                </button>
                <button onClick={() => setMarkdown('')} disabled={markdown === ''} title="Clear Editor">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="pane-content">
              <textarea
                value={markdown}
                name="markdown"
                placeholder="Start typing your markdown here..."
                onChange={(e) => setMarkdown(e.target.value)}
              />
            </div>
          </div>

          <div className="pane">
            <div className="pane-header">
              <span>Preview</span>
              <div className="pane-actions">
                <button onClick={copyRichText} disabled={markdown === ''} title="Copy Rich Text">
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(document.querySelector('.markdown-preview').innerText)}
                  disabled={markdown === ''}
                  title="Copy Plain Text"
                >
                  <FileText size={16} />
                </button>
                <button onClick={downloadHtml} disabled={markdown === ''} title="Download as .html">
                  <FileCode2 size={16} />
                </button>
                <button onClick={downloadPdf} disabled={markdown === ''} title="Download as .pdf">
                  <FileDown size={16} />
                </button>
              </div>
            </div>
            <div className="pane-content">
              <div className="markdown-preview">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <SyntaxHighlighter
                          {...props}
                          style={isDarkMode ? vscDarkPlus : vs}
                          language={match ? match[1] : null}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {markdown}
                </Markdown>
              </div>
            </div>
          </div>

        </div>

        <div className="status-bar">
          <div className="stats">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
            <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
          </div>
          <div className="status-message">
            {markdown.length > 0 ? "Saved to local storage" : "Ready"}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
