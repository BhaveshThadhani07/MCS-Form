"use client";

import { useEffect, useCallback } from 'react';

// This component can be placed in the root layout to enforce security globally.
export function SecurityManager() {
  
  const dispatchAnomaly = useCallback((type: string, details: string, score: number) => {
    const event = new CustomEvent('anomaly', {
      detail: { type, details, score },
    });
    document.dispatchEvent(event);
  }, []);

  const disableEvent = useCallback((e: Event, type: string, score: number) => {
    e.preventDefault();
    dispatchAnomaly(type, `User tried to ${type.toLowerCase()}.`, score);
  }, [dispatchAnomaly]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => disableEvent(e, 'Context Menu', 7);
    const handleCopy = (e: ClipboardEvent) => disableEvent(e, 'Copy Attempt', 7);
    const handlePaste = (e: ClipboardEvent) => disableEvent(e, 'Paste Attempt', 7);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl, Alt, Meta (Windows/Cmd) keys.
      // We also block F1-F12 keys.
      if (e.ctrlKey || e.altKey || e.metaKey || (e.key.startsWith('F') && e.key.length > 1 && !isNaN(Number(e.key.substring(1))))) {
         disableEvent(e, 'Prohibited Key', 7);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableEvent]);

  return null; // This component does not render anything.
}
