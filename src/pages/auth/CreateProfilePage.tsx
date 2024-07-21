import {A, useNavigate} from "@solidjs/router";
import {createSignal, createUniqueId, JSX, Show} from "solid-js";
import ShowPasswordButton from "../../components/ui/button/ShowPasswordButton.tsx";
import SubmitButton from "../../components/ui/button/SubmitButton.tsx";
import TextInput from "../../components/ui/input/TextInput.tsx";
import {useTempAuth} from "../../contexts/TempAuthContext/TempAuthContext.tsx";
import authService from "../../services/auth.service.ts";
import clearDigits from "../../utils/clearDigits.ts";
import formatDateOfBirth from "../../utils/formatDateOfBirth.ts";
import formatTelephone from "../../utils/formatTelephone.ts";
import joinMessageError from "../../utils/joinMessageError.ts";
import cls from "./AuthPage.module.scss";

export default function CreateProfilePage() {
    const tempAuth = useTempAuth();
    const temporaryTelephone = tempAuth.temporaryTelephone();
    const temporaryPassword = tempAuth.temporaryPassword();

    const [formError, setFormError] = createSignal<string>("");
    const [telephone, setTelephone] = createSignal<string>(formatTelephone(temporaryTelephone || ""));
    const [password, setPassword] = createSignal<string>(temporaryPassword || "");
    const [firstName, setFirstName] = createSignal<string>("");
    const [lastName, setLastName] = createSignal<string>("");
    const [gender, setGender] = createSignal<"MALE" | "FEMALE" | null>(null);
    const [username, setUsername] = createSignal<string>("");
    const [dateOfBirth, setDateOfBirth] = createSignal<string>("");
    const [isPasswordShow, setIsPasswordShow] = createSignal<boolean>(false);
    const [isSubmitting, setIsSubmitting] = createSignal<boolean>(false);
    const genderSelectId = createUniqueId();
    const navigate = useNavigate();

    const onSubmit = (evt: Event) => {
        evt.preventDefault();
        const sex = gender();
        let birthDate: Date | null = null;

        if (!sex || !["MALE", "FEMALE"].includes(sex)) {
            return void setFormError("Укажите пол");
        }
        if (dateOfBirth()) {
            const date = dateOfBirth();
            const split = date.split(".");
            if (split.length !== 3 || split[2].length !== 4) {
                return void setFormError("Дата рождения указана неверно. Пример 04.05.2002 (4 мая 2002 г)");
            }
            const day = +split[0];
            const month = +split[1];
            const year = +split[2];

            birthDate = new Date(year, month - 1, day, 12);
            if (isNaN(birthDate.getTime()) || birthDate.getTime() > Date.now() || birthDate.getFullYear() < 1920) {
                return void setFormError("Дата рождения указана неверно. Пример 04.05.2002 (4 мая 2002 г)");
            }
        }

        setFormError("");
        setIsSubmitting(true);

        const request = async () => {
            const data = await authService.createProfile({
                telephone: clearDigits(telephone()),
                password: password(),
                gender: sex,
                username: username() ? username() : undefined,
                dateOfBirth: birthDate ? birthDate.toISOString() : undefined,
                firstName: firstName(),
                lastName: lastName(),
            });
            if (data.ok) {
                setFormError("");
                tempAuth.setTemporaryTelephone(telephone());
                tempAuth.setTemporaryPassword(password());
                navigate("/auth/login", {
                    replace: true,
                });
            } else {
                setFormError(joinMessageError(data.message, ", ", `${data.statusCode} ${data.error}`));
            }
        };

        request().then(() => setIsSubmitting(false));
    };

    const changeTelephone: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setTelephone(formatTelephone(evt.currentTarget.value));
    };

    const changePassword: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setPassword(evt.currentTarget.value);
    };
    const changeFirstName: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setFirstName(evt.currentTarget.value);
    };
    const changeLastName: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setLastName(evt.currentTarget.value);
    };
    const changeUsername: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setUsername(evt.currentTarget.value);
    };
    const changeDateOfBirth: JSX.ChangeEventHandler<HTMLInputElement, Event> = (evt) => {
        setDateOfBirth(formatDateOfBirth(evt.currentTarget.value));
    };
    const toggleShowPassword = () => {
        setIsPasswordShow(prev => !prev);
    };

    return <main onSubmit={onSubmit} class={cls.wrapper}>
        <form class={cls.form}>
            <h1 class={cls.form__caption}>Создание профиля</h1>
            <div class={cls.form__fields}>
                <Show when={!temporaryTelephone}>
                    <TextInput value={telephone} title={"Ваш телефон"} onInput={changeTelephone} placeholder={"Телефон"}
                               name={"telephone"} id={"telephone"}/>
                </Show>
                <TextInput value={firstName} title={"Ваше имя"} onChange={changeFirstName} placeholder={"Имя"}
                           name={"firstName"} id={"firstName"}/>
                <TextInput value={lastName} title={"Ваша фамилия"} onChange={changeLastName} placeholder={"Фамилия"}
                           name={"lastName"} id={"lastName"}/>
                <div class={cls.gender}>
                    <label class={cls.gender__caption} for={genderSelectId}>Выберите пол</label>
                    <div role={"radiogroup"} class={cls.gender__select} aria-labelledby={genderSelectId}>
                        <button role={"radio"} aria-selected={gender() === "FEMALE"} class={cls.gender__select_button}
                                onClick={() => setGender("FEMALE")}
                                classList={{[cls.female_active]: gender() === "FEMALE"}} type={"button"}>Женщина
                        </button>
                        <button role={"radio"} aria-selected={gender() === "FEMALE"} class={cls.gender__select_button}
                                onClick={() => setGender("MALE")}
                                classList={{[cls.male_active]: gender() === "MALE"}}
                                type={"button"}>Мужчина
                        </button>
                    </div>
                </div>
                <TextInput value={username} title={"Юзер-нейм (Опционально)"} onChange={changeUsername}
                           placeholder={"Юзер-нейм (Опционально)"} name={"username"} id={"username"}/>
                <TextInput value={dateOfBirth} title={"Ваша дата рождения"} onInput={changeDateOfBirth}
                           placeholder={"Дата рождения ДД.ММ.ГГГГ"} name={"dateOfBirth"} id={"dateOfBirth"}/>
                <Show when={!temporaryPassword}>
                    <div class={"relative"}>
                        <TextInput value={password} title={"Ваш пароль"}
                                   typeCallback={() => isPasswordShow() ? "text" : "password"} onChange={changePassword}
                                   placeholder={"Пароль"}/>
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
                <p tabIndex={0} class={cls.form__error_text} aria-label={"Ошибка при отправке формы"}
                   title={"Ошибка при отправке формы"}>
                    {formError()}
                </p>
            </Show>
            <div class={cls.form__separator}/>
            <A class={cls.form__alternate_auth} href={"/auth/login"}>Впервые здесь? <span
                data-alt={""}>Войти</span></A>
        </form>
    </main>;
}