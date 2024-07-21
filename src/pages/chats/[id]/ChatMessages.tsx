import {For} from "solid-js";
import {MessageType} from "../../../types/message.ts";
import cls from "./Chat[id]Page.module.scss";
import ChatMessage from "./ChatMessage.tsx";


export default function ChatMessages({messages, myId, ref}: {ref: HTMLDivElement, myId: () => number | null, messages: () => MessageType[]}) {

    return <div class={cls.chat_messages} ref={ref}>
        <For each={messages()}>
            {message => {


                return <ChatMessage me={myId() === message.profileId} {...message}/>
            }}
        </For>
    </div>
}