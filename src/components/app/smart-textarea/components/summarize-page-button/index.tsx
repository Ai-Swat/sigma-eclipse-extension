import { useEffect } from 'react';
import { useSummarization } from '@/sidepanel/hooks/useSummarization.ts';
import { useChatContext } from '@/sidepanel/contexts/chatContext.tsx';
import { useModelContext } from '@/sidepanel/contexts/modelContext.tsx';
import { useMessageHandling } from '@/sidepanel/hooks/useMessageHandling.ts';

import { TooltipDefault } from 'src/components/ui/tooltip';
import { BaseButton } from '@/sidepanel/components/ui';
import IconSummarize from 'src/images/summarize.svg?react';

export function SummarizePageButton({
  setIsSummarizing,
  setHandleStopGeneration,
  setIsShowSubmitRequest,
}: {
  setIsSummarizing: (v: boolean) => void;
  setHandleStopGeneration: (fn: () => void) => void;
  setIsShowSubmitRequest?: (status: boolean) => void;
}) {
  const { chats, activeChat, createNewChat, addMessageToChat, updateMessageInChat } =
    useChatContext();
  const { modelStatus, isModelReady } = useModelContext();

  // Message handling hook
  const { handleSendMessage, isGenerating, handleStopGeneration } = useMessageHandling({
    activeChat,
    chats,
    addMessageToChat,
    updateMessageInChat,
    createNewChat,
  });

  useEffect(() => {
    setIsSummarizing(isGenerating);
  }, [isGenerating, setIsSummarizing]);

  useEffect(() => {
    setHandleStopGeneration(() => handleStopGeneration);
  }, [handleStopGeneration, setHandleStopGeneration]);

  // Summarization hook
  const { handleSummarize } = useSummarization({
    createNewChat,
    handleSendMessage,
  });

  const handleSend = () => {
    if (modelStatus !== 'running') {
      setIsShowSubmitRequest?.(true);
      return;
    }
    if (modelStatus === 'running' && !isModelReady) {
      return;
    }

    void handleSummarize();
  };

  return (
    <TooltipDefault text="Summarize page">
      <div className="relative">
        <BaseButton
          aria-label="Summarize page"
          color={'transparent'}
          size={'sm'}
          onClick={handleSend}
          disabled={isGenerating}
        >
          <IconSummarize width={18} height={18} />
        </BaseButton>
      </div>
    </TooltipDefault>
  );
}
