import { useSummarization } from '@/sidepanel/hooks/useSummarization.ts';
import { useChatContext } from '@/sidepanel/contexts/chatContext.tsx';
import { useMessageHandling } from '@/sidepanel/hooks/useMessageHandling.ts';

import { TooltipDefault } from 'src/components/ui/tooltip';
import { BaseButton } from '@/sidepanel/components/ui';
import IconSummarize from 'src/images/summarize.svg?react';

export function SummarizePageButton() {
  const { chats, activeChat, createNewChat, addMessageToChat, updateMessageInChat } =
    useChatContext();

  // Message handling hook
  const { handleSendMessage } = useMessageHandling({
    activeChat,
    chats,
    addMessageToChat,
    updateMessageInChat,
    createNewChat,
  });

  // Summarization hook
  const { handleSummarize } = useSummarization({
    createNewChat,
    handleSendMessage,
  });

  return (
    <TooltipDefault text="Summarize page">
      <div className="relative">
        <BaseButton
          aria-label="Summarize page"
          color={'transparent'}
          size={'sm'}
          onClick={handleSummarize}
        >
          <IconSummarize width={18} height={18} />
        </BaseButton>
      </div>
    </TooltipDefault>
  );
}
