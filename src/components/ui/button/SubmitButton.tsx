import {JSX} from "solid-js";
import cls from "./SubmitButton.module.scss";

export type SubmitButtonProps = JSX.HTMLAttributes<HTMLButtonElement> & {
    disabledCallback?: () => boolean
};

export default function SubmitButton({class: class_, disabledCallback, children, ...props}: SubmitButtonProps) {
    return <button type="submit" disabled={disabledCallback?.()} class={`${class_ ?? ''} ${cls.button}`.trim()} {...props}>
        {children}
    </button>
}