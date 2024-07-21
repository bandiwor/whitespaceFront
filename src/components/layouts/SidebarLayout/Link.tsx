import {A} from "@solidjs/router";
import {NavLink} from "../../header/links.tsx";
import cls from "./SidebarLayout.module.scss";

export default function Link({href, icon, label}: NavLink) {
    return <li class={cls.list__item} title={label}>
        <span class={'visually-hidden'}>{label}</span>
        <A class={cls.link} href={href} activeClass={cls.active}>
            {icon}
            <span class={cls.link__label}>{label}</span>
        </A>
    </li>
}