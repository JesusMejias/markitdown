import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
//import Lorem from './lorem';

function App() {
  const [markdown, setMarkdown] = useState('');
  return (
    <main>
      <header><h1>markitdown.app</h1>A simple, web-based markdown editor.</header>
      <div className="content">
        <div className="top">
          <div className="side">Markdown</div>
          <div className="side">Preview</div>
        </div>
        <div className="bottom">
          <div className="side"><textarea value={markdown} placeholder="Enter markdown text here." onChange={(e) => setMarkdown(e.target.value)}></textarea><div className="options"><button>Copy Markdown</button><button>Paste</button><button onClick={() => setMarkdown('')}>Clear</button></div></div>
          <div className="side"><div className="markdown"><Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown></div><div className="options"><button>Copy Rich Text</button></div></div>
        </div>
      </div>
      <footer>Developed and <a href="https://github.com/JesusMejias/markitdown" target="_blank">open sourced</a> by <a href="https://jesusmejias.com/" target="_blank">Jesús Mejías</a></footer>
    </main>
  );
}

export default App;
