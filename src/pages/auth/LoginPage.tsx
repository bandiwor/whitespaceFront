import {A, useNavigate} from "@solidjs/router";
import {createSignal, JSX, Show} from "solid-js";
import ShowPasswordButton from "../../components/ui/button/ShowPasswordButton.tsx";
import SubmitButton from "../../components/ui/button/SubmitButton.tsx";
import TextInput from "../../components/ui/input/TextInput.tsx";
import {useAccount} from "../../contexts/AccountContext/AccountContext.tsx";
import {useTempAuth} from "../../contexts/TempAuthContext/TempAuthContext.tsx";
import authService from "../../services/auth.service.ts";
import clearDigits from "../../utils/clearDigits.ts";
import formatTelephone from "../../utils/formatTelephone.ts";
import joinMessageError from "../../utils/joinMessageError.ts";
import cls from "./AuthPage.module.scss";


export default function LoginPage() {
    const tempAuthContext = useTempAuth();
    const temporaryTelephone = tempAuthContext.temporaryTelephone();
    const temporaryPassword = tempAuthContext.temporaryPassword();

    const [formError, setFormError] = createSignal<string>("");
    const [telephone, setTelephone] = createSignal<string>(temporaryTelephone ?? "");
    const [password, setPassword] = createSignal<string>(temporaryPassword ?? "");
    const [isPasswordShow, setIsPasswordShow] = createSignal<boolean>(false);
    const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
    const navigate = useNavigate();
    const account = useAccount();

    const onSubmit = (evt: Event) => {
        evt.preventDefault();
        setIsSubmitting(true);
        setFormError("");

        const request = async () => {
            const data = await authService.login({
                telephone: clearDigits(telephone()),
                password: password(),
            });
            if (data.ok) {
                setFormError("");
                if (data.redirectTo) {
                    switch (data.redirectTo) {
                        case "CREATE-PROFILE":
                            navigate("/auth/create-profile", {
                                replace: true,
                            });
                            break;
                    }
                    return;
                }

                if (!data.access || !data.refresh) {
                    return void setFormError("Токены авторизации не получены от сервера");
                }

                authService.setJwtTokens({
                    refresh: {
                        expires: data.refresh.expires,
                        token: data.refresh.token,
                    },
                    access: {
                        expires: data.access.expires,
                        token: data.access.token,
                    },
                });
                account.login();

                navigate("/", {
                    replace: true,
                });
            } else {
                setFormError(joinMessageError(data.message, ", ", `${data.statusCode} ${data.error}`));
            }
        };

        request().then(() => {
            setIsSubmitting(false);
        });
    };

    const changeTelephone: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setTelephone(formatTelephone(evt.currentTarget.value));
    };
    const changePassword: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setPassword(evt.currentTarget.value);
    };
    const toggleShowPassword = () => {
        setIsPasswordShow(prev => !prev);
    };

    return <main onSubmit={onSubmit} class={cls.wrapper}>
        <form class={cls.form}>
            <h1 class={cls.form__caption}>Логин</h1>
            <div class={cls.form__fields}>
                <Show when={!temporaryPassword}>
                    <TextInput value={telephone} onInput={changeTelephone} name={"telephone"} id={"telephone"}
                               title={"Ваш номер телефона"} placeholder={"Телефон"}/>
                </Show>
                <Show when={!temporaryPassword}>
                    <div class={"relative"}>
                        <TextInput value={password} onChange={changePassword} title={"Ваш пароль"}
                                   placeholder={"Пароль"}
                                   typeCallback={() => isPasswordShow() ? "text" : "password"}/>
                        <ShowPasswordButton onClick={toggleShowPassword} isPasswordShow={isPasswordShow}/>
                    </div>
                </Show>
            </div>
            <SubmitButton disabledCallback={isSubmitting}>
                <Show when={isSubmitting()} fallback={"Войти"}>
                    <div class={cls.form__loading_status}>
                        <div role={"status"} class={cls.form__loading_status_spinner}></div>
                    </div>
                </Show>
            </SubmitButton>
            <Show when={!!formError()}>
                <p class={cls.form__error_text} aria-label={"Ошибка при отправке формы"}
                   title={"Ошибка при отправке формы"}>
                    {formError()}
                </p>
            </Show>
            <div class={cls.form__separator}/>
            <A class={cls.form__alternate_auth} href={"/auth/register"}>Ещё нет аккаунта? <span
                data-alt={""}>Создать</span></A>
        </form>
    </main>;
}