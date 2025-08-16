import React, { useState, useRef } from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { PreferencesModal } from '../PreferencesModal/PreferencesModal';
import { Composer, ComposerRef } from '../../../common/components/Composer/Composer';
import { useConversations } from '../../contexts/ConversationsContext';
import { api } from '../../services/api';
import styles from './Header.module.css';

interface HeaderProps {
  onStartConversation: (workingDirectory: string, initialPrompt: string, model?: string) => void;
  isStartingConversation: boolean;
  startError: string | null;
  defaultWorkingDirectory?: string;
}

export function Header({ onStartConversation, isStartingConversation, startError, defaultWorkingDirectory }: HeaderProps) {
  const theme = useTheme();
  const [showPrefs, setShowPrefs] = useState(false);
  const composerRef = useRef<ComposerRef>(null);
  const { recentDirectories, getMostRecentWorkingDirectory } = useConversations();

  const handleComposerSubmit = async (message: string, workingDirectory?: string, model?: string, permissionMode?: string) => {
    onStartConversation(workingDirectory || '', message, model === 'default' ? undefined : model);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.composerWrapper}>
          <Composer 
            ref={composerRef}
            workingDirectory={defaultWorkingDirectory}
            onSubmit={handleComposerSubmit}
            isLoading={isStartingConversation}
            placeholder="Describe your task"
            showDirectorySelector={true}
            showModelSelector={true}
            enableFileAutocomplete={true}
            recentDirectories={recentDirectories}
            getMostRecentWorkingDirectory={getMostRecentWorkingDirectory}
            onDirectoryChange={(directory) => {
              setTimeout(() => {
                composerRef.current?.focusInput();
              }, 50);
            }}
            onModelChange={(model) => {
              setTimeout(() => {
                composerRef.current?.focusInput();
              }, 50);
            }}
            onFetchFileSystem={async (directory) => {
              const response = await api.listDirectory({
                path: directory,
                recursive: true,
                respectGitignore: true,
              });
              return response.entries;
            }}
            onFetchCommands={async (workingDirectory) => {
              const response = await api.getCommands(workingDirectory);
              return response.commands;
            }}
          />
        </div>
        
        {startError && (
          <div className={styles.error}>
            {startError}
          </div>
        )}

        <div className={styles.settingsContainer}>
          <button className={styles.settingButton} aria-label="Open Settings" onClick={() => setShowPrefs(true)}>
            <Settings size={18} />
          </button>
        </div>
      </div>
      {showPrefs && <PreferencesModal onClose={() => setShowPrefs(false)} />}
    </>
  );
}
