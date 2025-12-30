"use dom";
import "./styles.css";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect } from "react";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

// 1. Ye Plugin DB se aaye HTML ko Editor me load karega
function InitialValuePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value) {
      editor.update(() => {
        const root = $getRoot();
        // Sirf tab load karein agar editor khali ho
        if (root.getTextContentSize() === 0) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(value, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          root.clear();
          root.append(...nodes);
        }
      });
    }
  }, [value, editor]);

  return null;
}

const editorConfig = {
  namespace: "Expo-Lexical-Editor",
  nodes: [], // Agar Tables ya Lists use kar rahe ho to unke Nodes yaha dalna zaroori hai
  onError(error: Error) {
    console.error(error);
  },
  theme: ExampleTheme,
};

export default function Editor({
  setPlainText,
  value, // DB se aaya hua HTML string
  onChange,
}: {
  setPlainText: (val: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container ">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">Enter text...</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          {/* 2. Is Plugin ko yaha add karein */}
          <InitialValuePlugin value={value} />

          <OnChangePlugin
            onChange={(editorState, editor) => {
              editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                setPlainText(htmlString);
                if (onChange) onChange(htmlString);
              });
            }}
          />
          <HistoryPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
