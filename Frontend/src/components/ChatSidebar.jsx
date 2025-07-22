// src/components/ChatSidebar.jsx
import React, { useState } from "react";
import {
  Plus,
  MessageCircle,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
// import { Info } from "lucide-react";
import { ExternalLink } from "lucide-react";

const ChatSidebar = ({
  conversations = [],
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation();
    onDeleteConversation(conversationId);
    setActiveDropdown(null);
  };

  const toggleDropdown = (e, conversationId) => {
    e.stopPropagation();
    setActiveDropdown(
      activeDropdown === conversationId ? null : conversationId
    );
  };

  const formatDate = (date) => {
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

  return (
    <div
      className={`border-r flex flex-col transition-all duration-200 ${isCollapsed ? "w-16" : "w-80"
        } ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
    >
      {/* Fixed Header */}
      <div
        className={`p-4 border-b flex-shrink-0 ${isDark ? "border-gray-800" : "border-gray-200"
          }`}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2
              className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              Chats
            </h2>
          )}
          <button
            onClick={onToggleCollapse}
            className={`p-2 rounded-lg transition-colors ${isDark
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
              }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${isCollapsed ? "p-2" : "p-3"
            }`}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">New Chat</span>}
        </button>
      </div>

      {/* Scrollable Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isCollapsed ? (
          <div className="p-2 space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-2 rounded-lg transition-all duration-200 relative group ${currentConversationId === conversation.id
                  ? isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-blue-50 border border-blue-200"
                  : isDark
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-50"
                  }`}
                title={conversation.title}
              >
                <MessageCircle
                  className={`w-5 h-5 mx-auto ${isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                />
                {conversation.messageCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.length === 0 ? (
              <div
                className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`relative group rounded-lg transition-all duration-200 ${currentConversationId === conversation.id
                    ? isDark
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-blue-50 border border-blue-200"
                    : isDark
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className="w-full p-3 text-left flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"
                            }`}
                        >
                          {conversation.title}
                        </h3>
                        <span
                          className={`text-xs flex-shrink-0 ml-2 ${isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          {formatDate(conversation.lastMessageAt)}
                        </span>
                      </div>
                      {conversation.lastMessage && (
                        <p
                          className={`text-sm truncate mt-1 ${isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          {conversation.lastMessage}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                        >
                          {conversation.messageCount} messages
                        </span>
                        {conversation.messageCount > 0 && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleDropdown(e, conversation.id)}
                      className={`p-1 rounded transition-colors ${isDark
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-200 text-gray-500"
                        }`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === conversation.id && (
                      <div
                        className={`absolute right-0 top-8 border rounded-lg shadow-lg z-10 min-w-[120px] ${isDark
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                          }`}
                      >
                        <button
                          onClick={(e) => handleDeleteClick(e, conversation.id)}
                          className={`w-full px-3 py-2 text-left text-sm text-red-600 flex items-center gap-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-red-50"
                            }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Fixed Footer */}
      {!isCollapsed && (
        // <div
        //   className={`p-4 border-t flex-shrink-0 ${
        //     isDark ? "border-gray-800" : "border-gray-200"
        //   }`}
        // >
        //   <div
        //     className={`text-xs text-center ${
        //       isDark ? "text-gray-400" : "text-gray-500"
        //     }`}
        //   >
        //     {conversations.length} conversation
        //     {conversations.length !== 1 ? "s" : ""}
        //   </div>
        // </div>
        // </div>

        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center justify-center gap-2 text-sm font-medium p-4 border-t w-full ${isDark
              ? "border-gray-800 text-gray-300 hover:bg-gray-800"
              : "border-gray-200 text-gray-600 hover:bg-gray-100"
            } transition-colors`}
        >
          Go to Dashboard
          <ExternalLink className="w-4 h-4" />
        </button>

        // </div>
      )}
    </div>
  );
};

export default ChatSidebar;
