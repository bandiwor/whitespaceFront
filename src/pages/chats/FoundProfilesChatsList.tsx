import {For} from "solid-js";
import {userProfileImageFallback} from "../../constants/images.ts";
import {useChatsList} from "../../contexts/ChatsListContext/ChatsListContext.tsx";
import ChatsListItem from "./ChatsListItem.tsx";
import cls from "./ChatsPage.module.scss";

export default function FoundProfilesChatsList() {
    const chatsList = useChatsList();

    return (
        <section class={cls.chats_list}>
            <For each={chatsList.foundUsers()}>
                {chat => (
                    <ChatsListItem
                        chatTitle={`${chat.firstName} ${chat.lastName}`}
                        chatAvatar={chat.avatarUrl ?? userProfileImageFallback}
                        href={`/chat/open?id=${chat.id}&type=private`}
                    />
                )}
            </For>
        </section>
    );
}
