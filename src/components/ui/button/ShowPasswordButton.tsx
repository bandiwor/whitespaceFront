import {Accessor, Show} from "solid-js";
import {ClosedEyeIcon, OpenedEyeIcon} from "../../../icons/SvgIcons.tsx";
import cls from "./ShowPasswordButton.module.scss";


export default function ShowPasswordButton({onClick, isPasswordShow}: {
    onClick: () => void,
    isPasswordShow: Accessor<boolean>
}) {
    const buttonTitle = () => isPasswordShow() ? "Скрыть пароль" : "Показать пароль";

    return <button onClick={onClick} title={buttonTitle()} type={"button"} class={cls.button}>
        <span class={"visually-hidden"}>{buttonTitle()}</span>
        <Show when={isPasswordShow()} fallback={<ClosedEyeIcon/>}>
            <OpenedEyeIcon/>
        </Show>
    </button>;
}