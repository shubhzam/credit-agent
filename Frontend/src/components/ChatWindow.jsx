import {
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { extractPlainText } from "../utils/index";
import { getMessageStyles } from "../styles/messageStyles";
import { FormatMessageContent } from "../utils/formatMessageContent";

const ChatWindow = ({
  messages = [],
  isLoading = false,
  onRetry,
  onFeedback,
  currentConversationId,
}) => {
  const messagesEndRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = async (content, messageId) => {
    try {
      const plainText = extractPlainText(content);
      await navigator.clipboard.writeText(plainText);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const formatTimestamp = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const messageStyles = getMessageStyles(isDark);

  return (
    <>
      <style>{messageStyles}</style>
      <div
        className={`flex-1 overflow-y-auto p-4 ${isDark ? "bg-gray-900" : "bg-gray-50"
          }`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {message.type === "bot" && (
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isError
                    ? "bg-gradient-to-br from-red-500 to-red-600"
                    : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}
                >
                  {message.isError ? (
                    <AlertCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
              )}

              <div
                className={`group w-fit h-fit overflow-y-auto 
                  ${message.type === "user" ? "order-first" : ""
                  }`}
              >

                <div
                  className={`px-4 py-3 rounded-2xl w-fit shadow-sm ${message.type === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-auto"
                    : message.isError
                      ? isDark
                        ? "bg-red-900/20 text-red-300 border border-red-800"
                        : "bg-red-50 text-red-900 border border-red-200"
                      : isDark
                        ? "bg-gray-800 text-gray-100 border border-gray-700"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                >
                  <FormatMessageContent content={message.content} />
                </div>

                <div
                  className={`flex items-center gap-2 mt-1 px-2 ${message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </span>

                  {message.type === "bot" && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className={`p-1 rounded transition-colors ${isDark
                          ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                          }`}
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {message.isError ? (
                        <button
                          onClick={() => onRetry?.(message.id)}
                          className={`p-1 rounded transition-colors ${isDark
                            ? "hover:bg-gray-700 text-gray-400 hover:text-blue-400"
                            : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                            }`}
                          title="Retry"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onFeedback?.(message.id, "up")}
                            className={`p-1 rounded transition-colors ${isDark
                              ? "hover:bg-gray-700 text-gray-400 hover:text-green-400"
                              : "hover:bg-gray-100 text-gray-500 hover:text-green-600"
                              }`}
                            title="Good response"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onFeedback?.(message.id, "down")}
                            className={`p-1 rounded transition-colors ${isDark
                              ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                              : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
                              }`}
                            title="Bad response"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onRetry?.(message.id)}
                            className={`p-1 rounded transition-colors ${isDark
                              ? "hover:bg-gray-700 text-gray-400 hover:text-blue-400"
                              : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                              }`}
                            title="Retry"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {message.type === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div
                className={`border rounded-2xl px-4 py-3 shadow-sm ${isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {copiedMessageId && (
            <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 animate-in slide-in-from-right">
              Message copied to clipboard!
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
