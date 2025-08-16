import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Home } from './components/Home/Home';
import { ConversationView } from './components/ConversationView/ConversationView';
import { ProjectSidebar } from './components/ProjectSidebar/ProjectSidebar';
import { ConversationsProvider } from './contexts/ConversationsContext';
import { StreamStatusProvider } from './contexts/StreamStatusContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import './styles/global.css';

function ChatAppContent() {
  const location = useLocation();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const isConversationRoute = location.pathname.startsWith('/c/');
  const sessionIdFromRoute = isConversationRoute ? location.pathname.split('/c/')[1] : null;
  const currentSessionId = sessionIdFromRoute || selectedSessionId;

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  const sidebar = (
    <ProjectSidebar
      selectedSessionId={currentSessionId || undefined}
      onSessionSelect={handleSessionSelect}
    />
  );

  return (
    <Layout sidebar={sidebar}>
      <Routes>
        <Route path="/" element={<Home selectedSessionId={currentSessionId || undefined} />} />
        <Route path="/c/:sessionId" element={<ConversationView />} />
      </Routes>
    </Layout>
  );
}

function ChatApp() {
  return (
    <PreferencesProvider>
      <StreamStatusProvider>
        <ConversationsProvider>
          <ChatAppContent />
        </ConversationsProvider>
      </StreamStatusProvider>
    </PreferencesProvider>
  );
}

export default ChatApp;
