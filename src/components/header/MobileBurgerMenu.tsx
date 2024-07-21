import cls from "./MobileMenu.module.scss";

const openMenuText = 'Открыть меню';
const closeMenuText = 'Закрыть меню';


export default function MobileBurgerMenu({opened, toggle}: {opened: () => boolean, toggle: () => void}) {
    return <button class={cls.mobile_burger} classList={{[cls.opened]: opened()}} onClick={toggle}>
        <span class='visually-hidden'>{!opened ? openMenuText : closeMenuText}</span>
    </button>
}