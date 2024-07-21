import {For} from "solid-js";
import links from "../../header/links.tsx";
import Link from "./Link.tsx";
import cls from "./SidebarLayout.module.scss";

export default function LinksList() {
    return <ul class={cls.list}>
        <For each={links}>{Link}</For>
    </ul>;
}