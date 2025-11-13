import React from 'react';
import styles from './styles.module.css';
import CloseIcon from '@/images/clear-icon.svg?react';
import { BaseButton } from '@/sidepanel/components/ui';

interface Props {
  itemName: string;
  threadId?: string;
  onCancel: () => void;
  onDelete: (id?: string) => void;
}

export const Popup: React.FC<Props> = ({ itemName, threadId, onCancel, onDelete }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <div></div>

          <div className={styles.title}>Are you sure?</div>

          <div className={styles.closeBtn} onClick={onCancel}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.text}>This will delete</div>
          <div className={styles.itemName}>{itemName}</div>
        </div>
        <div className={styles.actions}>
          <BaseButton size={'lg'} onClick={onCancel} color={'grey'}>
            Cancel
          </BaseButton>
          <BaseButton size={'lg'} color={'red'} onClick={() => onDelete(threadId)}>
            Delete
          </BaseButton>
        </div>
      </div>
    </div>
  );
};
