// =============================================================
// src/hooks/useSwipe.js
// =============================================================
// Hook reutilizável para detectar swipe horizontal.
// Chama onSwipeLeft quando arrasta para a esquerda (próximo)
// e onSwipeRight quando arrasta para a direita (anterior).
// =============================================================
import { useRef } from 'react';

export const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > threshold) onSwipeLeft?.(); // arrastou para a esquerda
    if (diff < -threshold) onSwipeRight?.(); // arrastou para a direita

    touchStartX.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
};
