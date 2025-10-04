import { useEffect } from 'react';

/**
 * Hook to lock/unlock page scroll
 * @param isLocked - Whether to lock the scroll
 * @param options - Configuration options
 */
export const useScrollLock = (
  isLocked: boolean,
  options: {
    /** Whether to preserve scroll position when locking */
    preserveScrollPosition?: boolean;
  } = {}
) => {
  const { preserveScrollPosition = true } = options;

  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    
    // Apply scroll lock
    body.style.position = 'fixed';
    body.style.top = preserveScrollPosition ? `-${scrollY}px` : '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    
    return () => {
      // Restore scroll
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      html.style.overflow = '';
      
      if (preserveScrollPosition) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [isLocked, preserveScrollPosition]);
};

/**
 * Hook to lock scroll when dropdown is open
 * Only locks when dropdown is actually open and visible
 */
export const useDropdownScrollLock = (isOpen: boolean) => {
  useScrollLock(isOpen, {
    preserveScrollPosition: true
  });
};
