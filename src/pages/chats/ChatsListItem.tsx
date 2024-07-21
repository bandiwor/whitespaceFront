import { A } from "@solidjs/router";
import { Show } from "solid-js";
import formatMessageTime from "../../utils/formatMessageTime.ts";
import cls from "./ChatsPage.module.scss";

export interface ChatsListItemProps {
    chatTitle: string;
    chatAvatar: string;
    lastMessageText?: string;
    lastMessageDate?: string;
    href: string;
}

export default function ChatsListItem(
    { chatAvatar, chatTitle, lastMessageDate, lastMessageText, href }: ChatsListItemProps,
) {
    return (
        <A href={href}>
            <article class={cls.chat} title={`Открыть чат ${chatTitle}`}>
                <div class={cls.user}>
                    <img src={chatAvatar} width={64} height={64} alt="" class={cls.avatar} />
                    <div class={cls.title_and_message}>
                        <h2 class={cls.chat_name}>{chatTitle}</h2>
                        <Show when={!!lastMessageText}>
                            <div class={cls.last_message}>
                                {lastMessageText}
                            </div>
                        </Show>
                    </div>
                </div>
                <Show when={!!lastMessageDate}>
                    <div class={cls.message_sent_at}>
                        {formatMessageTime(lastMessageDate || "")}
                    </div>
                </Show>
            </article>
        </A>
    );
}
