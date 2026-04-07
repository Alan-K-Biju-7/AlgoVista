import { useEffect, useRef } from 'react';

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
const monacoCallbacks = [];

function loadMonaco(cb) {
  if (monacoLoaded) { cb(); return; }
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
      monacoCallbacks.forEach(fn => fn());
      monacoCallbacks.length = 0;
    });
  };
  script.onerror = (e) => console.error('Monaco failed to load', e);
  document.head.appendChild(script);
}

export default function CodeEditor({ value, onChange, language = 'javascript', height = '280px' }) {
  const containerRef = useRef(null);
  const editorRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    loadMonaco(() => {
      if (!containerRef.current || editorRef.current) return;
      editorRef.current = window.monaco.editor.create(containerRef.current, {
        value,
        language,
        theme: 'vs-dark',
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        folding: false,
        automaticLayout: true,
        padding: { top: 12 },
      });
      editorRef.current.onDidChangeModelContent(() => {
        onChange && onChange(editorRef.current.getValue());
      });
    });
    return () => { editorRef.current?.dispose(); editorRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  return (
    <div ref={containerRef} style={{
      height, width: '100%', borderRadius: '0.5rem',
      overflow: 'hidden', border: '1px solid var(--border-default)',
    }} />
  );
}
