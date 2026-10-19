import React from "react";
import { balanceHtmlTags } from "@/lib/enterprises-types";

interface ArticleContentRendererProps {
  content?: string;
  className?: string;
}

// Parses inline markdown: **bold**, *italic*, [text](url)
function renderInlineText(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, and [text](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 underline font-semibold hover:text-red-700"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function ArticleContentRenderer({
  content = "",
  className = "",
}: ArticleContentRendererProps) {
  if (!content) return null;

  // If content contains HTML tags (e.g. from rich editor, Word/PDF converter, or crawler), render directly as HTML
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  if (hasHtml) {
    return (
      <div
        className={`article-rendered-content article-full-text enterprise-content ${className}`}
        style={{
          lineHeight: 1.8,
          fontSize: "16px",
          color: "#1e293b",
        }}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: balanceHtmlTags(content) }}
      />
    );
  }

  // Split content by alignment tags or double newlines
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`article-rendered-content ${className}`}>
      {blocks.map((rawBlock, blockIdx) => {
        const block = rawBlock.trim();
        if (!block) return null;

        // Alignment blocks: [center]...[/center]
        if (block.startsWith("[center]") && block.endsWith("[/center]")) {
          const inner = block.slice(8, -9).trim();
          return (
            <div
              key={blockIdx}
              className="article-align-center"
              style={{ textAlign: "center", margin: "20px 0" }}
            >
              {renderInlineText(inner)}
            </div>
          );
        }

        // Alignment blocks: [right]...[/right]
        if (block.startsWith("[right]") && block.endsWith("[/right]")) {
          const inner = block.slice(7, -8).trim();
          return (
            <div
              key={blockIdx}
              className="article-align-right"
              style={{ textAlign: "right", margin: "20px 0", color: "#64748b" }}
            >
              {renderInlineText(inner)}
            </div>
          );
        }

        // Alignment blocks: [justify]...[/justify]
        if (block.startsWith("[justify]") && block.endsWith("[/justify]")) {
          const inner = block.slice(9, -10).trim();
          return (
            <p
              key={blockIdx}
              className="article-align-justify"
              style={{ textAlign: "justify", lineHeight: "1.8", margin: "16px 0" }}
            >
              {renderInlineText(inner)}
            </p>
          );
        }

        // Image block: ![Alt text](url)
        const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          const altText = imgMatch[1];
          const imgUrl = imgMatch[2];
          return (
            <figure key={blockIdx} className="article-figure-block">
              <img src={imgUrl} alt={altText || "Ảnh minh họa"} loading="lazy" />
              {altText && <figcaption>{altText}</figcaption>}
            </figure>
          );
        }

        // Heading 2: ## ...
        if (block.startsWith("## ")) {
          return (
            <h2 key={blockIdx} className="article-subheading-h2">
              {block.slice(3)}
            </h2>
          );
        }

        // Heading 3: ### ...
        if (block.startsWith("### ")) {
          return (
            <h3 key={blockIdx} className="article-subheading-h3">
              {block.slice(4)}
            </h3>
          );
        }

        // Blockquote: > ...
        if (block.startsWith("> ")) {
          const quoteLines = block
            .split("\n")
            .map((l) => l.replace(/^>\s*/, ""))
            .join(" ");
          return (
            <blockquote key={blockIdx} className="article-featured-quote">
              <p>“{renderInlineText(quoteLines)}”</p>
            </blockquote>
          );
        }

        // Unordered list: - item or * item
        if (block.startsWith("- ") || block.startsWith("* ")) {
          const items = block
            .split("\n")
            .filter((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))
            .map((l) => l.trim().slice(2));
          return (
            <ul key={blockIdx} className="article-content-list">
              {items.map((item, i) => (
                <li key={i}>{renderInlineText(item)}</li>
              ))}
            </ul>
          );
        }

        // Default Paragraph (justified by default for journalistic style)
        return (
          <p key={blockIdx} className="article-paragraph">
            {renderInlineText(block)}
          </p>
        );
      })}
    </div>
  );
}
