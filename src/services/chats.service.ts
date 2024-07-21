import ky from "ky";
import {
    getChatsUrl,
    openChatUrl,
    openPrivateChatUrl,
    searchUsersUrl,
    sendTextUrl,
    sendVoiceUrl,
} from "../constants/api.ts";
import {
    GetUserChatsRequestPayload,
    GetUserChatsRequestResponse,
    OpenChatRequestPayload,
    OpenChatRequestResponse,
    OpenPrivateChatRequestPayload,
    OpenPrivateChatRequestResponse,
    SearchUsersRequestPayload,
    SearchUsersRequestResponse,
    SendTextMessageRequestPayload,
    SendTextMessageRequestResponse, SendVoiceMessageRequestResponse,
} from "../constants/requests.ts";
import sortUserChats from "../utils/sortUserChats.ts";
import authService from "./auth.service.ts";
import {handleError} from "./common.ts";

const chatsService = {
    async getChats(take: number = 50, skip: number = 0) {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            return null;
        }

        try {
            const response = await ky(getChatsUrl, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                json: {
                    take, skip,
                } satisfies GetUserChatsRequestPayload,
            });
            const body = await response.json<GetUserChatsRequestResponse>();

            return {
                ok: true,
                chats: sortUserChats(body.chats),
            };

        } catch (e) {
            return await handleError(e);
        }
    },
    async searchUsers({take, skip, query}: SearchUsersRequestPayload) {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            return null;
        }

        try {
            const response = await ky(searchUsersUrl, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                json: {
                    take, skip, query,
                } satisfies SearchUsersRequestPayload,
            });
            return await response.json<SearchUsersRequestResponse>();

        } catch (e) {
            return await handleError(e);
        }
    },
    async openPrivateChat(profileId: number) {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            return null;
        }

        try {
            const response = await ky(openPrivateChatUrl, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                json: {
                    targetProfileId: profileId,
                } satisfies OpenPrivateChatRequestPayload,
            });
            return await response.json<OpenPrivateChatRequestResponse>();

        } catch (e) {
            return handleError(e);
        }
    },
    async openChat(chatId: string) {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            return null;
        }

        try {
            const response = await ky(openChatUrl, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                json: {
                    chatId,
                } satisfies OpenChatRequestPayload,
            });
            return await response.json<OpenChatRequestResponse>();

        } catch (e) {
            return handleError(e);
        }
    },
    async sendText(chatId: string, text: string) {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            return null;
        }

        try {
            const response = await ky(sendTextUrl, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                json: {
                    chatId,
                    content: text,
                } satisfies SendTextMessageRequestPayload,
            });
            return await response.json<SendTextMessageRequestResponse>();

        } catch (e) {
            return handleError(e);
        }
    },
    async sendVoice(chatId: string, audioBlob: Blob) {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            return null;
        }

        const formData = new FormData();
        formData.append("audio", audioBlob, "voice-message.webm");

        try {
            const response = await ky(sendVoiceUrl, {
                method: "post",
                headers: {
                    Authorization: `Bearer ${access}`,
                },
                body: formData,
                searchParams: {
                    chatId
                }
            });
            return await response.json<SendVoiceMessageRequestResponse>();

        } catch (e) {
            return handleError(e);
        }
    }
};

export default chatsService;
