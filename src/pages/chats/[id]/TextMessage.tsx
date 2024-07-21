import {MessageTextType} from "../../../types/message.ts";
import getMessageTime from "../../../utils/getMessageTime.ts";
import cls from "./Messages.module.scss";

export default function TextMessage(props: { data: MessageTextType } & { me: boolean }) {
    return <div class={cls.message_wrapper} data-me={props.me}>
        <article class={cls.message} >
            <span class={cls.message__text}>{props.data.content}</span>
            <span class={cls.message__created_at}>{getMessageTime(props.data.createdAt)}</span>
        </article>
    </div>;
}