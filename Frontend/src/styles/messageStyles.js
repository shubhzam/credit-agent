export const getMessageStyles = (isDark) => `
  .formatted-message {
    word-wrap: break-word;
    line-height: 1.6;
  }
  
  .formatted-message h1, .formatted-message h2, .formatted-message h3 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .formatted-message h1 { 
    font-size: 1.25rem; 
    color: ${isDark ? "#f9fafb" : "#111827"};
  }
  
  .formatted-message h2 { 
    font-size: 1.125rem; 
    color: ${isDark ? "#f3f4f6" : "#1f2937"};
  }
  
  .formatted-message h3 { 
    font-size: 1rem; 
    color: ${isDark ? "#e5e7eb" : "#374151"};
  }
  
  .formatted-message .bullet-list, .formatted-message .numbered-list {
    margin: 0.75rem 0;
    padding-left: 1.5rem;
  }
  
  .formatted-message .bullet-list {
    list-style-type: disc;
  }
  
  .formatted-message .numbered-list {
    list-style-type: decimal;
  }
  
  .formatted-message .bullet-list-item, .formatted-message .numbered-list-item {
    margin: 0.25rem 0;
    line-height: 1.5;
    color: ${isDark ? "#d1d5db" : "#4b5563"};
  }
  
  .formatted-message .inline-code {
    background-color: ${
      isDark ? "rgba(55, 65, 81, 0.8)" : "rgba(243, 244, 246, 1)"
    };
    color: ${isDark ? "#f87171" : "#dc2626"};
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875em;
    border: 1px solid ${
      isDark ? "rgba(75, 85, 99, 0.5)" : "rgba(229, 231, 235, 0.8)"
    };
  }
  
  .formatted-message pre {
    background-color: ${
      isDark ? "rgba(31, 41, 55, 1)" : "rgba(249, 250, 251, 1)"
    };
    border: 1px solid ${
      isDark ? "rgba(75, 85, 99, 1)" : "rgba(229, 231, 235, 1)"
    };
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 0.75rem 0;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.4;
    box-shadow: ${
      isDark ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
    };
  }
  
  .formatted-message pre code {
    color: ${isDark ? "#e5e7eb" : "#374151"};
    background: none;
    padding: 0;
    border-radius: 0;
    border: none;
    font-size: inherit;
  }
  
  .formatted-message code {
    color: ${isDark ? "#e5e7eb" : "#374151"};
  }
  
  .formatted-message .markdown-table {
    border-collapse: collapse;
    margin: 0.75rem 0;
    width: 100%;
    border: 1px solid ${
      isDark ? "rgba(75, 85, 99, 1)" : "rgba(229, 231, 235, 1)"
    };
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: ${
      isDark ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
    };
  }
  
  .formatted-message .markdown-table th,
  .formatted-message .markdown-table td {
    border: 1px solid ${
      isDark ? "rgba(75, 85, 99, 1)" : "rgba(229, 231, 235, 1)"
    };
    padding: 0.5rem 0.75rem;
    text-align: left;
    vertical-align: top;
  }
  
  .formatted-message .markdown-table th {
    background-color: ${
      isDark ? "rgba(55, 65, 81, 1)" : "rgba(249, 250, 251, 1)"
    };
    font-weight: 600;
    color: ${isDark ? "#f9fafb" : "#111827"};
    border-bottom: 2px solid ${
      isDark ? "rgba(75, 85, 99, 1)" : "rgba(209, 213, 219, 1)"
    };
  }
  
  .formatted-message .markdown-table td {
    color: ${isDark ? "#d1d5db" : "#374151"};
  }
  
  .formatted-message .markdown-table tr:nth-child(even) {
    background-color: ${
      isDark ? "rgba(31, 41, 55, 0.5)" : "rgba(249, 250, 251, 0.5)"
    };
  }
  
  .formatted-message .markdown-table tr:hover {
    background-color: ${
      isDark ? "rgba(55, 65, 81, 0.3)" : "rgba(243, 244, 246, 0.7)"
    };
  }
  
  .formatted-message blockquote {
    border-left: 4px solid ${
      isDark ? "rgba(99, 102, 241, 0.8)" : "rgba(99, 102, 241, 0.6)"
    };
    background-color: ${
      isDark ? "rgba(55, 65, 81, 0.3)" : "rgba(249, 250, 251, 0.8)"
    };
    margin: 0.75rem 0;
    padding: 0.75rem 1rem;
    border-radius: 0 0.375rem 0.375rem 0;
    font-style: italic;
    color: ${isDark ? "rgba(156, 163, 175, 1)" : "rgba(107, 114, 128, 1)"};
  }
  
  .formatted-message hr {
    border: none;
    border-top: 2px solid ${
      isDark ? "rgba(75, 85, 99, 1)" : "rgba(229, 231, 235, 1)"
    };
    margin: 1.5rem 0;
    border-radius: 1px;
  }
  
  .formatted-message p {
    margin: 0.5rem 0;
    color: ${isDark ? "#e5e7eb" : "#374151"};
    line-height: 1.6;
  }
  
  .formatted-message p:first-child {
    margin-top: 0;
  }
  
  .formatted-message p:last-child {
    margin-bottom: 0;
  }
  
  .formatted-message strong {
    color: ${isDark ? "#f9fafb" : "#111827"};
    font-weight: 600;
  }
  
  .formatted-message em {
    color: ${isDark ? "#d1d5db" : "#4b5563"};
  }
  
  .formatted-message del {
    color: ${isDark ? "#9ca3af" : "#6b7280"};
    opacity: 0.7;
  }
  
  /* Scrollbar styling for code blocks */
  .formatted-message pre::-webkit-scrollbar {
    height: 6px;
  }
  
  .formatted-message pre::-webkit-scrollbar-track {
    background: ${isDark ? "rgba(17, 24, 39, 1)" : "rgba(243, 244, 246, 1)"};
    border-radius: 3px;
  }
  
  .formatted-message pre::-webkit-scrollbar-thumb {
    background: ${isDark ? "rgba(75, 85, 99, 1)" : "rgba(156, 163, 175, 1)"};
    border-radius: 3px;
  }
  
  .formatted-message pre::-webkit-scrollbar-thumb:hover {
    background: ${isDark ? "rgba(107, 114, 128, 1)" : "rgba(107, 114, 128, 1)"};
  }
  
  /* Link styling if needed in the future */
  .formatted-message a {
    color: ${isDark ? "#60a5fa" : "#2563eb"};
    text-decoration: underline;
    text-decoration-color: ${
      isDark ? "rgba(96, 165, 250, 0.5)" : "rgba(37, 99, 235, 0.5)"
    };
    transition: all 0.2s ease;
  }
  
  .formatted-message a:hover {
    color: ${isDark ? "#93c5fd" : "#1d4ed8"};
    text-decoration-color: ${
      isDark ? "rgba(147, 197, 253, 0.8)" : "rgba(29, 78, 216, 0.8)"
    };
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .formatted-message .markdown-table {
      font-size: 0.875rem;
    }
    
    .formatted-message .markdown-table th,
    .formatted-message .markdown-table td {
      padding: 0.375rem 0.5rem;
    }
    
    .formatted-message pre {
      font-size: 0.8125rem;
      padding: 0.75rem;
    }
    
    .formatted-message h1 { font-size: 1.125rem; }
    .formatted-message h2 { font-size: 1rem; }
    .formatted-message h3 { font-size: 0.9375rem; }
  }

`;
