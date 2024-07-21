import {createContext, createEffect, createSignal, JSX, onCleanup, onMount, useContext} from "solid-js";
import chatsService from "../../services/chats.service.ts";
import {ChatWithMessagesType} from "../../types/chat.ts";
import {MessageType} from "../../types/message.ts";
import {UserProfileType} from "../../types/profile.ts";
import sortUserChats from "../../utils/sortUserChats.ts";
import {useAccount} from "../AccountContext/AccountContext.tsx";
import {IncomingMessageHandler, PrivateChatOpenedHandler, useWebSocket} from "../WebSocketContext/WebSocketContext.tsx";

export const chatsPageSize = 50;
type ChatsListShowType = "MY-CHATS" | "SEARCH-PUBLIC-CHATS" | "SEARCH-USERS";


type ChatListContextType = {
    userChats: () => ChatWithMessagesType[],
    userChatsPage: () => number,
    chatsListShowType: () => ChatsListShowType,

    isLoading: () => boolean,
    isUnauthorized: () => boolean

    searchQuery: () => string;
    setSearchQuery: (string: string) => void;

    setChatsListShowType: (type: ChatListContextType) => void,
    setUserChatsPage: (page: number) => void,

    setSearchBy: (query: ChatsListShowType) => void,

    foundUsers: () => UserProfileType[],
}

const ChatListContext = createContext<ChatListContextType>();

export const ChatsListProvider = (props: { children: JSX.Element }) => {
    const [isLoading, setIsLoading] = createSignal<boolean>(false);
    const [chatsListShowType, setChatsListShowType] = createSignal<ChatsListShowType>("MY-CHATS");
    const [userChatsPage, setUserChatsPage] = createSignal(0);
    const [isUnauthorized, setIsUnauthorized] = createSignal<boolean>(false);
    const [searchQuery, setSearchQuery] = createSignal("");
    const [foundUsers, setFoundUsers] = createSignal<UserProfileType[]>([]);
    const [userChats, setUserChats] = createSignal<ChatWithMessagesType[]>([]);

    const webSocket = useWebSocket();
    const account = useAccount();

    const setSearchBy = (query: ChatsListShowType) => {
        switch (query) {
            case "MY-CHATS":
                setChatsListShowType(query);
                setFoundUsers([]);
                break;
            case "SEARCH-USERS":
                setChatsListShowType(query);
                setIsLoading(true);
                fetchUsers().then(res => {
                    if (res === null) {
                        return void setIsUnauthorized(true);
                    }
                    setIsLoading(false);
                    setFoundUsers(res);
                });
        }
    };

    const fetchUserChats = async () => {
        const response = await chatsService.getChats(chatsPageSize, chatsPageSize * userChatsPage());
        if (response === null) {
            return null;
        }
        if (response.ok) {
            return response.chats;
        } else {
            console.log(response);
            return [] as [];
        }
    };

    const fetchUsers = async () => {
        const response = await chatsService.searchUsers({
            query: searchQuery(),
            skip: chatsPageSize * userChatsPage(),
            take: chatsPageSize,
        });
        if (response === null) {
            return null;
        }
        if (response.ok) {
            return response.users;
        } else {
            console.log(response);
            return [] as [];
        }
    };

    const onIncomingMessage: IncomingMessageHandler = (msg) => {
        setUserChats(
            sortUserChats(
                userChats().map((chat) => (
                    chat.id !== msg.chatId ? chat : {...chat, messages: [msg]}
                )),
            ),
        );
    };

    const onPrivateChatOpened: PrivateChatOpenedHandler = (chat) => {
        setUserChats(
            sortUserChats(
                [Object.assign(chat, {messages: []} as { messages: MessageType[] }), ...userChats()],
            ),
        );
    };

    const loadChats = () => {
        setIsLoading(true);

        const request = async () => {
            const chats = await fetchUserChats();
            if (chats === null) {
                return void setIsUnauthorized(true);
            }
            setUserChats(chats);
        };

        request().then(() => {
            setIsLoading(false);
        });
    };

    onMount(() => {
        loadChats();
        webSocket.subscribeToIncomingMessages(onIncomingMessage);
        webSocket.subscribeToPrivateChatOpened(onPrivateChatOpened);
    });

    onCleanup(() => {
        webSocket.unSubscribeToIncomingMessages(onIncomingMessage);
        webSocket.unSubscribeToPrivateChatOpened(onPrivateChatOpened);
    });

    createEffect(() => {
        if (account.isUnauthorized()) {
            console.log("remove chats");
            setUserChats([]);
        } else {
            console.log("chats load");
            loadChats();
        }
    });

    const value: ChatListContextType = {
        isLoading,
        userChats,
        chatsListShowType,
        userChatsPage,
        setUserChatsPage,
        setChatsListShowType,
        setSearchBy,
        isUnauthorized,
        searchQuery,
        setSearchQuery,
        foundUsers,
    };

    return <ChatListContext.Provider value={value}>
        {props.children}
    </ChatListContext.Provider>;
};

export function useChatsList() {
    const context = useContext(ChatListContext);
    if (!context) {
        throw new Error("<ChatsListProvider> parent not found");
    }
    return context;
}
