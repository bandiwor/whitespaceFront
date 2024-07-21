import {ChatType, ChatWithMessagesType} from "../types/chat.ts";
import {MessageType} from "../types/message.ts";
import {MyUserProfileType, UserProfileType} from "../types/profile.ts";

export type DefaultRequestError = {
    ok: false,
    message: string | string[];
    error: string,
    statusCode: number,
}

export type AuthLoginRequestPayload = {
    telephone: string,
    password: string,
}

export type AuthRegisterRequestPayload = {
    telephone: string,
    password: string,
}

export type AuthCreateProfileRequestPayload = {
    telephone: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: "MALE" | "FEMALE",
    dateOfBirth?: string,
    username?: string,
}

export type AuthLoginRequestResponse = {
    ok: true,
    refresh?: {
        expires: string,
        token: string,
    },
    access?: {
        expires: string,
        token: string,
    },
    redirectTo?: "CREATE-PROFILE"
}

export type AuthRegisterRequestResponse = {
    ok: true,
    code: string
}

export type AuthCreateProfileRequestResponse = {
    ok: true,
}

export type AuthRefreshRequestResponse = {
    "ok": true,
    "refresh": {
        "expires": string,
        "token": string
    },
    "access": {
        "expires": string,
        "token": string
    }
}

export type AuthLogoutRequestResponse = {
    ok: true
}

export type AuthRefreshRequestPayload = {
    refreshJWT: string
}

export type AuthLogoutRequestPayload = {
    refreshJWT: string
}

export type MyProfileResponse = {
    ok: true,
    profile: MyUserProfileType,
};

export type GetUserChatsRequestPayload = {
    take?: number
    skip?: number
}

export type GetUserChatsRequestResponse = {
    ok: true
    chats: ChatWithMessagesType[]
}

export type SearchUsersRequestPayload = {
    take?: number
    skip?: number
    query: string
}

export type SearchUsersRequestResponse = {
    ok: true,
    users: UserProfileType[]
}

export type OpenPrivateChatRequestPayload = {
    targetProfileId: number
}
export type OpenChatRequestPayload = {
    chatId: string
}

export type OpenPrivateChatRequestResponse = {
    ok: true,
    chat: ChatType
}

export type OpenChatRequestResponse = {
    ok: true,
    chat: ChatWithMessagesType
}

export type SendTextMessageRequestPayload = {
    chatId: string,
    content: string
}

export type SendTextMessageRequestResponse = {
    ok: true,
    message: MessageType
}

export type SendVoiceMessageRequestResponse = {
    ok: true
}
