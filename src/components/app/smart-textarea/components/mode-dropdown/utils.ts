import { FollowUpType } from 'src/store/types'
import SearchIcon from 'src/images/models/web-search.svg?react'
import ChatIcon from 'src/images/models/text-chat.svg?react'
import ImageIcon from 'src/images/models/image.svg?react'
import TelegramIcon from 'src/images/models/telegram.svg?react'
import TextGenerationIcon from 'src/images/models/text.svg?react'
import DeepResearchIcon from 'src/images/models/deep-research.svg?react'
import AIAgentIcon from 'src/images/models/ai-agent.svg?react'

export const icons = {
  auto: SearchIcon,
  'web-search': SearchIcon,
  'text-chat': ChatIcon,
  'text-generation': TextGenerationIcon,
  'image-generation': ImageIcon,
  'tg-search': TelegramIcon,
  'deep-research': DeepResearchIcon,
  'web-agent': AIAgentIcon,
}

export const DeepResearchSearchType = {
  title: 'DeepResearch',
  shortenedTitle: 'Research',
  value: FollowUpType.DEEP_RESEARCH,
  icon: icons[FollowUpType.DEEP_RESEARCH],
}

export const AutoSearchType = {
  title: 'Auto',
  shortenedTitle: 'Auto',
  value: FollowUpType.AUTO,
  icon: icons[FollowUpType.AUTO],
}

// для добавления новой категории нужно добавить в searchDropdownItems
export const searchDropdownItems = [
  AutoSearchType,
  {
    title: 'Web Search',
    shortenedTitle: 'Search',
    value: FollowUpType.SEARCH,
    icon: icons[FollowUpType.SEARCH],
  },
  DeepResearchSearchType,
  {
    title: 'Create image',
    shortenedTitle: 'Image',
    value: FollowUpType.IMAGE,
    icon: icons[FollowUpType.IMAGE],
  },
  {
    title: 'Chat Model',
    shortenedTitle: 'Chat',
    value: FollowUpType.CHAT,
    icon: icons[FollowUpType.CHAT],
  },
  {
    title: 'Text Writer',
    shortenedTitle: 'Text',
    value: FollowUpType.TEXT_GENERATOR,
    icon: icons[FollowUpType.TEXT_GENERATOR],
  },
  {
    title: 'TG Search',
    shortenedTitle: 'Telegram',
    value: FollowUpType.TELEGRAM,
    icon: icons[FollowUpType.TELEGRAM],
  },
]

export const searchDropdownItemsExtension = [
  AutoSearchType,
  {
    title: 'AI Agent',
    shortenedTitle: 'AI Agent',
    value: FollowUpType.WEB_AGENT,
    icon: icons[FollowUpType.WEB_AGENT],
  },
  DeepResearchSearchType,
  {
    title: 'Chat',
    shortenedTitle: 'Chat',
    value: FollowUpType.CHAT_EXTENSION,
    icon: icons[FollowUpType.CHAT],
  },
]
