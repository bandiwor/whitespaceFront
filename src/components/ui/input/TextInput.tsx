import {createUniqueId, JSX, Show} from "solid-js";
import cls from "./TextInput.module.scss";

export type TextInputProps = Omit<JSX.HTMLAttributes<HTMLInputElement>, "aria-labelledby"> & {
    value?: () => string,
    label?: string,
    type?: "text" | "password" | "email" | "number",
    typeCallback?: () => TextInputProps["type"],
    name?: string,
    placeholder?: string
};

export default function TextInput({value, label, title, typeCallback, type = "text", ...props}: TextInputProps) {
    const labelId = createUniqueId();
    const labelOrTitle = label || title;

    return <>
        <Show when={labelOrTitle}>
            <span id={labelId} class="visually-hidden">{labelOrTitle}</span>
        </Show>
        <input {...props} value={value?.()} class={cls.input} title={labelOrTitle}
               aria-labelledby={labelOrTitle ? labelId : undefined} type={typeCallback ? typeCallback() : type}/>
    </>;
}