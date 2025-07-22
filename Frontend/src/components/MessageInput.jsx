import React, { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const MessageInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);
  const { isDark } = useTheme();

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [message]);

  // Focus textarea when not disabled
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Limit message length to prevent very long messages
    if (value.length <= 4000) {
      setMessage(value);
    }
  };

  const canSend = message.trim() && !disabled;
  const isNearLimit = message.length > 3000;
  const isAtLimit = message.length >= 4000;

  return (
    <div
      className={`p-4 border-t ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative flex items-end gap-2 border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 focus-within:ring-2 ${
            isDark
              ? "bg-gray-800 border-gray-700 focus-within:border-gray-600 focus-within:ring-gray-600/20"
              : "bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-blue-500/20"
          } ${disabled ? "opacity-75" : ""}`}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={disabled ? "Please wait..." : placeholder}
            disabled={disabled}
            className={`flex-1 resize-none bg-transparent border-0 py-4 px-4 focus:outline-none focus:ring-0 min-h-[24px] max-h-[200px] leading-6 ${
              isDark
                ? "text-white placeholder-gray-400"
                : "text-gray-900 placeholder-gray-500"
            } ${disabled ? "cursor-not-allowed" : ""}`}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: isDark
                ? "#374151 transparent"
                : "#E5E7EB transparent",
            }}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`flex-shrink-0 p-3 m-2 rounded-full transition-all duration-200 ${
              canSend
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                : isDark
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title={disabled ? "Please wait..." : "Send Message"}
          >
            {disabled ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Message Info Bar */}
        {(message.length > 0 || disabled) && (
          <div
            className={`flex justify-between items-center mt-2 px-2 text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <div className="flex items-center gap-4">
              {isNearLimit && (
                <span
                  className={`${
                    isAtLimit ? "text-red-500" : "text-yellow-500"
                  }`}
                >
                  {message.length}/4000 characters
                  {isAtLimit && " (limit reached)"}
                </span>
              )}
              {disabled && (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending message...
                </span>
              )}
            </div>
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>
              {disabled
                ? "Please wait for response"
                : "Press Enter to send, Shift+Enter for new line"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
