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
    /** Custom element to apply scroll lock to (defaults to body) */
    targetElement?: HTMLElement;
  } = {}
) => {
  const {
    preserveScrollPosition = true,
    targetElement = document.body
  } = options;

  useEffect(() => {
    if (!isLocked) return;

    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Apply scroll lock
    targetElement.style.position = 'fixed';
    targetElement.style.top = preserveScrollPosition ? `-${scrollY}px` : '0';
    targetElement.style.width = '100%';
    targetElement.style.overflow = 'hidden';
    
    return () => {
      // Restore scroll
      targetElement.style.position = '';
      targetElement.style.top = '';
      targetElement.style.width = '';
      targetElement.style.overflow = '';
      
      if (preserveScrollPosition) {
        window.scrollTo(0, scrollY);
      }
    };
  }, [isLocked, preserveScrollPosition, targetElement]);
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
