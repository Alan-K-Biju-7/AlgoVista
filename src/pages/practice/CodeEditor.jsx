import { useEffect, useRef, useState } from 'react';

const MONACO_VS = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs';

// Fix cross-origin worker "Script error." by proxying workers as blobs
function setupMonacoWorkerProxy() {
  window.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId, label) {
      const workerSrc = `
        self.MonacoEnvironment = { baseUrl: '${MONACO_VS}/' };
        importScripts('${MONACO_VS}/base/worker/workerMain.js');
      `;
      const blob = new Blob([workerSrc], { type: 'application/javascript' });
      return URL.createObjectURL(blob);
    },
  };
}

let monacoLoaded = false;
let monacoLoading = false;
let monacoFailed = false;
const monacoCallbacks = [];

function loadMonaco(cb) {
  if (monacoLoaded) { cb(true); return; }
  if (monacoFailed) { cb(false); return; }
  monacoCallbacks.push(cb);
  if (monacoLoading) return;
  monacoLoading = true;

  setupMonacoWorkerProxy();

  const script = document.createElement('script');
  script.src = `${MONACO_VS}/loader.min.js`;
  script.onload = () => {
    window.require.config({ paths: { vs: MONACO_VS } });
    window.require(['vs/editor/editor.main'], () => {
      monacoLoaded = true;
      monacoCallbacks.forEach(fn => fn(true));
      monacoCallbacks.length = 0;
    });
  };
  script.onerror = (e) => {
    console.error('Monaco failed to load', e);
    monacoFailed = true;
    monacoLoading = false;
    monacoCallbacks.forEach(fn => fn(false));
    monacoCallbacks.length = 0;
  };
  document.head.appendChild(script);
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

export default function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  height = '280px',
  minHeight = 240,
  maxHeight = 820,
  storageKey,
  resizable = true,
}) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const fallbackRef = useRef(null);
  const defaultHeight = clampHeight(parseHeight(height), minHeight, maxHeight);
  const [editorHeight, setEditorHeight] = useState(() =>
    readStoredHeight(storageKey, defaultHeight, minHeight, maxHeight)
  );
  const [useFallback, setUseFallback] = useState(monacoFailed);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, defaultHeight, minHeight, maxHeight]);

  useEffect(() => {
    editorRef.current?.layout();
  }, [editorHeight]);

  useEffect(() => {
    if (!containerRef.current) return;
    let canceled = false;
    const fallbackTimer = setTimeout(() => {
      if (!editorRef.current && !monacoLoaded && !canceled) setUseFallback(true);
    }, 3000);

    loadMonaco((ok) => {
      if (canceled) return;
      clearTimeout(fallbackTimer);
      if (!ok) {
        setUseFallback(true);
        return;
      }
      if (!containerRef.current || editorRef.current || useFallback) return;
      editorRef.current = window.monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: 'vs-dark',
        fontSize: 13,
        minimap: { enabled: false },
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        folding: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        formatOnPaste: true,
        contextmenu: true,
        quickSuggestions: { other: true, comments: true, strings: true },
        comments: { insertSpace: true, ignoreEmptyLines: true },
        padding: { top: 12 },
      });
      editorRef.current.onDidChangeModelContent(() => {
        onChange && onChange(editorRef.current.getValue());
      });
    });
    return () => {
      canceled = true;
      clearTimeout(fallbackTimer);
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useFallback, language]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  const handleFallbackKeyDown = (event) => {
    const textarea = event.currentTarget;

    if (event.key === 'Tab') {
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
        {useFallback ? (
          <textarea
            ref={fallbackRef}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={handleFallbackKeyDown}
            spellCheck={false}
            aria-label={`${language} code editor`}
            className="code-editor-fallback"
          />
        ) : (
          <div ref={containerRef} className="code-editor-monaco" />
        )}
      </div>
      {resizable && (
        <div className="code-editor-resizebar">
          <button type="button" onClick={() => updateHeight(minHeight)}>
            Compact
          </button>
          <button type="button" onClick={() => updateHeight(defaultHeight)}>
            Reset
          </button>
          <button type="button" onClick={() => updateHeight(maxHeight)}>
            Tall
          </button>
          <span
            role="separator"
            aria-orientation="horizontal"
            className="code-editor-drag-handle"
            onPointerDown={startResize}
            title="Drag to resize editor"
          >
            Resize
          </span>
        </div>
      )}
    </div>
  );
}
