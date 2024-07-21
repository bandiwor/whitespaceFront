import {A} from "@solidjs/router";
import {createEffect, Match, Show, Switch} from "solid-js";
import {userProfileImageFallback} from "../../../constants/images.ts";
import {ChatActionType} from "../../../contexts/WebSocketContext/WebSocketContext.tsx";
import {ArrowLeftIcon, MoreGridIcon} from "../../../icons/SvgIcons.tsx";
import formatLastSeenAt from "../../../utils/formatLastSeenAt.ts";
import cls from "./Chat[id]Page.module.scss";

export default function ChatHeader({chatAction, chatName, chatCompanionLink, lastSeenAt, companionIsOnline}: {
    companionIsOnline: () => boolean,
    lastSeenAt: () => string | undefined,
    chatName: () => string,
    chatCompanionLink: () => string,
    chatAction: () => ChatActionType | null,
}) {

    createEffect(() => {
        console.log(chatAction());
    })

    return <header class={cls.chat_header}>
        <A href={"/chats"} class={cls.back_button}>
            <ArrowLeftIcon/>
        </A>
        <div class={cls.companion}>
            <h2 class={cls.name}>{chatName()}</h2>
            <Show when={lastSeenAt()}>
                <div class={cls.last_seen_at}>
                    <Switch
                        fallback={
                            <Show when={!companionIsOnline()} fallback={"В сети"}>
                                {formatLastSeenAt(lastSeenAt())}
                            </Show>
                        }
                    >
                        <Match when={chatAction() === 'typing'}>Печатает...</Match>
                    </Switch>
                </div>
            </Show>
        </div>
        <div class={cls.other}>
            <div class={cls.chat_actions}>
                <button class={cls.open_chat_actions}>
                    <MoreGridIcon/>
                </button>
            </div>
            <A href={chatCompanionLink()}>
                <img class={cls.user_avatar} src={userProfileImageFallback} alt="" width={40} height={40}/>
            </A>
        </div>
    </header>;
}