import React from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className={styles.container}>
      {sidebar && (
        <aside className={styles.sidebar}>
          {sidebar}
        </aside>
      )}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
