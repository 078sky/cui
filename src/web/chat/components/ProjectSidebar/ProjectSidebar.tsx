import React, { useState, useEffect } from 'react';
import { useConversations } from '../../contexts/ConversationsContext';
import { MessageList } from './MessageList';
import styles from './ProjectSidebar.module.css';
import type { ConversationSummaryWithLiveStatus } from '../../types';

interface ProjectInfo {
  path: string;
  shortname: string;
  lastDate: string;
  conversations: ConversationSummaryWithLiveStatus[];
  conversationCount: number;
}

interface ProjectSidebarProps {
  selectedSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
}

export function ProjectSidebar({ selectedSessionId, onSessionSelect }: ProjectSidebarProps) {
  const { conversations, recentDirectories, loading } = useConversations();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);

  useEffect(() => {
    const projectMap = new Map<string, ProjectInfo>();
    
    conversations.forEach(conversation => {
      const projectPath = conversation.projectPath;
      const recentDir = recentDirectories[projectPath];
      
      if (!projectMap.has(projectPath)) {
        projectMap.set(projectPath, {
          path: projectPath,
          shortname: recentDir?.shortname || projectPath.split('/').pop() || projectPath,
          lastDate: recentDir?.lastDate || conversation.createdAt,
          conversations: [],
          conversationCount: 0
        });
      }
      
      const project = projectMap.get(projectPath)!;
      project.conversations.push(conversation);
      project.conversationCount++;
      
      if (conversation.createdAt > project.lastDate) {
        project.lastDate = conversation.createdAt;
      }
    });

    const sortedProjects = Array.from(projectMap.values()).sort((a, b) => 
      new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
    );

    setProjects(sortedProjects);

    if (selectedSessionId && !selectedProject) {
      const conversation = conversations.find(c => c.sessionId === selectedSessionId);
      if (conversation) {
        setSelectedProject(conversation.projectPath);
      }
    }
  }, [conversations, recentDirectories, selectedSessionId, selectedProject]);

  const handleProjectSelect = (projectPath: string) => {
    setSelectedProject(selectedProject === projectPath ? null : projectPath);
  };

  const selectedProjectData = projects.find(p => p.path === selectedProject);

  if (loading) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2>Projects</h2>
        </div>
        <div className={styles.loading}>Loading projects...</div>
      </div>
    );
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>Projects</h2>
      </div>
      
      <div className={styles.content}>
        {projects.length === 0 ? (
          <div className={styles.empty}>No projects found</div>
        ) : (
          <div className={styles.projectList}>
            {projects.map(project => (
              <div key={project.path} className={styles.projectGroup}>
                <button
                  className={`${styles.projectHeader} ${selectedProject === project.path ? styles.selected : ''}`}
                  onClick={() => handleProjectSelect(project.path)}
                >
                  <div className={styles.projectInfo}>
                    <span className={styles.projectName}>{project.shortname}</span>
                    <span className={styles.projectCount}>
                      {project.conversationCount} message{project.conversationCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className={styles.projectDate}>
                    {new Date(project.lastDate).toLocaleDateString()}
                  </div>
                </button>
                
                {selectedProject === project.path && selectedProjectData && (
                  <MessageList
                    conversations={selectedProjectData.conversations}
                    selectedSessionId={selectedSessionId}
                    onSessionSelect={onSessionSelect}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
