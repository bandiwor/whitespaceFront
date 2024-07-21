import {For} from "solid-js";
import {publicChatImageFallback, userProfileImageFallback} from "../../constants/images.ts";
import {useChatsList} from "../../contexts/ChatsListContext/ChatsListContext.tsx";
import ChatsListItem from "./ChatsListItem.tsx";
import cls from "./ChatsPage.module.scss";

export default function UserChatsList() {
    const chatsList = useChatsList();

    const filteredChats = () => chatsList.userChats().filter(chat => {
        const query = chatsList.searchQuery().toLowerCase();
        if (chat.type === "PRIVATE") {
            return chat.profile.firstName.toLowerCase().includes(query)
                || chat.profile.lastName.toLowerCase().includes(query)
                || chat.profile.username?.toLowerCase().includes(query);
        }
        return chat.name.toLowerCase().includes(query);
    });

    return (
        <section class={cls.chats_list}>
            <For each={filteredChats()}>
                {chat => {
                    const chatTitle = chat.type === "PRIVATE" ? `${chat.profile.firstName} ${chat.profile.lastName}` : chat.name;
                    const chatAvatar = chat.type === "PRIVATE"
                        ? (chat.profile.avatarUrl ?? userProfileImageFallback)
                        : (chat.avatar ?? publicChatImageFallback);
                    const lastMessage = chat.messages.length > 0 ? chat.messages[0] : null;

                    return (
                        <ChatsListItem
                            href={`/chats/${chat.id}`}
                            chatTitle={chatTitle}
                            chatAvatar={chatAvatar}
                            lastMessageText={lastMessage?.content}
                            lastMessageDate={lastMessage?.createdAt}
                        />
                    );
                }}
            </For>
        </section>
    );
}
