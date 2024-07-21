import {MessageType} from "../../../types/message.ts";
import TextMessage from "./TextMessage.tsx";
import VoiceMessage from "./VoiceMessage.tsx";

export type ChatMessageProps = MessageType & {
    me: boolean
}


export default function ChatMessage(props: ChatMessageProps) {
    if (props.type === "TEXT") return <TextMessage data={props} me={props.me}/>;
    if (props.type === 'VOICE') return <VoiceMessage data={props} me={props.me}/>
}