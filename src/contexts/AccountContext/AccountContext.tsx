import {createContext, createSignal, JSX, onMount, useContext} from "solid-js";
import profileService from "../../services/profile.service.ts";
import {MyUserProfileType} from "../../types/profile.ts";

export type AccountContextType = {
    isLoading: () => boolean,
    isUnauthorized: () => boolean,
    setIsUnauthorized: (value: boolean) => void,
    profile: () => MyUserProfileType | null,
    logout: () => void,
    login: () => void,
}

const AccountContext = createContext<AccountContextType>();

export function AccountProvider(props: { children: JSX.Element }) {
    const [isLoading, setIsLoading] = createSignal<boolean>(false);
    const [isUnauthorized, setIsUnauthorized] = createSignal<boolean>(false);
    const [profile, setProfile] = createSignal<MyUserProfileType | null>(null);

    const logout = () => {
        setIsUnauthorized(true);
        setProfile(null);
    }
    const login = () => {
        setIsLoading(true);

        const req = async () => {
            const response = await profileService.my();
            if (response?.ok) {
                setProfile(response.profile);
            }
            setIsUnauthorized(false);
        };

        req().then(() => {
            setIsLoading(false);
        });
    }

    onMount(() => {
        login();
    });


    const value: AccountContextType = {
        isLoading,
        isUnauthorized,
        setIsUnauthorized,
        profile,
        logout,
        login
    };

    return <AccountContext.Provider value={value}>
        {props.children}
    </AccountContext.Provider>;
}

export function useAccount() {
    const accountContext = useContext(AccountContext);

    if (!accountContext) {
        throw new Error("<AccountContext> parent not found");
    }

    return accountContext;
}