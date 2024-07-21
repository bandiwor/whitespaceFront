import {A} from "@solidjs/router";
import {For} from "solid-js";
import ThemeToggleButton from "../ui/button/ThemeToggleButton.tsx";
import HeaderLogo from "./HeaderLogo.tsx";
import links from "./links";
import cls from "./MobileMenu.module.scss";


export default function MobileMenuOverlay({toggle, ref}: {
    ref?: HTMLDialogElement,
    toggle: () => void
}) {
    return <dialog class={cls.mobile_overlay} ref={ref}>
        <header
            class="w-full h-header flex justify-between items-center p-2 border-b border-gray-soft shadow-xl fixed bg-background">
            <HeaderLogo/>
            <button onClick={toggle} class={`${cls.mobile_burger} text-text`} classList={{[cls.opened]: true}}>
            </button>
        </header>
        <ThemeToggleButton class={cls.theme_switcher}/>
        <div class={cls.wrapper}>
            <ul class={cls.list}>
                <For each={links}>
                    {link =>
                        <li onClick={toggle} class={cls.item}>
                            <A href={link.href} class={cls.link}>
                                {link.icon}
                                <span>{link.label}</span>
                            </A>
                        </li>}
                </For>
            </ul>
        </div>
    </dialog>;
}