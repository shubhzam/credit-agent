import React, { useState, useEffect, useRef } from 'react';

// Custom SVG icon components
const MenuIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width || "24"} 
    height={props.height || "24"} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
);

const MessageSquareIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width || "24"} 
    height={props.height || "24"} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const PlusIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width || "24"} 
    height={props.height || "24"} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <line x1="12" x2="12" y1="5" y2="19"></line>
    <line x1="5" x2="19" y1="12" y2="12"></line>
  </svg>
);

const TrashIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width || "24"} 
    height={props.height || "24"} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const SendIcon = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.width || "24"} 
    height={props.height || "24"} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

// Mock API calls - replace with actual API calls
const mockApi = {
  getSessions: () => 
    new Promise(resolve => setTimeout(() => resolve([
      { id: '1', createdAt: new Date().toISOString(), preview: 'Help me with a React component' },
      { id: '2', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), preview: 'Explain quantum computing' },
      { id: '3', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), preview: 'Write a poem about coding' },
    ]), 500)),
  
  getMessages: (sessionId) => 
    new Promise(resolve => setTimeout(() => resolve([
      { text: sessionId === '1' ? 'Help me with a React component' : 
             sessionId === '2' ? 'Explain quantum computing' : 
             'Write a poem about coding', 
        sender: 'user', 
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() 
      },
      { text: sessionId === '1' ? 
          "Here's a simple React counter component:\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```\n\nThis component uses the `useState` hook to maintain count state." : 
          sessionId === '2' ? 
          "Quantum computing leverages quantum mechanics principles like superposition and entanglement. Unlike classical bits (0 or 1), quantum bits or 'qubits' can exist in multiple states simultaneously, enabling certain computations to be performed exponentially faster than classical computers. This is particularly useful for cryptography, optimization problems, and simulating quantum systems." :
          "# Code's Poetry\n\nIn lines of logic, beauty flows,\nFrom curly braces, art grows.\nFunctions dance in silent grace,\nAlgorithms finding their place.\n\nBugs lurk in shadows deep,\nErrors that make developers weep.\nYet when the program runs just right,\nThe screen glows with pure delight.\n\nA digital sonnet, carefully made,\nIn loops and conditions, carefully laid.\nThe poetry of our modern age,\nWritten on a virtual page.", 
        sender: 'ai', 
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString() 
      },
    ]), 600)),
  
  createSession: () => 
    new Promise(resolve => setTimeout(() => resolve({ 
      id: Math.random().toString(36).substring(2, 15), 
      createdAt: new Date().toISOString(),
      preview: ''
    }), 300)),
  
  deleteSession: (id) => 
    new Promise(resolve => setTimeout(() => resolve({ success: true }), 300)),
  
  sendMessage: (sessionId, message) => 
    new Promise(resolve => setTimeout(() => resolve({ 
      text: `I'm responding to: "${message.substring(0, 20)}${message.length > 20 ? '...' : ''}"`, 
      sender: 'ai',
      timestamp: new Date().toISOString() 
    }), 1500))
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else if ((now - date) / (1000 * 60 * 60 * 24) < 7) {
    return 'Previous 7 Days';
  } else {
    return 'Older';
  }
}

function ChatSession({ session, onSelect, onDelete, isActive }) {
  return (
    <div 
      className={`flex items-center p-3 rounded-md cursor-pointer group ${
        isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 text-gray-300'
      }`}
      onClick={() => onSelect(session.id)}
    >
      <MessageSquareIcon className="w-4 h-4 mr-3" width="16" height="16" />
      <div className="flex-1 truncate text-sm">
        {session.preview || 'New conversation'}
      </div>
      <button 
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded"
        onClick={(e) => { 
          e.stopPropagation();
          onDelete(session.id);
        }}
      >
        <TrashIcon className="w-4 h-4" width="16" height="16" />
      </button>
    </div>
  );
}

