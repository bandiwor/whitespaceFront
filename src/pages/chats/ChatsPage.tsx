import {createEffect, Match, Show, Switch} from "solid-js";
import {useChatsList} from "../../contexts/ChatsListContext/ChatsListContext.tsx";
import ChatsListSearch from "./ChatsListSearch.tsx";
import cls from "./ChatsPage.module.scss";
import FoundProfilesChatsList from "./FoundProfilesChatsList.tsx";
import NoChatsBanner from "./NoChatsBanner.tsx";
import NoFoundChats from "./NoFoundChats.tsx";
import UserChatsList from "./UserChatsList.tsx";

export default function ChatsPage() {
    const chatsList = useChatsList();

    createEffect(() => {
        if (chatsList.isUnauthorized()) {
            throw new Error("Unauthorized");
        }
    });

    return (
        <main class={cls.page}>
            <ChatsListSearch/>
            <Switch>
                <Match when={chatsList.chatsListShowType() === "MY-CHATS"}>
                    <Show when={chatsList.userChats().length} fallback={<NoChatsBanner/>}>
                        <UserChatsList/>
                    </Show>
                </Match>
                <Match when={chatsList.chatsListShowType() === "SEARCH-USERS"}>
                    <Show when={chatsList.foundUsers().length} fallback={<NoFoundChats/>}>
                        <FoundProfilesChatsList/>
                    </Show>
                </Match>
            </Switch>
        </main>
    );
}
