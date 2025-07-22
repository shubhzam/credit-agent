// src/pages/ChatInterface.jsx
import React, { useState, useEffect, useCallback } from "react";
import IdolizeSolutionImage from "../assets/IdolizeSolutionImage.png";

import { Moon, Sun } from "lucide-react";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import ChatSidebar from "../components/ChatSidebar";
import { useTheme } from "../contexts/ThemeContext";
import { generateConversationTitle, generateUUID } from "../utils/index";
import { apiService } from "../services/api";

const ChatInterface = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  // Initialize with a default conversation and call reset API
  useEffect(() => {
    const initializeChat = async () => {
      // Call reset API on initial load
      try {
        const resetResponse = await apiService.resetChatState();
        if (resetResponse.success) {
          console.log(
            "Chat state reset successfully on initial load:",
            resetResponse.status
          );
        } else {
          console.error(
            "Failed to reset chat state on initial load:",
            resetResponse.error
          );
        }
      } catch (error) {
        console.error("Error calling reset API on initial load:", error);
      }

      // Create default conversation
      const defaultConversation = {
        id: generateUUID(),
        title: "New Chat",
        messages: [],
        lastMessage: null,
        lastMessageAt: new Date(),
        messageCount: 0,
        createdAt: new Date(),
      };

      setConversations([defaultConversation]);
      setCurrentConversationId(defaultConversation.id);
    };

    initializeChat();
  }, []);

  // Get current conversation
  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  // Update messages when current conversation changes
  useEffect(() => {
    if (currentConversation) {
      setMessages(currentConversation.messages);
    }
  }, [currentConversation]);

  // Save messages to current conversation
  const saveMessagesToConversation = useCallback(
    (conversationId, newMessages) => {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id === conversationId) {
            const lastMessage = newMessages[newMessages.length - 1];
            const title =
              newMessages.length === 1
                ? generateConversationTitle(newMessages[0].content)
                : conversation.title;

            return {
              ...conversation,
              messages: newMessages,
              lastMessage: lastMessage?.content || null,
              lastMessageAt: lastMessage?.timestamp || new Date(),
              messageCount: newMessages.length,
              title: title,
            };
          }
          return conversation;
        })
      );
    },
    []
  );

  const handleSendMessage = async (message) => {
    if (!currentConversationId) return;

    // Clear any previous errors
    setError(null);

    const newMessage = {
      id: generateUUID(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveMessagesToConversation(currentConversationId, updatedMessages);
    setIsLoading(true);

    try {
      // Call the actual API
      const response = await apiService.sendUserQuery(
        currentConversationId,
        message
      );

      if (response.success) {
        // Check if response has the expected message field
        const responseMessage =
          response.data?.mesaage || response.data?.message;

        if (responseMessage) {
          const botMessage = {
            id: generateUUID(),
            type: "bot",
            content: responseMessage,
            timestamp: new Date(),
          };

          const finalMessages = [...updatedMessages, botMessage];
          setMessages(finalMessages);
          saveMessagesToConversation(currentConversationId, finalMessages);
        } else {
          throw new Error("Invalid response format: missing message field");
        }
      } else {
        // Handle API errors
        const errorMessage =
          response.error || "Failed to get response from server";
        const errorBotMessage = {
          id: generateUUID(),
          type: "bot",
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
          isError: true,
        };

        const finalMessages = [...updatedMessages, errorBotMessage];
        setMessages(finalMessages);
        saveMessagesToConversation(currentConversationId, finalMessages);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorBotMessage = {
        id: generateUUID(),
        type: "bot",
        content: `Sorry, I'm having trouble connecting to the server. Please check your connection and try again.`,
        timestamp: new Date(),
        isError: true,
      };

      const finalMessages = [...updatedMessages, errorBotMessage];
      setMessages(finalMessages);
      saveMessagesToConversation(currentConversationId, finalMessages);
      setError("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (messageId) => {
    // Find the message to retry
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    // Find the user message that preceded this bot message
    let userMessage = null;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        userMessage = messages[i];
        break;
      }
    }

    if (!userMessage) return;

    // Remove the failed bot message and retry
    const updatedMessages = messages.slice(0, messageIndex);
    setMessages(updatedMessages);
    saveMessagesToConversation(currentConversationId, updatedMessages);

    // Resend the user message
    await handleSendMessage(userMessage.content);
  };

  const handleFeedback = (messageId, type) => {
    console.log("Feedback:", messageId, type);
    // TODO: Implement feedback logic - could send to analytics API
  };

  const handleNewChat = async () => {
    try {
      // Call the reset API
      const resetResponse = await apiService.resetChatState();

      if (resetResponse.success) {
        console.log("Chat state reset successfully:", resetResponse.status);
      } else {
        console.error("Failed to reset chat state:", resetResponse.error);
        // Continue with creating new chat even if API call fails
      }
    } catch (error) {
      console.error("Error calling reset API:", error);
      // Continue with creating new chat even if API call fails
    }

    // Create new conversation regardless of API call result
    const newConversation = {
      id: generateUUID(),
      title: "New Chat",
      messages: [],
      lastMessage: null,
      lastMessageAt: new Date(),
      messageCount: 0,
      createdAt: new Date(),
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);
    setError(null); // Clear any errors when starting new chat
  };

  const handleSelectConversation = (conversationId) => {
    setCurrentConversationId(conversationId);
    setError(null); // Clear errors when switching conversations
  };

  const handleDeleteConversation = (conversationId) => {
    setConversations((prev) => {
      const filtered = prev.filter((conv) => conv.id !== conversationId);

      // If deleting current conversation, select the first available one or create new
      if (conversationId === currentConversationId) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
        } else {
          // Create a new conversation if no conversations left
          const newConversation = {
            id: generateUUID(),
            title: "New Chat",
            messages: [],
            lastMessage: null,
            lastMessageAt: new Date(),
            messageCount: 0,
            createdAt: new Date(),
          };
          setCurrentConversationId(newConversation.id);
          return [newConversation];
        }
      }

      return filtered;
    });
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`h-screen flex ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar - Fixed */}
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Chat Area - Flexible */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Fixed Header */}
        <div
          className={`border-b px-4 sm:px-6 py-4 flex-shrink-0 ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex-shrink-0">
                {/* Adjust the size of the logo */}
                <img
                  src={IdolizeSolutionImage}
                  alt="Idolize Solution Logo"
                  className="w-60 h-15 object-contain" // Adjusted size
                />
              </div>
              {/* <div className="flex items-center gap-2">
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {currentConversation?.messageCount || 0} messages
                </p>
              </div> */}
              {error && (
                <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded">
                  Connection issue
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-800 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Chat Window */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onRetry={handleRetry}
          onFeedback={handleFeedback}
          currentConversationId={currentConversationId}
        />

        {/* Fixed Message Input */}
        <div className="flex-shrink-0">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
