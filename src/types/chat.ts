import {MessageType} from "./message.ts";
import {UserProfileType} from "./profile.ts";


export type ChatCommonType = {
    id: string,
    createdAt: string,
    updatedAt: string,
}

export type PrivateChatAttributesType = {
    type: 'PRIVATE',
    profile: UserProfileType,
}

export type PublicChatAttributesType = {
    type: 'CHANNEL' | 'GROUP',
    name: string,
    avatar: string | null,
}

export type PrivateChatType = ChatCommonType & PrivateChatAttributesType;
export type PublicChatType = ChatCommonType & PublicChatAttributesType;

export type ChatType = PrivateChatType | PublicChatType;

export type ChatWithMessagesType = ChatType & {
    messages: MessageType[];
}
