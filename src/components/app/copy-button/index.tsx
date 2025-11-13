import { useClipboard } from 'src/libs/use/use-clipboard.ts';
import { TooltipDefault } from 'src/components/ui/tooltip';
import CopyTextIcon from 'src/images/copy-search.svg?react';
import CheckIcon from 'src/images/check-icon.svg?react';
import { BaseButton } from '@/sidepanel/components/ui';

export default function CopyButton({ text }: { text?: string }) {
  const [copy, isCopied] = useClipboard();

  const handleCopy = () => {
    if (text) copy(text);
  };

  if (!text) return null;

  return (
    <TooltipDefault text="Copy to clipboard">
      <div className="relative">
        <BaseButton
          color="transparent"
          size="sm"
          onClick={handleCopy}
          label={'Copy response to clipboard'}
        >
          {isCopied ? <CheckIcon /> : <CopyTextIcon />}
        </BaseButton>
      </div>
    </TooltipDefault>
  );
}
