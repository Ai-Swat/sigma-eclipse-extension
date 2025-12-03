import HistoryIcon from 'src/images/history-icon-extension.svg?react';
import PlusIcon from 'src/images/plus.svg?react';
import { BaseButton } from '@/sidepanel/components/ui';
import { TooltipDefault } from '@/components/ui/tooltip';
import SigmaEclipse from '@/components/app/sigma-eclipse';
import styles from './Header.module.css';

interface HeaderProps {
  onNewThread: () => void;
  onHistory: () => void;
}

export default function Header({ onNewThread, onHistory }: HeaderProps) {
  return (
    <div className={styles.headerStyles}>
      <header className={styles.headerInner}>
        {/* App & Model Status and Control */}
        <SigmaEclipse />

        {/* Spacer */}
        <div className={styles.spacer} />

        {/* Right side buttons */}
        <TooltipDefault text="New Thread">
          <div className="relative">
            <BaseButton color={'transparent'} size={'sm'} onClick={onNewThread}>
              <PlusIcon width={18} height={18} />
            </BaseButton>
          </div>
        </TooltipDefault>
        <TooltipDefault text="Open history">
          <div className="relative">
            <BaseButton color={'transparent'} size={'sm'} onClick={onHistory}>
              <HistoryIcon width={18} height={18} />
            </BaseButton>
          </div>
        </TooltipDefault>
      </header>
    </div>
  );
}