function Sidebar({ sessions, activeSessions, onSelectSession, onDeleteSession, onNewChat, isSidebarOpen }) {
  // Group sessions by date
  const groupedSessions = {};
  sessions.forEach(session => {
    const dateGroup = formatDate(session.createdAt);
    if (!groupedSessions[dateGroup]) {
      groupedSessions[dateGroup] = [];
    }
    groupedSessions[dateGroup].push(session);
  });

  // Sort date groups
  const dateGroups = Object.keys(groupedSessions);
  const sortOrder = { 'Today': 0, 'Yesterday': 1, 'Previous 7 Days': 2, 'Older': 3 };
  dateGroups.sort((a, b) => sortOrder[a] - sortOrder[b]);

  return (
    <aside className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex flex-col bg-gray-900 w-64 h-full transition-all duration-300`}>
      <div className="p-3">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-md text-white"
        >
          <PlusIcon className="w-4 h-4" width="16" height="16" />
          <span>New chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {dateGroups.map(dateGroup => (
          <div key={dateGroup} className="mb-4">
            <h3 className="text-xs uppercase text-gray-500 mb-2 px-3">{dateGroup}</h3>
            <div className="space-y-1">
              {groupedSessions[dateGroup].map(session => (
                <ChatSession 
                  key={session.id}
                  session={session}
                  isActive={activeSessions === session.id}
                  onSelect={onSelectSession}
                  onDelete={onDeleteSession}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-800">
        <div className="text-xs text-gray-500 p-2">
          MyGPT - Apr 2025
        </div>
      </div>
    </aside>
  );
}

function MarkdownRenderer({ text }) {
  // Very simple markdown renderer (code blocks and inline code)
  const formattedText = text.split('\n').map((line, i) => {
    // Handle code blocks
    if (line.startsWith('```')) {
      return null; // Skip opening fence
    }
    if (line.endsWith('```')) {
      return null; // Skip closing fence
    }
    
    // Handle inline code (very simple version)
    const parts = line.split('`');
    if (parts.length > 1) {
      return (
        <p key={i} className="mb-4">
          {parts.map((part, j) => 
            j % 2 === 0 ? 
              part : 
              <code key={j} className="bg-gray-800 px-1 py-0.5 rounded text-sm">{part}</code>
          )}
        </p>
      );
    }
    
    // Handle heading
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-xl font-bold mb-4">{line.substring(2)}</h1>;
    }
    
    // Regular text
    return <p key={i} className="mb-4">{line}</p>;
  });

  // Extract code blocks
  const codeBlocks = [];
  let inCodeBlock = false;
  let currentBlock = '';
  let language = '';
  
  text.split('\n').forEach(line => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        codeBlocks.push({ code: currentBlock, language });
        currentBlock = '';
        inCodeBlock = false;
      } else {
        language = line.substring(3).trim(); // Extract language
        inCodeBlock = true;
      }
    } else if (inCodeBlock) {
      currentBlock += line + '\n';
    }
  });

  return (
    <>
      {formattedText}
      {codeBlocks.map((block, i) => (
        <div key={`code-${i}`} className="bg-gray-800 rounded-md p-4 mb-4 overflow-x-auto">
          <div className="text-xs text-gray-400 mb-2">{block.language}</div>
          <pre className="text-sm">
            <code>{block.code}</code>
          </pre>
        </div>
      ))}
    </>
  );
}

