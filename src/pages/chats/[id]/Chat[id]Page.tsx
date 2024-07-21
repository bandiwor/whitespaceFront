import {useNavigate, useParams} from "@solidjs/router";
import {createSignal, onMount, Show} from "solid-js";
import {useAccount} from "../../../contexts/AccountContext/AccountContext.tsx";
import chatsService from "../../../services/chats.service.ts";
import {ChatWithMessagesType} from "../../../types/chat.ts";
import Chat from "./Chat.tsx";
import cls from "./Chat[id]Page.module.scss";


export default function ChatIdPage() {
    const params = useParams<{ id: string }>();
    const account = useAccount();
    const myId = () => account.profile()?.id ?? null;
    const [isLoading, setIsLoading] = createSignal(false);
    const [chat, setChat] = createSignal<ChatWithMessagesType | null>(null);
    const navigate = useNavigate();

    onMount(() => {
        setIsLoading(true);

        const request = async () => {
            const response = await chatsService.openChat(params.id);
            if (response === null) {
                return navigate("/auth/login");
            } else if (!response.ok) {
                return;
            }

            setChat(response.chat);
        };

        request().then(() => {
            setIsLoading(false);
        });
    });

    return <main class={cls.page}>
        <Show when={!isLoading()}>
            <Chat myId={myId} chat={chat}/>
        </Show>
    </main>;
}
