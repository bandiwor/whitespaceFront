import {ChatWithMessagesType} from "../types/chat.ts";

export default function sortUserChats(chats: ChatWithMessagesType[]) {
    return [...chats].sort((chat1, chat2) => {
        if (chat1.messages.length === 0 || chat2.messages.length === 0) {
            return new Date(chat2.createdAt).getTime() - new Date(chat1.createdAt).getTime();
        }
        return new Date(chat2.messages[0].createdAt).getTime() - new Date(chat1.messages[0].createdAt).getTime();
    })
}