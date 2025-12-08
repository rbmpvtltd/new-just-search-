"use dom";

import "./styles.css";
export default function Preview({ html }: { html: string }) {
  return (
    <div className="preview-w-full">
      <div
        className="editor-preview w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
