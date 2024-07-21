import Cookie from "js-cookie";
import {accessCookieName, refreshCookieName} from "../constants/cookies.ts";


const jwtService = {
    setAccessToken: (value: string, expiresAt: Date) => {
        Cookie.set(accessCookieName, value, {
            expires: expiresAt,
            sameSite: 'strict',
        })
    },
    setRefreshToken: (value: string, expiresAt: Date) => {
        Cookie.set(refreshCookieName, value, {
            expires: expiresAt,
            sameSite: 'strict',
        })
    },
    getAccessToken: () => Cookie.get(accessCookieName),
    getRefreshToken: () => Cookie.get(refreshCookieName),
}

export default jwtService;