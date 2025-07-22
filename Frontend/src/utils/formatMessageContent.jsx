// FormatMessageContent.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const markdownComponents = {
  h1: (props) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
  h2: (props) => <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />,
  h3: (props) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,

  code: ({ inline, className, children, ...props }) => {
    return !inline ? (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto my-2">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-200 px-1 rounded" {...props}>
        {children}
      </code>
    );
  },

  table: (props) => (
    <div className="overflow-auto max-h-[400px] border border-gray-300 rounded-md my-4">
      <table
        className="w-full table-auto border-collapse text-sm text-left text-gray-800"
        {...props}
      />
    </div>
  ),
  thead: (props) => (
    <thead className=" v uppercase text-gray-600" {...props} />
  ),
  tr: (props) => <tr className="border" {...props} />,
  th: (props) => (
    <th className="px-4 py-2 font-semibold border whitespace-nowrap" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-2 border whitespace-nowrap" {...props} />
  ),

  ol: (props) => <ol className="list-decimal pl-6 my-2" {...props} />,
  ul: (props) => <ul className="list-disc pl-6 my-2" {...props} />,

  blockquote: (props) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4" {...props} />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  del: (props) => <del className="line-through" {...props} />,
  hr: () => <hr className="border-t border-gray-300 my-4" />,
};

export const FormatMessageContent = ({ content = "" }) => {
  // Auto-detect and unwrap markdown tables from code blocks
  const cleanedContent = content.replace(/```(?:markdown|md)?\n(\|.+?\|[\s\S]+?)```/g, (_, tableContent) => {
    return tableContent.trim();
  });

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {cleanedContent}
    </ReactMarkdown>
  );
};
