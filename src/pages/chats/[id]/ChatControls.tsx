import {createSignal, JSX, onCleanup, onMount, Show} from "solid-js";
import {useWebSocket} from "../../../contexts/WebSocketContext/WebSocketContext.tsx";
import {AttachFilesIcon, MicrophoneIcon, SendIcon} from "../../../icons/SvgIcons.tsx";
import chatsService from "../../../services/chats.service.ts";
import cls from "./Chat[id]Page.module.scss";

export default function ChatControls({chatId}: { chatId: () => string | undefined }) {
    const [message, setMessage] = createSignal("");
    const [isSending, setIsSending] = createSignal(false);
    const [isVoiceRecording, setIsVoiceRecording] = createSignal(false);
    const [voiceDuration, setVoiceDuration] = createSignal<number>(0);

    let startRecordingTime: number = 0;
    let durationUpdateIntervalId: number = 0;
    let microphone: MediaRecorder | null = null;
    let voiceData: Blob[] = [];

    let lastTypingTime = 0;
    const socket = useWebSocket();

    onMount(() => {
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                microphone = new MediaRecorder(stream);
                microphone.addEventListener("dataavailable", handleDataAvailable);
            });

        // Cleanup on component unmount
        onCleanup(() => {
            microphone?.removeEventListener("dataavailable", handleDataAvailable);
            clearInterval(durationUpdateIntervalId);
        });
    });

    const onFormSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (evt) => {
        evt.preventDefault();
        handleSendMessage();
    };

    const handleSendMessage = () => {
        const _chatId = chatId();
        if (!_chatId) {
            return;
        }

        const text = message().trim();
        setMessage("");
        if (!text) {
            return;
        }

        setIsSending(true);

        const request = async () => {
            const response = await chatsService.sendText(_chatId, text);
            if (!response || !response.ok) {
                return;
            }
        };

        request().then(() => {
            setIsSending(false);
        });
    };

    const handleChangeMessage: JSX.EventHandler<HTMLInputElement, Event> = (evt) => {
        setMessage(evt.currentTarget.value);

        const deltaTime = Date.now() - lastTypingTime;
        if (deltaTime > 3_000) {
            sendTypingAction();
            lastTypingTime = Date.now();
        }
    };

    const sendTypingAction = () => {
        const chatId_ = chatId();
        if (!chatId_) return;

        socket.sendChatAction(chatId_, "typing");
    };

    function handleDataAvailable(event: BlobEvent) {
        voiceData.push(event.data);
    }

    const handleMicrophoneDown = () => {
        if (!microphone) {
            return alert("Для записи голосовых сообщений необходимо предоставить доступ/разрешение для использования микрофона.\nПосле предоставления разрешения ПЕРЕЗАГРУЗИТЕ страницу.");
        }
        microphone.start();

        setIsVoiceRecording(true);
        startRecordingTime = Date.now();

        durationUpdateIntervalId = setInterval(() => {
            setVoiceDuration(Date.now() - startRecordingTime);
        }, 50);
    };

    const handleMicrophoneUp = () => {
        if (microphone?.state === "recording") {
            microphone.stop();
            microphone.addEventListener("stop", async () => {
                setIsVoiceRecording(false);
                const totalRecordingTime = Date.now() - startRecordingTime;
                if (totalRecordingTime < 500) {
                    clearInterval(durationUpdateIntervalId);
                    setVoiceDuration(0);
                    voiceData = [];
                    return;
                }

                clearInterval(durationUpdateIntervalId);
                setVoiceDuration(totalRecordingTime);

                const audioBlob = new Blob(voiceData, {type: "audio/webm"});

                const _chatId = chatId();
                if (_chatId) {
                    setIsSending(true);
                    await chatsService.sendVoice(_chatId, audioBlob);
                    setIsSending(false);
                }

                voiceData = [];
            }, {once: true});
        }
    };

    return (
        <form onSubmit={onFormSubmit} class={cls.chat_controls}>
            <Show when={!isVoiceRecording()} fallback={
                <div class={cls.voice_recording}>
                    <p class={cls.recording_info}>
                        <span>Аудиосообщение </span>
                        <span class={"text-xl"}>{(voiceDuration() / 1000).toFixed(2)}</span>
                        <span> с.</span>
                    </p>
                </div>
            }>
                <div class={cls.attach_file}>
                    <button disabled={isSending()} type={"button"} class={"align-middle"}>
                        <AttachFilesIcon/>
                    </button>
                </div>
                <input onInput={handleChangeMessage} value={message()} placeholder={"Сообщение..."}
                       class={cls.text_input_field} type="text"/>
            </Show>
            <div class={cls.send_message}>
                <Show when={message()} fallback={
                    <button disabled={isSending()} onMouseDown={handleMicrophoneDown} onMouseUp={handleMicrophoneUp} type={"button"}
                            class={"align-middle"}>
                        <MicrophoneIcon/>
                    </button>
                }>
                    <button disabled={isSending()} type="submit" class={"align-middle"}>
                        <SendIcon/>
                    </button>
                </Show>
            </div>
        </form>
    );
}
