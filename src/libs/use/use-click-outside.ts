import { useEffect, RefObject } from 'react';

const useClickOutside = (innerRef: RefObject<HTMLElement>, onClickOutside: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!innerRef || !innerRef.current) {
        return;
      }

      if ((event.target as Element).matches('.ignore-click-outside')) {
        return;
      }

      const clickedOutside = !innerRef.current.contains(event.target as Node);

      if (clickedOutside) {
        onClickOutside();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [innerRef, onClickOutside]);
};

export default useClickOutside;
