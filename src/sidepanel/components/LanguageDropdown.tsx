import { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, LANGUAGE_NAMES } from '../locales/prompts';
import { useLanguage } from '../contexts/languageContext';
import styles from './LanguageDropdown.module.css';

interface LanguageDropdownProps {
  onClose?: () => void;
}

const ALL_LANGUAGES: SupportedLanguage[] = ['en', 'de', 'es', 'fr', 'ja', 'pt', 'ar', 'cs', 'it', 'ko', 'nl', 'zh', 'ru'];

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'Enter' && filteredLanguages.length === 1) {
      handleSelectLanguage(filteredLanguages[0]);
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.triggerButton}
        onClick={handleToggle}
        title={`Language: ${LANGUAGE_NAMES[language]}`}
        aria-label="Change Language"
      >
        <span className={styles.languageCode}>{LANGUAGE_NAMES[language]}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrapper}>
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.languageList}>
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map(lang => (
                <button
                  key={lang}
                  className={`${styles.languageItem} ${lang === language ? styles.active : ''}`}
                  onClick={() => handleSelectLanguage(lang)}
                >
                  <span className={styles.languageItemCode}>{LANGUAGE_NAMES[lang]}</span>
                </button>
              ))
            ) : (
              <div className={styles.noResults}>No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

