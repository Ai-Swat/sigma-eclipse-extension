import { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, LANGUAGE_NAMES } from '../locales/prompts';
import { useLanguage } from '@/sidepanel/contexts/languageContext.tsx';
import { BaseButton } from '@/sidepanel/components/ui';
import { TooltipDefault } from '@/components/ui/tooltip';
import GlobeIcon from 'src/images/globe.svg?react';
import styles from './LanguageDropdown.module.css';

interface LanguageDropdownProps {
  onClose?: () => void;
}

const ALL_LANGUAGES: SupportedLanguage[] = [
  'en',
  'de',
  'es',
  'fr',
  'ja',
  'pt',
  'ar',
  'it',
  'ko',
  'nl',
  'zh',
];

export default function LanguageDropdown({ onClose }: LanguageDropdownProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter languages based on search query
  const filteredLanguages = ALL_LANGUAGES.filter(lang => {
    const code = LANGUAGE_NAMES[lang].toLowerCase();
    return code.includes(searchQuery.toLowerCase());
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
    setSearchQuery('');
    onClose?.();
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <TooltipDefault text="Change Language">
        <div className="relative">
          <BaseButton
            aria-label="Change Language"
            color={'transparent'}
            size={'sm'}
            onClick={handleToggle}
          >
            <GlobeIcon width={18} height={18} />
          </BaseButton>
        </div>
      </TooltipDefault>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.languageList}>
            {filteredLanguages?.map(lang => (
              <button
                key={lang}
                className={`${styles.languageItem} ${lang === language ? styles.active : ''}`}
                onClick={() => handleSelectLanguage(lang)}
              >
                <span className={styles.languageItemCode}>{LANGUAGE_NAMES[lang]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
