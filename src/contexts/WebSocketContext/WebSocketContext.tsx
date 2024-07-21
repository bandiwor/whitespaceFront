import {io, Socket} from "socket.io-client";
import {createContext, createSignal, JSX, onCleanup, onMount, useContext} from "solid-js";
import {backendUrl} from "../../constants/api";
import authService from "../../services/auth.service";
import {ChatType} from "../../types/chat";
import {MessageType} from "../../types/message";

export type IncomingMessageHandler = (message: MessageType) => void;
export type PrivateChatOpenedHandler = (chat: ChatType) => void;
export type ChatActionHandler = (action: ChatActionResponseType) => void;

export type SocketStatusType = "loading" | "disconnected" | "connected";

export type ChatActionType = "typing";

export type ChatActionResponseType = {
    actionType: ChatActionType,
    senderId: number,
    chatId: string,
}

export type WebSocketContextType = {
    status: () => SocketStatusType,
    isUnauthorized: () => boolean,

    subscribeToIncomingMessages: (callback: IncomingMessageHandler) => void
    unSubscribeToIncomingMessages: (callback: IncomingMessageHandler) => void

    subscribeToPrivateChatOpened: (callback: PrivateChatOpenedHandler) => void
    unSubscribeToPrivateChatOpened: (callback: PrivateChatOpenedHandler) => void

    subscribeToChatActions: (callback: ChatActionHandler) => void
    unSubscribeToChatActions: (callback: ChatActionHandler) => void

    sendChatAction: (chatId: string, actionType: ChatActionType) => void

    getUserIsOnline: (profileId: number) => Promise<boolean>,
}

const WebSocketContext = createContext<WebSocketContextType>();

export const WebSocketProvider = (props: { children: JSX.Element }) => {
    const [isUnauthorized, setIsUnauthorized] = createSignal(false);
    const [status, setStatus] = createSignal<SocketStatusType>("disconnected");
    const incomingMessageSubscribers = new Set<IncomingMessageHandler>();
    const privateChatOpenedSubscribers = new Set<PrivateChatOpenedHandler>();
    const chatActionsSubscribers = new Set<ChatActionHandler>();

    let socket: Socket;

    const subscribeToIncomingMessages: WebSocketContextType["subscribeToIncomingMessages"] = (cb) => {
        incomingMessageSubscribers.add(cb);
    };
    const subscribeToPrivateChatOpened: WebSocketContextType["subscribeToPrivateChatOpened"] = (cb) => {
        privateChatOpenedSubscribers.add(cb);
    };
    const subscribeToChatActions: WebSocketContextType["subscribeToChatActions"] = (cb) => {
        chatActionsSubscribers.add(cb);
    };

    const unSubscribeToIncomingMessages: WebSocketContextType["unSubscribeToIncomingMessages"] = (cb) => {
        incomingMessageSubscribers.delete(cb);
    };
    const unSubscribeToPrivateChatOpened: WebSocketContextType["unSubscribeToPrivateChatOpened"] = (cb) => {
        privateChatOpenedSubscribers.delete(cb);
    };
    const unSubscribeToChatActions: WebSocketContextType["unSubscribeToChatActions"] = (cb) => {
        chatActionsSubscribers.delete(cb);
    };

    const getUserIsOnline: WebSocketContextType["getUserIsOnline"] = (profileId) => {
        return new Promise<boolean>(resolve => {
            if (!socket.connected) {
                resolve(false);
            }

            socket.emit("getUserIsOnline", {profileId}, (value: boolean) => {
                resolve(value);
            });
        });
    };

    const sendChatAction: WebSocketContextType["sendChatAction"] = (chatId, action) => {
        socket.emit("sendChatAction", {
            chatId,
            actionType: action
        });
    };

    const connect = async () => {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) {
            setStatus("disconnected");
            return void setIsUnauthorized(true);
        }
        socket = io(backendUrl, {
            query: {
                accessToken: access,
            },
            path: "/socket.io",
            transports: ["websocket"],
        });
        socket.on("connect", () => {
            console.log("Connected to WebSocket!");
            setStatus("connected");
        });
        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
            setStatus("disconnected");
        });
        socket.on("incomingMessage", (data: MessageType) => {
            incomingMessageSubscribers.forEach(sub => sub(data));
        });
        socket.on("privateChatOpened", (data: ChatType) => {
            privateChatOpenedSubscribers.forEach(sub => sub(data));
        });
        socket.on("chatAction", (data: ChatActionResponseType) => {
            chatActionsSubscribers.forEach(sub => sub(data));
        });
    };

    onMount(() => {
        setStatus("loading");
        void connect();
    });
    onCleanup(() => {
        setStatus("disconnected");
        socket?.disconnect();
    });

    const value: WebSocketContextType = {
        status,
        subscribeToIncomingMessages,
        unSubscribeToIncomingMessages,
        subscribeToPrivateChatOpened,
        unSubscribeToPrivateChatOpened,
        isUnauthorized,
        getUserIsOnline,
        subscribeToChatActions,
        unSubscribeToChatActions,
        sendChatAction,
    };

    return <WebSocketContext.Provider value={value}>
        {props.children}
    </WebSocketContext.Provider>;
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocketContext must be used within a WebSocketProvider");
    }
    return context;
};
