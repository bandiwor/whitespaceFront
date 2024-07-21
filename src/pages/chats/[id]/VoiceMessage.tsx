import ky from "ky";
import {createSignal, onCleanup, Show} from "solid-js";
import {getFileUrl} from "../../../constants/api.ts";
import {MessageVoiceType} from "../../../types/message.ts";
import cls from "./Messages.module.scss";

const downloadBlobByFileUrl = async (file: string) => {
    try {
        const response = await ky(getFileUrl(file));
        return await response.blob();
    } catch {
        return null;
    }
};

export default function VoiceMessage(props: { data: MessageVoiceType } & { me: boolean }) {
    const [isPlaying, setIsPlaying] = createSignal(false);
    const [isLoading, setIsLoading] = createSignal(false);
    const [audio, setAudio] = createSignal<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = createSignal(0);
    const [duration, setDuration] = createSignal(0);
    const [isError, setIsError] = createSignal(false);

    const playPauseAudio = async () => {
        if (!audio()) {
            setIsLoading(true);
            try {
                const blob = await downloadBlobByFileUrl(props.data.audioUrl);
                if (!blob) {
                    setIsLoading(false);
                    setIsError(true);
                    return;
                }
                const audioElement = new Audio(URL.createObjectURL(blob));
                setAudio(audioElement);
                audioElement.addEventListener("loadedmetadata", () => {
                    console.log(audioElement.duration);
                    setDuration(Math.round(audioElement.duration));
                    setIsLoading(false);
                    audioElement.play();
                    setIsPlaying(true);
                });
                audioElement.addEventListener("timeupdate", () => {
                    setCurrentTime(Math.round(audioElement.currentTime));
                });
                audioElement.addEventListener("ended", () => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                });
            } catch (error) {
                setIsLoading(false);
                console.error("Failed to load audio", error);
            }
        } else {
            if (isPlaying()) {
                audio()?.pause();
                setIsPlaying(false);
            } else {
                await audio()?.play();
                setIsPlaying(true);
            }
        }
    };

    onCleanup(() => {
        const currentAudio = audio();
        if (!currentAudio) {
            return;
        }

        currentAudio.pause();
        currentAudio.src = '';
        setAudio(null);
    });

    return (
        <div class={`${cls.message_wrapper} ${props.me ? "justify-end" : ""}`}>
            <article class={cls.message}>
                <div class="flex items-center gap-2">
                    <Show when={!isLoading()} fallback={
                        <div class="text-text-weak">Загрузка...</div>
                    }>
                        <Show when={!isError()} fallback={
                            <div class={"text-red"}>Ошибка</div>
                        }>
                            <button onClick={playPauseAudio} class="text-xl">
                                {isPlaying() ? "⏸️" : "▶️"}
                            </button>
                            <span class="text-sm text-gray-500">
                                {isPlaying() ? `${currentTime()} сек` : `${duration()} сек`}
                            </span>
                        </Show>
                    </Show>
                </div>
            </article>
        </div>
    );
}
