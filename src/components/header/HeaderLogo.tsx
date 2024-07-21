import cls from "./HeaderLogo.module.scss";
import {A} from "@solidjs/router";
import HeaderLogoImage from "./HeaderLogoImage.tsx";

export default function HeaderLogo({href = '/', disableHover = false}: {href?: string, disableHover?: boolean}) {
    return <A href={href} class={cls.logo} title={'Перейти на Главную'}>
        <span class={'visually-hidden'}>Перейти на главную</span>
        <HeaderLogoImage />
        <p lang={'en'} class={`${cls.label} ${cls.full} ${!disableHover ? cls.hover_effect : ''}`}>White Space</p>
        <p lang={'en'} class={`${cls.label} ${cls.short} ${!disableHover ? cls.hover_effect : ''}`}>Space</p>
    </A>
}