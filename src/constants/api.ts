export const backendUrl: string = "http://localhost:3000";
export const telegramBotLink = "https://t.me/whitespace_official_bot";

export const getTelegramBotStartLink = (code: string) => {
    return `${telegramBotLink}/?start=${code}`;
};

export function joinUrls(...urls: string[] | string[][]): string {
    return Array.isArray(urls[0]) ? urls[0].join("/") : urls.join("/");
}

// Auth
export const authUrl = joinUrls(backendUrl, "auth");
export const loginUrl = joinUrls(authUrl, "login");
export const registerUrl = joinUrls(authUrl, "register");
export const createProfileUrl = joinUrls(authUrl, "create-profile");
export const refreshUrl = joinUrls(authUrl, "refresh");

// Profile
export const profileUrl = joinUrls(backendUrl, "profile");
export const myProfileUrl = joinUrls(profileUrl, "my");

// Chats
export const chatsUrl = joinUrls(backendUrl, "chats");
export const getChatsUrl = joinUrls(chatsUrl, "get-chats");
export const searchUsersUrl = joinUrls(chatsUrl, "search-users");
export const openPrivateChatUrl = joinUrls(chatsUrl, "open-private-chat");
export const openChatUrl = joinUrls(chatsUrl, "open-chat");
export const sendTextUrl = joinUrls(chatsUrl, "send-text");
export const sendVoiceUrl = joinUrls(chatsUrl, "send-voice");


// Media
export const getFileUrl = (url: string) => {
    return joinUrls(backendUrl, 'static', url)
}
