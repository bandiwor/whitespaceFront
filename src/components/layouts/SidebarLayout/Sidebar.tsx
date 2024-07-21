import LinksList from "./LinksList.tsx";
import cls from "./SidebarLayout.module.scss";

export default function Sidebar() {
    return <aside class={cls.sidebar}>
        <nav class={cls.navigation}>
            <LinksList />
        </nav>
    </aside>
}