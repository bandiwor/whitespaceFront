import {createSignal} from "solid-js";
import MobileBurgerMenu from "./MobileBurgerMenu.tsx";
import MobileMenuOverlay from "./MobileMenuOverlay.tsx";

export default function MobileMenu() {
    const [menuOpened, setMenuOpened] = createSignal<boolean>(false);
    let mobileMenuRef: HTMLDialogElement | undefined;

    const toggleMenu = () => {
        setMenuOpened((prevOpened) => {
            if (prevOpened) {
                mobileMenuRef?.close();
            } else {
                mobileMenuRef?.showModal();
            }
            return !prevOpened;
        })
    }

    return <>
        <MobileBurgerMenu opened={menuOpened} toggle={toggleMenu} />
        <MobileMenuOverlay ref={mobileMenuRef} toggle={toggleMenu} />
    </>
}