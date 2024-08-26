import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
//import Lorem from './lorem';

function App() {
  const [markdown, setMarkdown] = useState('');
  function pasteText() {
    navigator.clipboard.readText().then(text => {
      console.log(text);
      setMarkdown(text);
    });
  }
  async function copyRichText() {
    const type = 'text/html';
    const blob = new Blob([document.querySelector('.markdown').innerHTML], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(data);
  }
  return (
    <main>
      <header><h1>markitdown.app</h1>A simple, web-based markdown editor.</header>
      <div className="content">
        <div className="top">
          <div className="side">Markdown</div>
          <div className="side">Preview</div>
        </div>
        <div className="bottom">
          <div className="side"><textarea value={markdown} placeholder="Enter markdown text here." onChange={(e) => setMarkdown(e.target.value)}></textarea><div className="options"><button onClick={() => navigator.clipboard.writeText(markdown)} disabled={markdown === ''}>Copy Markdown</button><button onClick={pasteText}>Paste</button><button onClick={() => setMarkdown('')} disabled={markdown === ''}>Clear</button></div></div>
          <div className="side"><div className="markdown"><Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown></div><div className="options"><button onClick={copyRichText} disabled={markdown === ''}>Copy Rich Text</button><button onClick={() => navigator.clipboard.writeText(document.querySelector('.markdown').innerText)} disabled={markdown === ''}>Copy Plain Text</button></div></div>
        </div>
      </div>
      <footer>Developed and <a href="https://github.com/JesusMejias/markitdown" target="_blank">open sourced</a> by <a href="https://jesusmejias.com/" target="_blank">Jesús Mejías</a></footer>
    </main>
  );
}

export default App;
