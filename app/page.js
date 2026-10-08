'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

const initialFiles = [
  {
    id: 'index',
    name: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 32px;
        background: #111827;
        color: #f9fafb;
      }
      .card {
        padding: 24px;
        border-radius: 12px;
        background: #1f2937;
        max-width: 700px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Welcome to your editor</h1>
      <p>Type ! and press Enter for a starter template.</p>
      <button>Launch</button>
    </div>
  </body>
</html>`,
  },
  {
    id: 'styles',
    name: 'styles.css',
    content: `body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: #0f172a;
  color: #e2e8f0;
}

.container {
  padding: 32px;
}
` ,
  },
];

function buildBoilerplate() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>`;
}

function expandAbbreviation(abbr) {
  const cleaned = abbr.trim();

  if (!cleaned) return '';
  if (cleaned === '!') return buildBoilerplate();

  const tagMatch = cleaned.match(/^([a-zA-Z0-9-]+)$/);
  if (tagMatch) {
    const tag = tagMatch[1];
    return `<${tag}></${tag}>`;
  }

  const classMatch = cleaned.match(/^([a-zA-Z0-9-]+)\.([a-zA-Z0-9-_.]+)$/);
  if (classMatch) {
    const [_, tag, className] = classMatch;
    return `<${tag} class="${className}"></${tag}>`;
  }

  const idMatch = cleaned.match(/^([a-zA-Z0-9-]+)#([a-zA-Z0-9-_]+)$/);
  if (idMatch) {
    const [_, tag, id] = idMatch;
    return `<${tag} id="${id}"></${tag}>`;
  }

  if (cleaned === 'ul>li*3') {
    return `<ul>\n  <li></li>\n  <li></li>\n  <li></li>\n</ul>`;
  }

  if (cleaned.includes('>')) {
    const [parent, child] = cleaned.split('>');
    return `<${parent}>\n  <${child}></${child}>\n</${parent}>`;
  }

  return cleaned;
}

export default function Home() {
  const [files, setFiles] = useState(initialFiles);
  const [activeFileId, setActiveFileId] = useState('index');
  const [previewMode, setPreviewMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const editorRef = useRef(null);

  const activeFile = useMemo(
    () => files.find((file) => file.id === activeFileId) || files[0],
    [files, activeFileId]
  );

  useEffect(() => {
    const saved = localStorage.getItem('ide-files');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          setFiles(parsed);
          setActiveFileId(parsed[0].id);
        }
      } catch (error) {
        console.error('Failed to parse saved files', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ide-files', JSON.stringify(files));
  }, [files]);

  const updateActiveFile = (nextContent) => {
    setFiles((current) =>
      current.map((file) =>
        file.id === activeFileId ? { ...file, content: nextContent } : file
      )
    );
  };

  const addFile = () => {
    const name = `untitled-${Date.now()}.html`;
    const newFile = {
      id: `file-${Date.now()}`,
      name,
      content: '<!-- new file -->\n<div class="example">Hello</div>',
    };
    setFiles((current) => [...current, newFile]);
    setActiveFileId(newFile.id);
  };

  const deleteFile = (id) => {
    if (files.length === 1) return;
    const nextFiles = files.filter((file) => file.id !== id);
    setFiles(nextFiles);
    if (activeFileId === id) setActiveFileId(nextFiles[0].id);
  };

  const triggerDownload = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = activeFile.name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onKeyDown((event) => {
      const model = editor.getModel();
      const position = editor.getPosition();
      const line = model.getLineContent(position.lineNumber);
      const beforeCursor = line.slice(0, position.column - 1);

      if (event.keyCode === monaco.KeyCode.Enter && beforeCursor.trim() === '!') {
        event.preventDefault();
        const fullRange = new monaco.Range(
          position.lineNumber,
          1,
          position.lineNumber,
          beforeCursor.length + 1
        );

        editor.executeEdits('boilerplate', [
          {
            range: fullRange,
            text: buildBoilerplate(),
          },
        ]);
        editor.setPosition({ lineNumber: 6, column: 5 });
        return;
      }

      if (event.keyCode === monaco.KeyCode.Tab) {
        const currentLine = model.getLineContent(position.lineNumber);
        const lineBeforeCursor = currentLine.slice(0, position.column - 1);
        const lastWord = lineBeforeCursor.split(/\s+/).pop() || '';

        if (lastWord && lastWord !== 'div' && lastWord !== 'p' && lastWord.length > 0) {
          const expanded = expandAbbreviation(lastWord);
          if (expanded && expanded !== lastWord) {
            event.preventDefault();
            const startCol = position.column - lastWord.length;
            const range = new monaco.Range(
              position.lineNumber,
              startCol,
              position.lineNumber,
              position.column
            );
            editor.executeEdits('emmet', [{ range, text: expanded }]);
            return;
          }
        }
      }
    });
  };

  const previewContent = useMemo(() => {
    if (!activeFile) return '<!DOCTYPE html><html><body></body></html>';
    return activeFile.content;
  }, [activeFile]);

  return (
    <div className="ide-shell">
      <header className="topbar">
        <div className="brand">Code Studio</div>
        <div className="top-actions">
          <button onClick={addFile}>New File</button>
          <button onClick={triggerDownload}>Download</button>
          <button onClick={() => setPreviewMode((value) => !value)}>
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <span>Explorer</span>
            <button onClick={() => setSidebarOpen((value) => !value)}>☰</button>
          </div>

          {files.map((file) => (
            <div
              key={file.id}
              className={`file-item ${file.id === activeFileId ? 'active' : ''}`}
              onClick={() => setActiveFileId(file.id)}
            >
              <span>{file.name}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(file.id);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </aside>

        <main className="editor-pane">
          <div className="tabs">
            {files.map((file) => (
              <div
                key={file.id}
                className={`tab ${file.id === activeFileId ? 'active-tab' : ''}`}
                onClick={() => setActiveFileId(file.id)}
              >
                {file.name}
              </div>
            ))}
          </div>

          <div className="editor-row">
            <div className="editor-wrap">
              <Editor
                theme="vs-dark"
                language={activeFile.name.endsWith('.html') ? 'html' : 'css'}
                value={activeFile.content}
                onChange={updateActiveFile}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  formatOnPaste: true,
                }}
              />
            </div>

            {previewMode && (
              <div className="preview-panel">
                <div className="preview-header">Preview</div>
                <iframe title="preview" srcDoc={previewContent} className="preview-frame" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
