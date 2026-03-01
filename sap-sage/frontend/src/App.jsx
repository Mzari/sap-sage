import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Database, Activity, Plus, MessageSquare, Copy, Check, Sun, Moon, Monitor, Settings, Menu, X, Trash2, Edit2, MoreVertical, RefreshCw } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import { ToastContainer } from './components/Toast';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState({});
  const [stats, setStats] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Theme state: 'light', 'dark', or 'system'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sap-sage-theme') || 'light';
  });

  // Theme color state: 'default', 'warm', 'cool', 'sage', 'deepblue', 'charcoal', 'purple', 'midnight'
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('sap-sage-theme-color') || 'default';
  });

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sap-sage-sidebar-collapsed') === 'true';
  });

  // Settings panel state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Message width setting
  const [messageWidth, setMessageWidth] = useState(() => {
    return localStorage.getItem('sap-sage-message-width') || 'default';
  });

  // Show avatars setting
  const [showAvatars, setShowAvatars] = useState(() => {
    return localStorage.getItem('sap-sage-show-avatars') !== 'false';
  });

  // Editing state for renaming
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Dropdown menu state
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = (themeValue, colorValue) => {
      if (themeValue === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', themeValue);
      }
      document.documentElement.setAttribute('data-theme-color', colorValue);
    };

    applyTheme(theme, themeColor);
    localStorage.setItem('sap-sage-theme', theme);
    localStorage.setItem('sap-sage-theme-color', themeColor);

    // Listen for system theme changes if using system preference
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system', themeColor);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, themeColor]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sap-sage-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  // Persist message width
  useEffect(() => {
    localStorage.setItem('sap-sage-message-width', messageWidth);
  }, [messageWidth]);

  // Persist show avatars
  useEffect(() => {
    localStorage.setItem('sap-sage-show-avatars', showAvatars);
  }, [showAvatars]);

  useEffect(() => {
    axios.get('/api/health')
      .then(res => setSystemStatus({ ...res.data, connected: true }))
      .catch(() => setSystemStatus({ connected: false }));

    axios.get('/api/stats')
      .then(res => setStats(res.data.data || res.data))
      .catch(err => console.error('Error loading stats:', err));
  }, []);

  useEffect(() => {
    axios.get('/api/conversations')
      .then(res => {
        const convos = res.data.data || res.data;
        setConversations(convos);
        if (convos.length > 0 && !currentConversation) {
          setCurrentConversation(convos[0]);
        }
      })
      .catch(err => console.error('Error loading conversations:', err));
  }, []);

  useEffect(() => {
    if (currentConversation) {
      axios.get(`/api/conversations/${currentConversation.id}/messages`)
        .then(res => setMessages(res.data.data || res.data))
        .catch(err => console.error('Error loading messages:', err));
    }
  }, [currentConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || !currentConversation || loading) return;

    setLoading(true);
    const userMessage = input;
    setInput('');

    // Optimistically add user message
    const tempUserMsg = {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
      temp_id: Date.now()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await axios.post('/api/messages', {
        conversation_id: currentConversation.id,
        content: userMessage
      }, {
        timeout: 60000 // 60 second timeout
      });

      // Remove temp message and add real messages
      const data = res.data.data || res.data;
      setMessages(prev => {
        const filtered = prev.filter(m => m.temp_id !== tempUserMsg.temp_id);
        return [...filtered, data.user_message, data.assistant_message];
      });

      // Update conversation title if it's the first message
      if (messages.length === 0) {
        const titlePreview = userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : '');
        setConversations(prev =>
          prev.map(conv =>
            conv.id === currentConversation.id
              ? { ...conv, title: titlePreview }
              : conv
          )
        );
      }
    } catch (err) {
      console.error('Error sending message:', err);

      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.temp_id !== tempUserMsg.temp_id));

      // Show error message
      const errorMsg = {
        role: 'assistant',
        content: `**Error sending message**\n\n${err.response?.data?.error || err.message || 'Network error. Please check your connection and try again.'}\n\n*You can retry by sending your message again.*`,
        created_at: new Date().toISOString(),
        is_error: true
      };
      setMessages(prev => [...prev, errorMsg]);

      // Restore input so user can retry
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createNewConversation = async () => {
    try {
      const res = await axios.post('/api/conversations', {
        title: 'New Conversation'
      });
      const newConv = res.data.data || res.data;
      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      setMessages([]);
      addToast('success', null, 'New conversation created', 2000);
    } catch (err) {
      console.error('Error creating conversation:', err);
      addToast('error', 'Failed to create conversation', err.message);
    }
  };

  // Toast utilities
  const addToast = (type, title, message, duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    addToast('success', null, 'Copied to clipboard', 2000);
  };

  const deleteConversation = async (id, event) => {
    event?.stopPropagation();
    setActiveDropdownId(null);

    const conversation = conversations.find(conv => conv.id === id);
    const confirmMsg = `Delete "${conversation?.title || 'this conversation'}"?\n\nThis action cannot be undone.`;

    if (window.confirm(confirmMsg)) {
      try {
        await axios.delete(`/api/conversations/${id}`);
        const updatedConvs = conversations.filter(conv => conv.id !== id);
        setConversations(updatedConvs);

        if (currentConversation?.id === id) {
          setCurrentConversation(updatedConvs.length > 0 ? updatedConvs[0] : null);
          setMessages([]);
        }
        addToast('success', null, 'Conversation deleted', 2000);
      } catch (err) {
        console.error('Error deleting conversation:', err);
        const fallbackConvs = conversations.filter(conv => conv.id !== id);
        setConversations(fallbackConvs);
        if (currentConversation?.id === id) {
          setCurrentConversation(fallbackConvs.length > 0 ? fallbackConvs[0] : null);
          setMessages([]);
        }
        addToast('error', 'Failed to delete conversation', err.message);
      }
    }
  };

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Group conversations by date
  const getGroupedConversations = () => {
    const groups = {
      'Today': [],
      'Yesterday': [],
      'Previous 7 Days': [],
      'Older': []
    };

    conversations.forEach(conv => {
      // Assuming conv.updatedAt or conv.createdAt exists, defaulting to Date.now() if missing for demo
      const date = new Date(conv.updatedAt || Date.now());
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) groups['Today'].push(conv);
      else if (diffDays === 1) groups['Yesterday'].push(conv);
      else if (diffDays <= 7) groups['Previous 7 Days'].push(conv);
      else groups['Older'].push(conv);
    });

    return groups;
  };

  const startEditing = (conv, event) => {
    event.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setActiveDropdownId(null);
  };

  const saveTitle = async (id, event) => {
    event.stopPropagation();
    try {
      // Optimistic update
      setConversations(conversations.map(conv =>
        conv.id === id ? { ...conv, title: editTitle } : conv
      ));
      setEditingId(null);
      // API call would go here - assuming endpoint exists or just local state for now
      // await axios.put(`/api/conversations/${id}`, { title: editTitle });
    } catch (err) {
      console.error('Error renaming conversation:', err);
    }
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      saveTitle(id, e);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const clearAllConversations = async () => {
    const count = conversations.length;
    const confirmMsg = `Delete all ${count} conversation${count !== 1 ? 's' : ''}?\n\nThis will permanently delete all your chat history and cannot be undone.`;

    if (window.confirm(confirmMsg)) {
      try {
        // In a production app, you'd call the API to delete all conversations
        // For now, clearing local state
        setConversations([]);
        setCurrentConversation(null);
        setMessages([]);
        addToast('success', null, 'All conversations cleared', 2000);
      } catch (err) {
        console.error('Error clearing conversations:', err);
        addToast('error', 'Failed to clear conversations', 'Please try again.');
      }
    }
  };

  const suggestionQuestions = [
    {
      category: "Quick Start",
      questions: [
        "What OData services do I have for Materials Management?",
        "Show me all services created by USMAN96",
        "What Sales & Distribution APIs are available?",
        "List all custom OData services in my SAP system"
      ]
    },
    {
      category: "Integration",
      questions: [
        "How can I integrate purchase orders with an external system?",
        "What's the best approach to sync master data?",
        "Explain SAP authentication methods for external apps",
        "How do I handle error responses from SAP APIs?"
      ]
    },
    {
      category: "Analysis",
      questions: [
        "Analyze the complexity of available service operations",
        "Compare different services for customer data retrieval",
        "What are the most commonly used entity sets?",
        "Show me services with pagination support"
      ]
    }
  ];

  // Custom markdown components
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');

      return !inline ? (
        <div className="code-block-wrapper">
          <div className="code-block-header">
            <span className="code-language">{match ? match[1] : 'code'}</span>
            <button
              onClick={() => copyToClipboard(codeString, codeString)}
              className="copy-button"
            >
              {copiedIndex === codeString ? <Check size={14} /> : <Copy size={14} />}
              {copiedIndex === codeString ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={className}>
            <code {...props}>{children}</code>
          </pre>
        </div>
      ) : (
        <code className="inline-code" {...props}>
          {children}
        </code>
      );
    },
    p({ children }) {
      return <p className="markdown-paragraph">{children}</p>;
    },
    ul({ children }) {
      return <ul className="markdown-list">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="markdown-ordered-list">{children}</ol>;
    },
    li({ children }) {
      return <li className="markdown-list-item">{children}</li>;
    },
    h1({ children }) {
      return <h1 className="markdown-h1">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="markdown-h2">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="markdown-h3">{children}</h3>;
    },
    strong({ children }) {
      return <strong className="markdown-strong">{children}</strong>;
    },
    em({ children }) {
      return <em className="markdown-em">{children}</em>;
    },
  };

  return (
    <div className="app" data-message-width={messageWidth}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Sparkles className="logo-icon" />
            <h1>SAP Nexus AI</h1>
            <span className="beta-badge">BETA</span>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <Database size={16} />
              <span>{stats.systems_count || 0} Systems</span>
            </div>
            <div className="status">
              <Activity className={`status-icon ${systemStatus.connected ? 'online' : 'offline'}`} />
              <span>{systemStatus.connected ? 'Connected' : 'Offline'}</span>
            </div>

            {/* Theme Switcher */}
            <div className="theme-switcher">
              <button
                onClick={() => setTheme('light')}
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                title="Light Mode"
                aria-label="Switch to light mode"
              >
                <Sun size={16} />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                title="Dark Mode"
                aria-label="Switch to dark mode"
              >
                <Moon size={16} />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                title="System Preference"
                aria-label="Use system theme preference"
              >
                <Monitor size={16} />
              </button>
            </div>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="sidebar-toggle-btn"
              title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
              aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            >
              {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="settings-btn"
              title="Settings"
              aria-label="Open settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <button onClick={createNewConversation} className="new-chat-btn">
              <Plus size={20} />
              New Chat
            </button>
            {conversations.length > 0 && (
              <button
                onClick={clearAllConversations}
                className="clear-all-btn"
                title="Clear all conversations"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={24} />
                <p>No conversations yet</p>
              </div>
            ) : (
              Object.entries(getGroupedConversations()).map(([group, groupConvs]) => (
                groupConvs.length > 0 && (
                  <div key={group} className="conversation-group">
                    <div className="group-header">{group}</div>
                    {groupConvs.map(conv => (
                      <div
                        key={conv.id}
                        className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                        onClick={() => setCurrentConversation(conv)}
                      >
                        <MessageSquare size={16} />

                        {editingId === conv.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleEditKeyDown(e, conv.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="rename-input"
                            autoFocus
                            onBlur={() => setEditingId(null)}
                          />
                        ) : (
                          <span className="conversation-title">{conv.title}</span>
                        )}

                        <div className="conversation-actions">
                          <div className="dropdown-wrapper" ref={activeDropdownId === conv.id ? dropdownRef : null}>
                            <button
                              className={`action-icon-btn more-btn ${activeDropdownId === conv.id ? 'active' : ''}`}
                              onClick={(e) => toggleDropdown(conv.id, e)}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeDropdownId === conv.id && (
                              <div className="dropdown-menu">
                                <button onClick={(e) => startEditing(conv, e)}>
                                  <Edit2 size={14} />
                                  Rename
                                </button>
                                <button onClick={(e) => deleteConversation(conv.id, e)} className="delete-option">
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ))
            )}
          </div>
        </aside>

        <main className="chat-container">
          <div className="messages">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-header">
                  <div className="welcome-icon-wrapper">
                    <Sparkles size={48} className="welcome-icon" />
                  </div>
                  <h2>SAP Nexus AI</h2>
                </div>
                <p>Enterprise AI Copilot for SAP Integration</p>

                <div className="suggestions-grid">
                  {suggestionQuestions.slice(0, 3).map((category, idx) => (
                    <div key={idx} className="suggestion-card" onClick={() => setInput(category.questions[0])}>
                      <div className="card-icon">
                        {idx === 0 ? <Activity size={20} /> :
                          idx === 1 ? <Database size={20} /> :
                            idx === 2 ? <MessageSquare size={20} /> : <Sparkles size={20} />}
                      </div>
                      <div className="card-content">
                        <h3>{category.category}</h3>
                        <p>{category.questions[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`message-wrapper ${msg.role}`}>
                  <div className="message">
                    {showAvatars && msg.role === 'assistant' && (
                      <div className="message-avatar">
                        <Sparkles size={16} />
                      </div>
                    )}
                    <div className="message-content">
                      {msg.role === 'user' ? (
                        <>
                          <div className="message-text user-message">{msg.content}</div>
                          <div className="message-time">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="message-text assistant-message">
                            <ReactMarkdown components={MarkdownComponents}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                          <div className="message-actions">
                            <button
                              onClick={() => copyToClipboard(msg.content, idx)}
                              className="message-action-btn"
                              title="Copy message"
                            >
                              {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                              {copiedIndex === idx ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="message-time">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message-wrapper assistant">
                <div className="message">
                  {showAvatars && (
                    <div className="message-avatar">
                      <Sparkles size={16} className="animate-pulse" />
                    </div>
                  )}
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                className="message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Message SAP Nexus AI..."
                rows={1}
                disabled={loading}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        messageWidth={messageWidth}
        setMessageWidth={setMessageWidth}
        showAvatars={showAvatars}
        setShowAvatars={setShowAvatars}
      />
    </div>
  );
}

export default App;