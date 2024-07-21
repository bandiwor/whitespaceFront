import {useNavigate, useSearchParams} from "@solidjs/router";
import {createSignal, onMount, Show} from "solid-js";
import {LoadingIcon} from "../../../icons/SvgIcons.tsx";
import chatsService from "../../../services/chats.service.ts";
import joinMessageError from "../../../utils/joinMessageError.ts";
import cls from "./ChatOpenPage.module.scss";

export default function ChatOpenPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal('');

    async function openPrivateChat(profileId: number) {
        const response = await chatsService.openPrivateChat(profileId);
        if (response === null) {
            return navigate("/auth/login");
        }
        if (response.ok) {
            const chatId = response.chat.id;
            navigate(`/chats/${chatId}`);
            return;
        }

        setError(joinMessageError(response.message));
        setLoading(false);
    }

    onMount(() => {
        const id = +(params.id || "");
        const type = params.type || "";

        if (isNaN(id) || type !== "private") {
            return navigate("/chats");
        }

        if (type === "private") {
            return void openPrivateChat(id);
        }
    });

    return <main class={cls.page}>
        <section class={cls.chat_loading} classList={{[cls.loading]: loading()}}>
            <Show when={loading()} fallback={<p class={cls.error_message}>Ошибка при загрузке чата: {error()}</p>}>
                <div class={cls.spinner_wrapper}>
                    <LoadingIcon/>
                </div>
            </Show>
        </section>
    </main>;
}