import {userProfileImageFallback} from "../../constants/images.ts";
import {MyUserProfileType} from "../../types/profile.ts";
import cls from "./HeaderAccount.module.scss";

const openAccountMenuText: string = "Открыть меню аккаунта";
const closeAccountMenuText: string = "Закрыть меню аккаунта";

export default function HeaderAccountSummary({opened, toggle, data}: {
    data: () => MyUserProfileType | null,
    opened: () => boolean,
    toggle: () => void
}) {
    const buttonTitle = () => opened() ? closeAccountMenuText : openAccountMenuText;

    return <button class={cls.summary} title={buttonTitle()} onClick={toggle} classList={{[cls.opened]: opened()}}>
        <span class={"visually-hidden"}>{buttonTitle()}</span>
        <span class={cls.summary__label}>{data()?.firstName}</span>
        <img class={cls.summary__image} width={33} height={33} src={userProfileImageFallback} alt=""/>
    </button>;
}