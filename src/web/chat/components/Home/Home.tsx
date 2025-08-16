import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations } from '../../contexts/ConversationsContext';
import { api } from '../../services/api';
import { Header } from './Header';
import styles from './Home.module.css';

interface HomeProps {
  selectedSessionId?: string;
}

export function Home({ selectedSessionId }: HomeProps) {
  const navigate = useNavigate();
  const { getMostRecentWorkingDirectory } = useConversations();
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const handleStartConversation = async (workingDirectory: string, initialPrompt: string, model?: string) => {
    if (isStartingConversation) return;
    
    setIsStartingConversation(true);
    setStartError(null);
    
    try {
      const response = await api.startConversation({
        workingDirectory,
        initialPrompt,
        model,
      });
      
      navigate(`/c/${response.sessionId}`);
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setStartError(err instanceof Error ? err.message : 'Failed to start conversation');
    } finally {
      setIsStartingConversation(false);
    }
  };

  if (selectedSessionId) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcomeContent}>
        <div className={styles.welcomeHeader}>
          <h1>Welcome to CUI</h1>
          <p>Select a project from the sidebar or start a new conversation</p>
        </div>
        
        <Header 
          onStartConversation={handleStartConversation}
          isStartingConversation={isStartingConversation}
          startError={startError}
          defaultWorkingDirectory={getMostRecentWorkingDirectory()}
        />
      </div>
    </div>
  );
}
