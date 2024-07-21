import {JSX, Show} from "solid-js";
import {useChatsList} from "../../contexts/ChatsListContext/ChatsListContext.tsx";
import {LoadingIcon, MagnifyingGlassIcon} from "../../icons/SvgIcons.tsx";
import cls from "./ChatsPage.module.scss";

export default function ChatsListSearch() {
    const chatsList = useChatsList();

    const handleSubmit = (event: Event) => {
        event.preventDefault();

        if (chatsList.searchQuery().trim() === "") {
            chatsList.setSearchBy("MY-CHATS");
        } else {
            const showType = chatsList.chatsListShowType();
            chatsList.setSearchBy(showType === "MY-CHATS" ? "SEARCH-USERS" : showType);
        }
    };

    const handleSearchInput: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
        const query = event.currentTarget.value.trim();
        chatsList.setSearchBy(query === "" ? "MY-CHATS" : chatsList.chatsListShowType());
        chatsList.setSearchQuery(query);
    };

    return (
        <form onSubmit={handleSubmit} class={cls.search_form}>
            <div class={cls.input_wrapper}>
                <input
                    readOnly={chatsList.isLoading()}
                    value={chatsList.searchQuery()}
                    onInput={handleSearchInput}
                    type="search"
                    placeholder="Поиск.."
                    class={cls.search_field}
                />
                <button
                    disabled={chatsList.isLoading()}
                    classList={{[cls.loading]: chatsList.isLoading()}}
                    title="Искать"
                    type="submit"
                    class={cls.search_button}
                >
                    <span class="visually-hidden">Начать искать</span>
                    <Show when={chatsList.isLoading()} fallback={<MagnifyingGlassIcon/>}>
                        <LoadingIcon/>
                    </Show>
                </button>
            </div>
        </form>
    );
}
