import ThemeToggleButton from "../ui/button/ThemeToggleButton.tsx";
import cls from "./Header.module.scss";
import HeaderAccount from "./HeaderAccount.tsx";
import HeaderLogo from "./HeaderLogo.tsx";
import MobileMenu from "./MobileMenu.tsx";


export default function Header() {
    return <header class={cls.header}>
        <HeaderLogo/>
        <HeaderAccount/>
        <MobileMenu/>
        <ThemeToggleButton class={cls.theme_switcher}/>
    </header>;
}