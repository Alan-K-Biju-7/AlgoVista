import { useEffect, useRef } from 'react';

export default function CodeEditor({ value, onChange, language = 'javascript', height = '280px' }) {
  const containerRef = useRef(null);
  const editorRef    = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
    script.onload = () => {
      window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
      window.require(['vs/editor/editor.main'], () => {
        if (editorRef.current) return;
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
    };
    document.head.appendChild(script);
    return () => { editorRef.current?.dispose(); editorRef.current = null; };
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
