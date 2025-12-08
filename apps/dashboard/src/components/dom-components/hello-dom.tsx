"use client";
import "./styles.css";

import { CodeHighlightNode } from "@lexical/code";
// Lexical Plugin Imports
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

// Node Imports (from their correct packages)
import {
  // CodeNode,
  // HeadingNode,
  // ListItemNode,
  // ListNode,
  QuoteNode,
} from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
// Core Lexical Imports
import {
  $createParagraphNode,
  $getRoot,
  type EditorState,
  type LexicalEditor,
  ParagraphNode,
  TextNode,
} from "lexical";
import { useLayoutEffect, useRef } from "react";

// Custom Imports
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

const placeholder = "Enter some rich text...";

// Define the custom map for cleaner HTML output (strips Lexical's internal attributes)
const CUSTOM_NODES_TO_MARKUP = {
  [ParagraphNode.getType()]: (node: any, children: string) => `<p>${children}</p>`,
  // [HeadingNode.getType()]: (node, children) => {
  //   const tag = `h${node.__tag.slice(-1)}`; // e.g., 'h1' from 'h1'
  //   return `<${tag}>${children}</${tag}>`;
  // },
  // [QuoteNode.getType()]: (node, children) =>
  //   `<blockquote>${children}</blockquote>`,
  // [ListNode.getType()]: (node, children) => {
  //   const tag = node.__tag; // 'ul' or 'ol'
  //   return `<${tag}>${children}</${tag}>`;
  // },
  // [ListItemNode.getType()]: (node, children) => `<li>${children}</li>`,
  // [CodeNode.getType()]: (node, children) =>
  //   `<pre><code>${children}</code></pre>`,
};

interface EditorProps {
  setPlainText: (html: string) => void;
  value?: string;
  onChange?: (html: string) => void;
  onContentSizeChange?: (height: number) => void;
}

const editorConfig = {
  namespace: "React.js Demo",
  // ✅ Register ALL necessary nodes for rich text features and clean HTML generation
  nodes: [
    ParagraphNode,
    TextNode,
    // HeadingNode,
    // QuoteNode,
    // ListNode,
    // ListItemNode,
    // CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    LinkNode,
    AutoLinkNode,
  ],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

export default function Editor({
  setPlainText,
  value,
  onChange,
  onContentSizeChange,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const initialEditorState = (editor: LexicalEditor) => {
    // 1. If a value is provided, load it from HTML.
    if (value) {
      const root = $getRoot();
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      root.clear();
      root.append(...nodes);
    } else {
      // 2. If no value, initialize with a default empty paragraph.
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        root.append($createParagraphNode());
      });
    }
  };

  // Auto-resize logic (assuming onContentSizeChange is provided)
  useLayoutEffect(() => {
    if (!editorRef.current || !onContentSizeChange) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (editorRef.current) {
        onContentSizeChange(editorRef.current.offsetHeight);
      }
    });

    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    onContentSizeChange(editorRef.current.offsetHeight);
    return () => observer.disconnect();
  }, [onContentSizeChange]);

  return (
    <LexicalComposer
      initialConfig={{ ...editorConfig, editorState: initialEditorState }}
    >
      {/* The main editor container with fixed height from the parent FormField */}
      <div className="editor-container" ref={editorRef}>
        {/* Toolbar is placed outside the scrolling div and given position: sticky via CSS */}
        <div className="toolbar">
          <ToolbarPlugin />
        </div>

        {/* The content area made scrollable via CSS (overflow-y: auto) */}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState: EditorState, editor: LexicalEditor) => {
              editorState.read(() => {
                // Generate HTML using the custom map to get cleaner tags
                let htmlString = $generateHtmlFromNodes(
                  editor,
                  // CUSTOM_NODES_TO_MARKUP,
                );

                // Aggressive post-processing to strip ALL remaining Lexical classes/styles
                htmlString = htmlString
                  .replace(/ style="[^"]*"/g, "")
                  .replace(/ class="[^"]*"/g, "");

                setPlainText(htmlString);
                if (onChange) onChange(htmlString);
              });
            }}
            ignoreHistoryMergeTagChange
            ignoreSelectionChange
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}