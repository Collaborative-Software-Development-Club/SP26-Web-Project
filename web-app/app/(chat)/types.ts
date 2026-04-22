export type ChatMessage = {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  //If message is a housing link, add an address so address lookup is not required later.
  address: string | null;
};

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isGroup: boolean;
}

export type ConversationPreview = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isGroup: boolean;
};
