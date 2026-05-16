"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  text: string;
}

/**
 * Renders Claude's markdown output with gold-emphasized strong text,
 * Serif headings, and mono code/Greek/Hebrew passages.
 *
 * Streaming-safe: incomplete `**` / fenced blocks degrade gracefully.
 */
export function MarkdownView({ text }: Props) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
