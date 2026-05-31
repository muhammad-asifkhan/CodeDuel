import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";

const MONACO_LANG_MAP = {
  python: "python",
  javascript: "javascript",
  cpp: "cpp"
};

export default function CodeEditor({ language, code, onChange, disabled }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !disabled) {
      editorRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="flex-1">
      <Editor
        height="100%"
        language={MONACO_LANG_MAP[language]}
        value={code}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        onMount={(editor) => {
          editorRef.current = editor;
          editor.focus();
        }}
        options={{
          fontSize: 15,
          fontFamily: "JetBrains Mono, monospace",
          minimap: { enabled: false },
          padding: { top: 16 },
          lineNumbers: "on",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: "on",
          readOnly: disabled,
          suggest: {
            showMethods: true,
            showFunctions: true,
            showVariables: true,
            showKeywords: true
          },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6
          }
        }}
      />
    </div>
  );
}