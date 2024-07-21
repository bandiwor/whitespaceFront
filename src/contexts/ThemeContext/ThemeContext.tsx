import Cookie from "js-cookie";
import {createContext, createSignal, JSX, onMount, useContext} from "solid-js";
import {themeCookieName} from "../../constants/cookies.ts";
import {MoonIcon, SunIcon, SystemThemeIcon} from "../../icons/SvgIcons.tsx";

export const lightThemeName = "def_lt";
export const darkThemeName = "def_dt";
export const systemThemeName = "def_st";


export const themesList = [lightThemeName, darkThemeName, systemThemeName] as const;

export type ThemeVariantName = typeof lightThemeName | typeof darkThemeName | typeof systemThemeName;

export const themeNameToAttributeRelation = {
    [lightThemeName]: "light",
    [darkThemeName]: "dark",
    [systemThemeName]: "auto",
} as const;

export const themeNameToTitleTextRelation = {
    [lightThemeName]: "Светлая тема. Изменить",
    [darkThemeName]: "Тёмная тема. Изменить",
    [systemThemeName]: "Системная тема. Изменить",
} as const;

export function getThemeFromCookie(def: ThemeVariantName = systemThemeName): ThemeVariantName {
    const value = Cookie.get(themeCookieName) ?? def;
    if (!themesList.includes(value as ThemeVariantName)) {
        return def;
    }
    return value as ThemeVariantName;
}

export function setThemeToCookie(theme: ThemeVariantName) {
    Cookie.set(themeCookieName, theme, {
        sameSite: "lax",
    });
}

type ThemeContextType = {
    currentTheme: () => ThemeVariantName,
    setTheme: (theme: ThemeVariantName) => ThemeVariantName,
    setNextTheme: () => ThemeVariantName,
    themeTitle: () => typeof themeNameToTitleTextRelation[ThemeVariantName],
    themeAttribute: () => typeof themeNameToAttributeRelation[ThemeVariantName],
}

const getNextTheme = (theme: ThemeVariantName) => {
    switch (theme) {
        case lightThemeName:
            return darkThemeName;
        case darkThemeName:
            return systemThemeName;
        case systemThemeName:
            return lightThemeName;
        default:
            return systemThemeName;
    }
};

export const ThemeIcon = ({theme}: { theme: ThemeVariantName }): JSX.Element => {
    switch (theme) {
        case lightThemeName:
            return <SunIcon/>;
        case darkThemeName:
            return <MoonIcon/>;
        case systemThemeName:
            return <SystemThemeIcon/>;
    }
};

export const applyTheme = (theme: ThemeVariantName) => {
    if (theme === darkThemeName) {
        document.documentElement.setAttribute("data-theme", themeNameToAttributeRelation[darkThemeName]);
    } else if (theme === lightThemeName) {
        document.documentElement.setAttribute("data-theme", themeNameToAttributeRelation[lightThemeName]);
    } else {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.setAttribute("data-theme", themeNameToAttributeRelation[darkThemeName]);
        } else {
            document.documentElement.setAttribute("data-theme", themeNameToAttributeRelation[lightThemeName]);
        }
    }
};

const ThemeContext = createContext<ThemeContextType>();

export const ThemeProvider = (props: { children: JSX.Element }) => {
    const [theme, setTheme] = createSignal<ThemeVariantName>(getThemeFromCookie());

    const value: ThemeContextType = {
        currentTheme: theme,
        setNextTheme: (): ThemeVariantName => {
            const newTheme = getNextTheme(theme());
            setTheme(newTheme);
            setThemeToCookie(newTheme);
            applyTheme(newTheme);
            return newTheme;
        },
        setTheme: (newTheme): ThemeVariantName => {
            const oldTheme = theme();
            setTheme(newTheme);
            setThemeToCookie(newTheme);
            applyTheme(newTheme);
            return oldTheme;
        },
        themeTitle: () => {
            return themeNameToTitleTextRelation[theme()];
        },
        themeAttribute: () => {
            return themeNameToAttributeRelation[theme()];
        },
    };

    onMount(() => {
        applyTheme(theme());
    });

    return <ThemeContext.Provider value={value}>
        {props.children}
    </ThemeContext.Provider>;
};

export function useThemeContext() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) {
        throw Error("<ThemeContext> parent not found");
    }

    return themeContext;
}
