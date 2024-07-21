import {A, useNavigate} from "@solidjs/router";
import {userProfileImageFallback} from "../../constants/images.ts";
import {useAccount} from "../../contexts/AccountContext/AccountContext.tsx";
import authService from "../../services/auth.service.ts";
import {MyUserProfileType} from "../../types/profile.ts";
import cls from "./HeaderAccount.module.scss";

export default function HeaderAccountDetails({opened, toggle, data}: {
    data: () => MyUserProfileType | null,
    opened: () => boolean,
    toggle: () => void
}) {
    const account = useAccount();
    const navigate = useNavigate();

    const link = () => {
        return data()?.username || data()?.id;
    };
    const handleLogout = () => {
        authService.logout().then(() => {
            account.logout();
            navigate('/auth/login');
        })
    }

    return <div class={cls.details} classList={{"hidden": !opened()}}>
        <div class={cls.details__wrapper}>
            <img class={cls.img} src={userProfileImageFallback} alt="" width={60} height={60}/>
            <A onClick={toggle} href={`/${link()}`} class={cls.title}>{data()?.firstName} {data()?.lastName}</A>
            <ul class={cls.list}>
                <li><A onClick={toggle} class={cls.link} href={"#"}>Настройки</A></li>
                <li><A onClick={toggle} class={cls.link} href={"#"}>Помощь</A></li>
                <li><A onClick={toggle} class={cls.link} href={"#"}>Тех-поддержка</A></li>
                <li><A onClick={toggle} class={cls.link} href={"#"}>Сотрудничество</A></li>
            </ul>
            <button onClick={handleLogout} class={cls.logout_button}>Выйти</button>
        </div>
    </div>;
}