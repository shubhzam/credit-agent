// src/utils/index.js

// Utility function to generate UUID
export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);    
  });
};

// Utility function to generate conversation title from first message
export const generateConversationTitle = (message) => {
  if (!message) return "New Chat";
  const title =
    message.length > 50 ? message.substring(0, 50) + "..." : message;
  return title;
};

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date for conversation list
export const formatDate = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return messageDate.toLocaleDateString();
  }
};

// Enhanced format message content with comprehensive markdown support
export const formatMessageContent = (content) => {
  if (!content) return "";

  let formatted = content;

  // Handle code blocks first (to prevent interference with other formatting)
  formatted = formatted.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, language, code) => {
      const lang = language || "";
      return `<pre><code class="language-${lang}">${escapeHtml(
        code.trim()
      )}</code></pre>`;
    }
  );

  // Handle inline code
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  );

  // Handle tables (simple markdown table format)
  formatted = formatted.replace(
    /\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n?)*)/g,
    (match, header, rows) => {
      const headerCells = header
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
      const rowsArray = rows
        .trim()
        .split("\n")
        .map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell)
        );

      let table = '<table class="markdown-table"><thead><tr>';
      headerCells.forEach((cell) => {
        table += `<th>${cell}</th>`;
      });
      table += "</tr></thead><tbody>";

      rowsArray.forEach((row) => {
        table += "<tr>";
        row.forEach((cell) => {
          table += `<td>${cell}</td>`;
        });
        table += "</tr>";
      });
      table += "</tbody></table>";

      return table;
    }
  );

  // Handle headers
  formatted = formatted.replace(
    /^### (.*$)/gm,
    '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
  );
  formatted = formatted.replace(
    /^## (.*$)/gm,
    '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>'
  );
  formatted = formatted.replace(
    /^# (.*$)/gm,
    '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>'
  );

  // Handle numbered lists
  formatted = formatted.replace(
    /^\d+\.\s+(.*)$/gm,
    '<li class="numbered-list-item">$1</li>'
  );
  formatted = formatted.replace(
    /(<li class="numbered-list-item">.*<\/li>)/gs,
    '<ol class="numbered-list">$1</ol>'
  );

  // Handle bullet points and lists
  formatted = formatted.replace(
    /^[-•*]\s+(.*)$/gm,
    '<li class="bullet-list-item">$1</li>'
  );
  formatted = formatted.replace(
    /(<li class="bullet-list-item">.*<\/li>)/gs,
    '<ul class="bullet-list">$1</ul>'
  );

  // Handle bold text
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold">$1</strong>'
  );

  // Handle italic text
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Handle strikethrough
  formatted = formatted.replace(
    /~~(.*?)~~/g,
    '<del class="line-through">$1</del>'
  );

  // Handle blockquotes
  formatted = formatted.replace(
    /^>\s+(.*)$/gm,
    '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>'
  );

  // Handle horizontal rules
  formatted = formatted.replace(
    /^---$/gm,
    '<hr class="border-t border-gray-300 my-4">'
  );

  // Handle line breaks
  formatted = formatted.replace(/\n\n/g, "</p><p>");
  formatted = formatted.replace(/\n/g, "<br />");

  // Wrap in paragraph tags if not already wrapped
  if (
    !formatted.includes("<p>") &&
    !formatted.includes("<h1>") &&
    !formatted.includes("<h2>") &&
    !formatted.includes("<h3>")
  ) {
    formatted = `<p>${formatted}</p>`;
  }

  // Clean up multiple consecutive breaks
  formatted = formatted.replace(/(<br\s*\/?>){3,}/g, "<br /><br />");

  return formatted;
};

// Helper function to escape HTML
const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
};

// Extract plain text from formatted content (for copying)
export const extractPlainText = (htmlContent) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || "";
};
