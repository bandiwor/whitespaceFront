import {createContext, createSignal, JSX, useContext} from "solid-js";
import formatTelephone from "../../utils/formatTelephone.ts";

type TempAuthContextType = {
    temporaryTelephone: () => string | null;
    setTemporaryTelephone: (telephone: string) => void;
    temporaryPassword: () => string | null;
    setTemporaryPassword: (password: string) => void;
    clearAuthData: () => void;
};

const TempAuthContext = createContext<TempAuthContextType>();
export const tempVarExpires = () => new Date(Date.now() + 3_000);

export const TempAuthProvider = (props: { children: JSX.Element }) => {
    const [temporaryTelephone_, setTemporaryTelephone_] = createSignal<[string, Date] | null>(null);
    const [temporaryPassword_, setTemporaryPassword_] = createSignal<[string, Date] | null>(null);

    const clearAuthData = () => {
        setTemporaryTelephone_(null);
        setTemporaryPassword_(null);
    };

    const value: TempAuthContextType = {
        temporaryTelephone: () => {
            const telephone = temporaryTelephone_();
            if (telephone === null || telephone[1] < new Date()) {
                return null;
            }
            return telephone[0];
        },
        temporaryPassword: () => {
            const password = temporaryPassword_();
            if (password === null || password[1] < new Date()) {
                return null;
            }
            return password[0];
        },

        setTemporaryTelephone: (telephone) => {
            setTemporaryTelephone_([formatTelephone(telephone), tempVarExpires()]);
        },
        setTemporaryPassword: (password) => {
            setTemporaryPassword_([password, tempVarExpires()]);
        },
        clearAuthData,
    };

    return (<TempAuthContext.Provider value={value}>
        {props.children}
    </TempAuthContext.Provider>);
};

export function useTempAuth() {
    const context = useContext(TempAuthContext);
    if (!context) {
        throw Error("<TempAuthContext> parent not found");
    }
    return context;
}
