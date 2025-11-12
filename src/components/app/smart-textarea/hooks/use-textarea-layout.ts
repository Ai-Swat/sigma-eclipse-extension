import React, { useState, useCallback } from 'react';

export const useTextareaLayout = () => {
  const [isGradientShow, setIsGradientShow] = useState(false);

  const handleInputHeight = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;

    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';

    // Управление градиентом (фиксированное значение для расширения)
    const maxHeight = 140;
    if (el.scrollHeight > maxHeight) {
      setIsGradientShow(true);
    } else if (el.scrollHeight < maxHeight) {
      setIsGradientShow(false);
    }
  }, []);

  return {
    isGradientShow,
    handleInputHeight,
  };
};