function ChatMessage({ message }) {
  return (
    <div className={`py-5 ${message.sender === 'ai' ? 'bg-gray-800' : ''}`}>
      <div className="max-w-3xl mx-auto flex">
        <div className={`w-8 h-8 rounded-full mr-4 flex-shrink-0 ${
          message.sender === 'ai' ? 'bg-green-600' : 'bg-blue-600'
        } flex items-center justify-center text-xs font-bold text-white`}>
          {message.sender === 'ai' ? 'AI' : 'U'}
        </div>
        <div className="flex-1 text-gray-300">
          <MarkdownRenderer text={message.text} />
        </div>
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="py-5 bg-gray-800">
      <div className="max-w-3xl mx-auto flex">
        <div className="w-8 h-8 rounded-full mr-4 flex-shrink-0 bg-green-600 flex items-center justify-center text-xs font-bold text-white">
          AI
        </div>
        <div className="flex-1 text-gray-300">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-6">
        <MessageSquareIcon className="w-8 h-8 text-gray-400" width="32" height="32" />
      </div>
      <h2 className="text-2xl font-bold text-gray-200 mb-2">How can I help you today?</h2>
      <p className="text-gray-400 mb-6 max-w-md">
        Ask me anything, from creative writing to complex technical questions.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
        {[
          "Explain quantum computing",
          "Write a short story about AI",
          "How do I create a React component?",
          "What's the difference between REST and GraphQL?"
        ].map((example, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-md hover:bg-gray-700 cursor-pointer text-gray-300 text-sm">
            {example}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeSession, setActiveSession] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // Load sessions on initial render
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await mockApi.getSessions();
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };
    
    fetchSessions();
  }, []);

  // Handle window resize for sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current && activeSession) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activeSession, isLoading]);

  // Load messages when active session changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeSession) return;
      
      if (!messages[activeSession]) {
        try {
          const data = await mockApi.getMessages(activeSession);
          setMessages(prev => ({
            ...prev,
            [activeSession]: data
          }));
        } catch (error) {
          console.error(`Failed to load messages for session ${activeSession}:`, error);
          setMessages(prev => ({
            ...prev,
            [activeSession]: [{
              text: "Sorry, I couldn't load the messages for this conversation.",
              sender: 'ai',
              timestamp: new Date().toISOString()
            }]
          }));
        }
      }
    };
    
    loadMessages();
  }, [activeSession, messages]);

  const handleCreateSession = async () => {
    try {
      const newSession = await mockApi.createSession();
      setSessions(prev => [newSession, ...prev]);
      setActiveSession(newSession.id);
      setMessages(prev => ({
        ...prev,
        [newSession.id]: []
      }));
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await mockApi.deleteSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      if (activeSession === sessionId) {
        setActiveSession(null);
      }
      
      // Remove messages for deleted session
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[sessionId];
        return newMessages;
      });
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    let currentSessionId = activeSession;
    
    // Create a new session if none is active
    if (!currentSessionId) {
      try {
        const newSession = await mockApi.createSession();
        setSessions(prev => [newSession, ...prev]);
        currentSessionId = newSession.id;
        setActiveSession(newSession.id);
        setMessages(prev => ({
          ...prev,
          [newSession.id]: []
        }));
      } catch (error) {
        console.error('Failed to create new session:', error);
        return;
      }
    }
    
    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Update session preview
    setSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, preview: inputValue.substring(0, 25) } 
          : session
      )
    );
    
    // Add user message to the conversation
    setMessages(prev => ({
      ...prev,
      [currentSessionId]: [...(prev[currentSessionId] || []), userMessage]
    }));
    
    setInputValue('');
    setIsLoading(true);
    
    try {
      const aiResponse = await mockApi.sendMessage(currentSessionId, inputValue);
      
      setMessages(prev => ({
        ...prev,
        [currentSessionId]: [...(prev[currentSessionId] || []), aiResponse]
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      setMessages(prev => ({
        ...prev,
        [currentSessionId]: [
          ...(prev[currentSessionId] || []),
          {
            text: "I'm sorry, I encountered an error processing your request. Please try again.",
            sender: 'ai',
            timestamp: new Date().toISOString()
          }
        ]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar 
        sessions={sessions}
        activeSessions={activeSession}
        onSelectSession={setActiveSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleCreateSession}
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-gray-700 flex items-center px-4">
          <button 
            className="p-1 mr-4 rounded hover:bg-gray-700 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="w-6 h-6" width="24" height="24" />
          </button>
          
          <h1 className="font-bold">MyGPT</h1>
          
          <div className="flex-1"></div>
          
          <button 
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
            onClick={handleCreateSession}
          >
            <PlusIcon className="w-5 h-5" width="20" height="20" />
            <span className="hidden md:inline">New chat</span>
          </button>
        </header>
        
        {/* Message pane */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {activeSession && messages[activeSession] ? (
            <>
              {messages[activeSession].map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && <LoadingIndicator />}
            </>
          ) : (
            <EmptyState />
          )}
        </div>
        
        {/* Input area */}
        <div className="border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message MyGPT..."
              className="w-full bg-gray-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
              disabled={isLoading}
            />
            
            <button 
              className={`absolute right-3 bottom-3 p-1 rounded ${
                inputValue.trim() && !isLoading 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <SendIcon className="w-5 h-5" width="20" height="20" />
            </button>
            
            {!isLoading && (
              <div className="text-xs text-gray-400 mt-2 text-center">
                Press Enter to send
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;