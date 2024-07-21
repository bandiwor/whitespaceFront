import {A} from "@solidjs/router";
import {createSignal, Show} from "solid-js";
import {useAccount} from "../../contexts/AccountContext/AccountContext.tsx";
import cls from "./HeaderAccount.module.scss";
import HeaderAccountDetails from "./HeaderAccountDetails.tsx";
import HeaderAccountSummary from "./HeaderAccountSummary.tsx";
import HeaderAccountSummaryLoading from "./HeaderAccountSummaryLoading.tsx";


export default function HeaderAccount() {
    const [opened, setOpened] = createSignal(false);
    const account = useAccount();
    const toggleMenu = () => setOpened(!opened());

    return <div class={cls.account}>
        <Show when={!account.isLoading()} fallback={<HeaderAccountSummaryLoading/>}>
            <Show when={account.profile()} fallback={<A href={"/auth/login"} class={cls.login_button}>Войти</A>}>
                <HeaderAccountSummary data={account.profile} opened={opened} toggle={toggleMenu}/>
                <HeaderAccountDetails data={account.profile} opened={opened} toggle={toggleMenu}/>
            </Show>
        </Show>
    </div>;
}
