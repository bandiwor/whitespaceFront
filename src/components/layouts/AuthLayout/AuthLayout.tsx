import {A, RouteSectionProps} from "@solidjs/router";
import {Component, JSX} from "solid-js";
import HeaderLogo from "../../header/HeaderLogo.tsx";
import ThemeToggleButton from "../../ui/button/ThemeToggleButton.tsx";
import cls from "./AuthLayout.module.scss";


const AuthLayout: Component<RouteSectionProps<{ children: JSX.Element }>> = ({children}) => {
    return <div class={cls.layout}>
        <div class={cls.header_wrapper}>
            <header class={cls.header}>
                <HeaderLogo/>
                <div class={cls.controls}>
                    <A class={cls.help_link} href={"/help?type=login&place=header"}>Помощь</A>
                    <ThemeToggleButton class={cls.theme_button}/>
                </div>
            </header>
        </div>
        <div class={cls.content}>
            {children}
        </div>
    </div>;
};

export default AuthLayout;
