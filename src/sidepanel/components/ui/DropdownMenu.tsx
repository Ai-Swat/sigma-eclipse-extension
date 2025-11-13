import React, { useState, useRef, useEffect } from 'react';
import DeleteIcon from '@/images/delete.svg?react';
import styles from './DropdownMenu.module.css';
import cn from 'clsx';
import { BaseButton } from '@/sidepanel/components/ui/index.ts';
import DotsIcon from '@/images/dots.svg?react';

interface DropdownMenuProps {
  className?: string;
  onDelete: (e: React.MouseEvent) => void;
  deleteTitle: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ className, onDelete, deleteTitle }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => !prev);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleDelete = (e: React.MouseEvent) => {
    toggleMenu(e)
    onDelete(e)
  }

  return (
    <div className={cn(styles.menuWrapper, className)} ref={menuRef}>
      <div onClick={(e) => toggleMenu(e)}>
        <BaseButton color="transparent" size="sm" isActive={open}>
          <DotsIcon />
        </BaseButton>
      </div>

      {open && (
        <>
          <div className={styles.overlay} onClick={(e) => toggleMenu(e)} />

          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem} onClick={e => handleDelete(e)}>
              <DeleteIcon className={styles.dropdownIcon} />
              {deleteTitle}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;
