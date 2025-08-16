import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MessageList.module.css';
import type { ConversationSummaryWithLiveStatus } from '../../types';

interface MessageListProps {
  conversations: ConversationSummaryWithLiveStatus[];
  selectedSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
}

export function MessageList({ conversations, selectedSessionId, onSessionSelect }: MessageListProps) {
  const navigate = useNavigate();

  const handleMessageClick = (sessionId: string) => {
    onSessionSelect(sessionId);
    navigate(`/c/${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'var(--color-accent)';
      case 'completed':
        return 'var(--color-success)';
      case 'pending':
        return 'var(--color-warning)';
      default:
        return 'var(--color-text-muted)';
    }
  };

  const sortedConversations = [...conversations].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={styles.messageList}>
      {sortedConversations.map(conversation => (
        <button
          key={conversation.sessionId}
          className={`${styles.messageItem} ${selectedSessionId === conversation.sessionId ? styles.selected : ''}`}
          onClick={() => handleMessageClick(conversation.sessionId)}
        >
          <div className={styles.messageHeader}>
            <div className={styles.messageTitle}>
              {conversation.sessionInfo.custom_name || conversation.summary || 'Untitled'}
            </div>
            <div className={styles.messageDate}>
              {formatDate(conversation.createdAt)}
            </div>
          </div>
          
          <div className={styles.messageMetadata}>
            <div className={styles.messageInfo}>
              <span className={styles.messageCount}>
                {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
              </span>
              {conversation.model && (
                <span className={styles.model}>{conversation.model}</span>
              )}
            </div>
            
            <div className={styles.statusIndicator}>
              <div 
                className={styles.statusDot}
                style={{ backgroundColor: getStatusColor(conversation.status) }}
              />
              <span className={styles.statusText}>{conversation.status}</span>
            </div>
          </div>

          {conversation.sessionInfo.pinned && (
            <div className={styles.pinnedIndicator}>📌</div>
          )}
        </button>
      ))}
    </div>
  );
}
