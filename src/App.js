import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import DocumentUpload from './components/DocumentUpload';
import './App.css';

function App() {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [useDocument, setUseDocument] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch all chat sessions when component mounts
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const sessions = await response.json();
      setChatSessions(sessions);
      if (sessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(sessions[0].id);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      alert('Failed to fetch chat sessions. Please check if the backend server is running.');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSessions]);

  const getCurrentSession = () => {
    return chatSessions.find(session => session.id === currentSessionId) || { messages: [] };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentSessionId) return;

    setIsLoading(true);
    const userMessage = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId: currentSessionId,
          useDocument: useDocument
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Update the current chat session with new messages
      setChatSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === currentSessionId ? data.session : session
        )
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get response from the bot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const newSession = await response.json();
      setChatSessions(prev => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
    } catch (error) {
      console.error('Error creating new session:', error);
      alert('Failed to create new chat session. Please try again.');
    }
  };

  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const updateSessionTitle = async (sessionId, newTitle) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle })
      });
      const updatedSession = await response.json();
      setChatSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId ? updatedSession : session
        )
      );
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await fetch(`http://localhost:5000/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      setChatSessions(prev => prev.filter(session => session.id !== sessionId));
      if (currentSessionId === sessionId) {
        const remainingSessions = chatSessions.filter(session => session.id !== sessionId);
        setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleDocumentProcessed = (success) => {
    setHasDocument(success);
    setUseDocument(success);
  };

  return (
    <div className="app">
      <Sidebar 
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onChatSelect={switchSession}
        onNewChat={startNewChat}
        onUpdateTitle={updateSessionTitle}
        onDeleteSession={deleteSession}
      />
      <div className="chat-window">
        <div className="document-controls">
          <DocumentUpload onDocumentProcessed={handleDocumentProcessed} />
          {hasDocument && (
            <div className="mode-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useDocument}
                  onChange={(e) => setUseDocument(e.target.checked)}
                />
                Use Document for Q&A
              </label>
            </div>
          )}
        </div>
        <div className="messages">
          {getCurrentSession().messages?.map((chat, index) => (
            <div key={index} className="message-container">
              <div className="user-message">
                <p><strong>You:</strong></p>
                <pre>{chat.user}</pre>
              </div>
              <div className="bot-message">
                <p><strong>Bot:</strong></p>
                <pre>{chat.bot}</pre>
                {chat.sources && chat.sources.length > 0 && (
                  <div className="sources">
                    <p><strong>Sources:</strong></p>
                    {chat.sources.map((source, idx) => (
                      <div key={idx} className="source">
                        Page {source.page} - {source.source}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="loading-message">
              Bot is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={useDocument ? "Ask a question about the document..." : "Type a message..."}
            disabled={isLoading || !currentSessionId}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim() || !currentSessionId}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
