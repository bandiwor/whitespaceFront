export type MessageCommonType = {
    id: string
    chatId: string,
    profileId: number,
    createdAt: string,
    updatedAt: string,
}

export type MessageTextType = MessageCommonType & {
    type: 'TEXT',
    content: string
}

export type MessageVoiceType = MessageCommonType & {
    type: 'VOICE',
    audioUrl: string
}

export type MessageType = MessageTextType | MessageVoiceType;
