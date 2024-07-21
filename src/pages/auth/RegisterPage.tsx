import {A, useNavigate} from "@solidjs/router";
import {createSignal, JSX, Match, Show, Switch} from "solid-js";
import ShowPasswordButton from "../../components/ui/button/ShowPasswordButton.tsx";
import SubmitButton from "../../components/ui/button/SubmitButton.tsx";
import TextInput from "../../components/ui/input/TextInput.tsx";
import {getTelegramBotStartLink} from "../../constants/api.ts";
import {useTempAuth} from "../../contexts/TempAuthContext/TempAuthContext.tsx";
import authService from "../../services/auth.service.ts";
import clearDigits from "../../utils/clearDigits.ts";
import formatTelephone from "../../utils/formatTelephone.ts";
import joinMessageError from "../../utils/joinMessageError.ts";
import cls from "./AuthPage.module.scss";


export default function RegisterPage() {
    const [formError, setFormError] = createSignal<string>("");
    const [telephone, setTelephone] = createSignal<string>("");
    const [password, setPassword] = createSignal<string>("");
    const [isPasswordShow, setIsPasswordShow] = createSignal<boolean>(false);
    const [confirmPassword, setConfirmPassword] = createSignal<string>("");
    const [showButtonType, setShowButtonType] = createSignal<"REGISTER" | "OPEN-TELEGRAM-BOT">("REGISTER");
    const [code, setCode] = createSignal<string>("");
    const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
    const tempAuth = useTempAuth();

    const navigate = useNavigate();

    const onSubmit = (evt: Event) => {
        evt.preventDefault();
        if (password() !== confirmPassword()) {
            return void setFormError("Введённые пароли не совпадают");
        }
        setFormError('');
        setIsSubmitting(true);

        const request = async () => {
            const data = await authService.register({
                telephone: clearDigits(telephone()), password: password(),
            });
            if (data.ok) {
                setCode(data.code);
                setFormError("");
                setShowButtonType("OPEN-TELEGRAM-BOT");
            } else {
                setFormError(joinMessageError(data.message, ", ", `${data.statusCode} ${data.error}`));
            }
        };

        request().then(() => setIsSubmitting(false));
    };

    const onOpenTelegramBotClick = () => {
        setTimeout(() => {
            tempAuth.setTemporaryTelephone(telephone());
            tempAuth.setTemporaryPassword(password());
            navigate("/auth/create-profile", {
                replace: true,
            });
        }, 1000);
    };

    const changeTelephone: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setTelephone(formatTelephone(evt.currentTarget.value));
    };
    const changePassword: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setPassword(evt.currentTarget.value);
        if (isPasswordShow()) {
            setConfirmPassword(evt.currentTarget.value);
        }
    };
    const changeConfirmPassword: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setConfirmPassword(evt.currentTarget.value);
    };
    const toggleShowPassword = () => {
        setIsPasswordShow(prev => !prev);
    };


    return <main onSubmit={onSubmit} class={cls.wrapper}>
        <form class={cls.form}>
            <h1 class={cls.form__caption}>Регистрация</h1>
            <div class={cls.form__fields}>
                <TextInput value={telephone} onInput={changeTelephone} name={"telephone"} id={"telephone"}
                           title={"Ваш номер телефона"} placeholder={"Телефон"}/>
                <div class={"relative"}>
                    <TextInput value={password} onChange={changePassword} title={"Ваш пароль"} placeholder={"Пароль"}
                               typeCallback={() => isPasswordShow() ? "text" : "password"}/>
                    <ShowPasswordButton onClick={toggleShowPassword} isPasswordShow={isPasswordShow}/>
                </div>
                <Show when={!isPasswordShow()}>
                    <TextInput value={confirmPassword} onChange={changeConfirmPassword} title={"Подтвердите пароль"}
                               placeholder={"Подтвердите пароль"} type={"password"}/>
                </Show>
            </div>
            <Switch>
                <Match when={showButtonType() === "REGISTER"}>
                    <SubmitButton disabledCallback={isSubmitting}>
                        <Show when={isSubmitting()} fallback={"Войти"}>
                            <div class={cls.form__loading_status}>
                                <div role={"status"} class={cls.form__loading_status_spinner}></div>
                            </div>
                        </Show>
                    </SubmitButton>
                </Match>
                <Match when={showButtonType() === "OPEN-TELEGRAM-BOT"}>
                    <A target={"_blank"} onClick={onOpenTelegramBotClick} href={getTelegramBotStartLink(code())}
                       class={cls.open_telegram_bot}>
                        Открыть <span data-alt="" lang={"en"}>Telegram</span> Бот
                    </A>
                </Match>
            </Switch>
            <Show when={!!formError()}>
                <p class={cls.form__error_text} aria-label={"Ошибка при отправке формы"}
                   title={"Ошибка при отправке формы"}>
                    {formError()}
                </p>
            </Show>
            <div class={cls.form__separator}/>
            <A class={cls.form__alternate_auth} href={"/auth/login"}>Уже есть аккаунт? <span
                data-alt={""}>Войти</span></A>
        </form>
    </main>;
}