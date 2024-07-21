import {JSX} from "solid-js";
import {ThemeIcon, useThemeContext} from "../../../contexts/ThemeContext/ThemeContext.tsx";
import cls from "./ThemeToggleButton.module.scss";

export type ThemeToggleButtonProps = Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    onClick?: (e: Event) => void
}

export default function ThemeToggleButton({class: class_, onClick, ...props}: ThemeToggleButtonProps) {
    const themeContext = useThemeContext();

    return (
        <button onClick={(evt) => {
            if (onClick) onClick(evt)
            themeContext.setNextTheme();
        }} class={`${class_} ${cls.button}`.trim()} {...props}>
            <span class={"visually-hidden"}>{themeContext.themeTitle()}</span>
            <div title={themeContext.themeTitle()}>
                {ThemeIcon({theme: themeContext.currentTheme()})}
            </div>
        </button>
    );
}