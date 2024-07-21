import {JSX} from "solid-js";
import {FriendsIcon, HelpSquareIcon, MessagesIcon, NewsIcon, ProfileIcon, SettingsIcon} from "../../icons/SvgIcons.tsx";


export type NavLink = {
    id: string,
    label: string,
    href: string,
    icon: JSX.Element,
}

export type NavLinks = NavLink[];

const links: NavLinks = [
    {label: "Профиль", href: "/profile", id: "profile", icon: ProfileIcon},
    {label: "Новости", href: "/news", id: "news", icon: NewsIcon},
    {label: "Сообщения", href: "/chats", id: "messenger", icon: MessagesIcon},
    {label: "Друзья", href: "/friends", id: "friends", icon: FriendsIcon},
    {label: "Настройки", href: "/settings", id: "settings", icon: SettingsIcon},
    {label: "Помощь", href: "/help", id: "help", icon: HelpSquareIcon},
];

export default links;
