import { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor/editor.api';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import 'monaco-editor/editor/contrib/bracketMatching/browser/bracketMatching';
import 'monaco-editor/editor/contrib/clipboard/browser/clipboard';
import 'monaco-editor/editor/contrib/comment/browser/comment';
import 'monaco-editor/editor/contrib/contextmenu/browser/contextmenu';
import 'monaco-editor/editor/contrib/find/browser/findController';
import 'monaco-editor/editor/contrib/folding/browser/folding';
import 'monaco-editor/editor/contrib/format/browser/formatActions';
import 'monaco-editor/editor/contrib/hover/browser/hoverContribution';
import 'monaco-editor/editor/contrib/indentation/browser/indentation';
import 'monaco-editor/editor/contrib/lineSelection/browser/lineSelection';
import 'monaco-editor/editor/contrib/linesOperations/browser/linesOperations';
import 'monaco-editor/editor/contrib/multicursor/browser/multicursor';
import 'monaco-editor/editor/contrib/snippet/browser/snippetController2';
import 'monaco-editor/editor/contrib/suggest/browser/suggestController';
import 'monaco-editor/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode';
import 'monaco-editor/editor/contrib/tokenization/browser/tokenization';
import 'monaco-editor/editor/contrib/wordHighlighter/browser/wordHighlighter';
import 'monaco-editor/editor/contrib/wordOperations/browser/wordOperations';
import 'monaco-editor/editor/contrib/wordPartOperations/browser/wordPartOperations';
import 'monaco-editor/languages/definitions/cpp/register';
import 'monaco-editor/languages/definitions/csharp/register';
import 'monaco-editor/languages/definitions/go/register';
import 'monaco-editor/languages/definitions/java/register';
import 'monaco-editor/languages/definitions/javascript/register';
import 'monaco-editor/languages/definitions/kotlin/register';
import 'monaco-editor/languages/definitions/python/register';
import 'monaco-editor/languages/definitions/rust/register';
import 'monaco-editor/languages/definitions/swift/register';
import 'monaco-editor/languages/definitions/typescript/register';

loader.config({ monaco });

if (typeof self !== 'undefined') {
  self.MonacoEnvironment = {
    getWorker() {
      return new EditorWorker();
    },
  };
}

function parseHeight(height, fallback = 280) {
  if (typeof height === 'number') return height;
  const parsed = Number.parseInt(String(height), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampHeight(height, minHeight, maxHeight) {
  return Math.max(minHeight, Math.min(maxHeight, height));
}

function readStoredHeight(storageKey, fallback, minHeight, maxHeight) {
  if (!storageKey || typeof window === 'undefined') {
    return clampHeight(fallback, minHeight, maxHeight);
  }

  const stored = Number.parseInt(window.localStorage.getItem(storageKey), 10);
  return Number.isFinite(stored)
    ? clampHeight(stored, minHeight, maxHeight)
    : clampHeight(fallback, minHeight, maxHeight);
}

function toggleSelectedLineComments(textarea) {
  const { value: text, selectionStart, selectionEnd } = textarea;
  const start = text.lastIndexOf('\n', Math.max(selectionStart - 1, 0)) + 1;
  const nextBreak = text.indexOf('\n', selectionEnd);
  const end = nextBreak === -1 ? text.length : nextBreak;
  const block = text.slice(start, end);
  const lines = block.split('\n');
  const hasCode = lines.some((line) => line.trim());
  const shouldUncomment = hasCode && lines
    .filter((line) => line.trim())
    .every((line) => /^\s*\/\//.test(line));

  const updatedBlock = lines
    .map((line) => {
      if (!line.trim()) return line;
      if (shouldUncomment) return line.replace(/^(\s*)\/\/\s?/, '$1');
      return line.replace(/^(\s*)/, '$1// ');
    })
    .join('\n');

  return {
    value: `${text.slice(0, start)}${updatedBlock}${text.slice(end)}`,
    selectionStart: start,
    selectionEnd: start + updatedBlock.length,
  };
}

function editorPath(storageKey, language) {
  const safeKey = String(storageKey || 'solution').replace(/[^a-zA-Z0-9._-]/g, '-');
  return `inmemory://algovista/${safeKey}.${language}`;
}

function monacoLanguage(language) {
  // Monaco intentionally shares its C/C++ grammar under the `cpp` id.
  return language === 'c' ? 'cpp' : language;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '280px',
  minHeight = 240,
  maxHeight = 820,
  storageKey,
  resizable = true,
  fontSize = 13,
  wordWrap = true,
}) {
  const editorRef = useRef(null);
  const fallbackRef = useRef(null);
  const defaultHeight = clampHeight(parseHeight(height), minHeight, maxHeight);
  const [editorHeight, setEditorHeight] = useState(() =>
    readStoredHeight(storageKey, defaultHeight, minHeight, maxHeight)
  );
  const [editorAvailable, setEditorAvailable] = useState(() => (
    typeof window !== 'undefined' && typeof window.Worker === 'function' ? null : false
  ));
  const [tabInserts, setTabInserts] = useState(true);

  const updateHeight = (nextHeight) => {
    const clamped = clampHeight(nextHeight, minHeight, maxHeight);
    setEditorHeight(clamped);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, String(clamped));
    }
  };

  const startResize = (event) => {
    if (!resizable) return;
    event.preventDefault();
    const startY = event.clientY;
    const startHeight = editorHeight;

    const handleMove = (moveEvent) => {
      updateHeight(startHeight + moveEvent.clientY - startY);
    };

    const stop = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stop);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stop);
  };

  useEffect(() => {
    updateHeight(readStoredHeight(storageKey, defaultHeight, minHeight, maxHeight));
  // Height storage is intentionally re-read only when its owning editor changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, defaultHeight, minHeight, maxHeight]);

  useEffect(() => {
    editorRef.current?.layout();
  }, [editorHeight]);

  useEffect(() => {
    if (editorAvailable === false) return undefined;
    let active = true;
    loader.init().then(
      () => active && setEditorAvailable(true),
      () => active && setEditorAvailable(false)
    );
    return () => {
      active = false;
    };
  }, [editorAvailable]);

  useEffect(() => {
    editorRef.current?.updateOptions({
      fontSize,
      wordWrap: wordWrap ? 'on' : 'off',
      tabFocusMode: !tabInserts,
    });
  }, [fontSize, tabInserts, wordWrap]);

  const handleFallbackKeyDown = (event) => {
    const textarea = event.currentTarget;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm') {
      event.preventDefault();
      setTabInserts((current) => !current);
      return;
    }

    if (event.key === 'Tab' && tabInserts) {
      event.preventDefault();
      const { selectionStart, selectionEnd } = textarea;
      const nextValue = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      onChange?.(nextValue);
      window.requestAnimationFrame(() => {
        textarea.selectionStart = selectionStart + 2;
        textarea.selectionEnd = selectionStart + 2;
      });
    }

    if (event.key === '/' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      const next = toggleSelectedLineComments(textarea);
      onChange?.(next.value);
      window.requestAnimationFrame(() => {
        textarea.selectionStart = next.selectionStart;
        textarea.selectionEnd = next.selectionEnd;
      });
    }
  };

  const renderFallback = editorAvailable === false;

  return (
    <div className="code-editor-shell">
      <div
        className="code-editor-frame"
        style={{
          height: `${editorHeight}px`,
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
        }}
      >
        {renderFallback ? (
          <textarea
            ref={fallbackRef}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={handleFallbackKeyDown}
            spellCheck={false}
            aria-label={`${language} code editor`}
            className="code-editor-fallback"
            style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
          />
        ) : (
          <Editor
            className="code-editor-monaco"
            height="100%"
            path={editorPath(storageKey, language)}
            language={monacoLanguage(language)}
            value={value}
            theme="vs-dark"
            loading={<div className="code-editor-loading" role="status">Loading professional editor…</div>}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.updateOptions({ tabFocusMode: !tabInserts });
              editor.focus();
            }}
            onChange={(nextValue) => onChange?.(nextValue ?? '')}
            options={{
              accessibilitySupport: 'auto',
              ariaLabel: `${language} code editor`,
              automaticLayout: true,
              bracketPairColorization: { enabled: true },
              contextmenu: true,
              cursorBlinking: 'smooth',
              folding: true,
              fontLigatures: true,
              fontSize,
              formatOnPaste: true,
              guides: { bracketPairs: true, indentation: true },
              insertSpaces: true,
              lineNumbers: 'on',
              minimap: { enabled: false },
              padding: { top: 12, bottom: 12 },
              quickSuggestions: { other: true, comments: false, strings: true },
              renderLineHighlight: 'all',
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              tabFocusMode: !tabInserts,
              tabSize: 2,
              wordWrap: wordWrap ? 'on' : 'off',
            }}
          />
        )}
      </div>
      {resizable && (
        <div className="code-editor-resizebar">
          <button type="button" onClick={() => setTabInserts((current) => !current)} title="Ctrl+M toggles whether Tab indents or moves focus">
            Tab: {tabInserts ? 'indent' : 'focus'}
          </button>
          <span className="code-editor-resizebar__status">Saved locally</span>
          <span
            role="separator"
            tabIndex="0"
            aria-orientation="horizontal"
            aria-label="Resize code editor"
            aria-valuemin={minHeight}
            aria-valuemax={maxHeight}
            aria-valuenow={editorHeight}
            className="code-editor-drag-handle"
            onPointerDown={startResize}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                event.preventDefault();
                updateHeight(editorHeight + (event.key === 'ArrowDown' ? 24 : -24));
              }
              if (event.key === 'Home') updateHeight(minHeight);
              if (event.key === 'End') updateHeight(maxHeight);
            }}
            title="Drag or use arrow keys to resize editor"
          >
            Drag to resize
          </span>
        </div>
      )}
    </div>
  );
}
