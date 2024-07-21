import {createEffect, createSignal, onCleanup, onMount} from "solid-js";
import {
    ChatActionResponseType,
    ChatActionType,
    IncomingMessageHandler,
    useWebSocket,
} from "../../../contexts/WebSocketContext/WebSocketContext.tsx";
import {ChatWithMessagesType} from "../../../types/chat.ts";
import {MessageType} from "../../../types/message.ts";
import cls from "./Chat[id]Page.module.scss";
import ChatControls from "./ChatControls.tsx";
import ChatHeader from "./ChatHeader.tsx";
import ChatMessages from "./ChatMessages.tsx";


export default function Chat({chat, myId}: { myId: () => number | null, chat: () => (ChatWithMessagesType | null) }) {
    const [messages, setMessages] = createSignal<MessageType[]>(chat()?.messages || []);
    const [companionIsOnline, setCompanionIsOnline] = createSignal(false);
    const [currentChatAction, setCurrentChatAction] = createSignal<ChatActionType | null>(null);
    const socket = useWebSocket();
    let getUserIsOnlineIntervalId: number | null = null;
    let messagesRef!: HTMLDivElement;

    createEffect(() => {
        const profileId = companionProfileId();
        if (profileId === undefined) return;

        if (getUserIsOnlineIntervalId) {
            clearInterval(getUserIsOnlineIntervalId);
        }

        getUserIsOnlineIntervalId = setInterval(async () => {
            const isOnline = await socket.getUserIsOnline(profileId);
            setCompanionIsOnline(isOnline);
        }, 3000);
    });
    onCleanup(() => {
        if (getUserIsOnlineIntervalId) {
            clearInterval(getUserIsOnlineIntervalId);
        }
    });

    const handleIncomingMessage: IncomingMessageHandler = (message) => {
        setMessages([...messages(), message]);

        messagesRef.scroll({
            behavior: "smooth",
            top: messagesRef.scrollHeight,
        });
    };
    const handleChatAction = (action: ChatActionResponseType) => {
        if (action.chatId !== chat()?.id) return;

        setCurrentChatAction(action.actionType);
        setTimeout(() => {
            setCurrentChatAction(null);
        }, 3000);
    };

    const chatName = () => {
        const currentChat = chat();
        if (!currentChat) return "";

        return currentChat.type === "PRIVATE" ? currentChat.profile.firstName + " " + currentChat.profile.lastName : currentChat.name;
    };
    const chatCompanionLink = () => {
        const currentChat = chat();
        if (!currentChat) return "";

        return currentChat.type === "PRIVATE" ?
            (currentChat.profile.username ? `/${currentChat.profile.username}` : `/id${currentChat.profile.id}`)
            : "";
    };
    const lastSeenAt = () => {
        const currentChat = chat();
        if (!currentChat) return;

        return currentChat.type === "PRIVATE" ? currentChat.profile.lastSeenAt : undefined;
    };
    const companionProfileId = () => {
        const currentChat = chat();
        if (!currentChat) return;

        return currentChat.type === "PRIVATE" ? currentChat.profile.id : undefined;
    };
    const chatId = () => {
        return chat()?.id;
    };

    onMount(() => {
        socket.subscribeToIncomingMessages(handleIncomingMessage);
        socket.subscribeToChatActions(handleChatAction);
    });
    onCleanup(() => {
        socket.unSubscribeToIncomingMessages(handleIncomingMessage);
        socket.unSubscribeToChatActions(handleChatAction);
    });

    createEffect(() => {
        setTimeout(() => {
            messagesRef.scroll({
                behavior: "instant",
                top: messagesRef.scrollHeight,
            });
        });
    });

    return <section class={cls.chat}>
        <ChatHeader companionIsOnline={companionIsOnline} lastSeenAt={lastSeenAt} chatName={chatName}
                    chatCompanionLink={chatCompanionLink} chatAction={currentChatAction}/>
        <ChatMessages ref={messagesRef} myId={myId} messages={messages}/>
        <ChatControls chatId={chatId}/>
    </section>;
}