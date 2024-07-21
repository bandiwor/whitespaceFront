import Cookie from "js-cookie";
import ky from "ky";
import {createProfileUrl, loginUrl, refreshUrl, registerUrl} from "../constants/api.ts";
import {accessCookieName, refreshCookieName} from "../constants/cookies.ts";
import {
    AuthCreateProfileRequestPayload,
    AuthCreateProfileRequestResponse,
    AuthLoginRequestPayload,
    AuthLoginRequestResponse,
    AuthLogoutRequestPayload,
    AuthLogoutRequestResponse,
    AuthRefreshRequestPayload,
    AuthRefreshRequestResponse,
    AuthRegisterRequestPayload,
    AuthRegisterRequestResponse,
    DefaultRequestError,
} from "../constants/requests.ts";
import {handleError} from "./common.ts";


const authService = {
    async login(payload: AuthLoginRequestPayload): Promise<AuthLoginRequestResponse | DefaultRequestError> {
        try {
            const response = await ky(loginUrl, {
                method: "POST",
                json: payload,
            });
            return await response.json<AuthLoginRequestResponse>();

        } catch (e) {
            return handleError(e);
        }
    },
    async register(payload: AuthRegisterRequestPayload): Promise<AuthRegisterRequestResponse | DefaultRequestError> {
        try {
            const response = await ky(registerUrl, {
                method: "POST",
                json: payload,
            });
            return await response.json<AuthRegisterRequestResponse>();

        } catch (e) {
            return await handleError(e) as DefaultRequestError;
        }
    },
    async createProfile(payload: AuthCreateProfileRequestPayload): Promise<AuthCreateProfileRequestResponse | DefaultRequestError> {
        try {
            const response = await ky(createProfileUrl, {
                method: "POST",
                json: payload,
            });
            return await response.json<AuthLoginRequestResponse>();

        } catch (e) {
            return handleError(e);
        }
    },
    async refresh(refreshJwt?: string) {
        const token = refreshJwt || Cookie.get(refreshCookieName);
        if (!token) {
            return null;
        }
        try {
            const response = await ky(refreshUrl, {
                method: "post",
                json: {
                    refreshJWT: token,
                } satisfies AuthRefreshRequestPayload,
            });
            return await response.json<AuthRefreshRequestResponse>();
        } catch (e) {
            return handleError(e);
        }
    },
    async logout(refreshJwt?: string): Promise<boolean> {
        const token = refreshJwt || Cookie.get(refreshCookieName);
        if (!token) {
            return false;
        }
        try {
            const response = await ky(refreshUrl, {
                method: "post",
                json: {
                    refreshJWT: token,
                } satisfies AuthLogoutRequestPayload,
            });
            const body = await response.json<AuthLogoutRequestResponse>();

            Cookie.remove(accessCookieName);
            Cookie.remove(refreshCookieName);

            return body.ok;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    async getLazyUpdatedAccess(): Promise<string | null> {
        const access = Cookie.get(accessCookieName);
        const refresh = Cookie.get(refreshCookieName);

        if (!refresh) {
            return null;
        }
        if (access) {
            return access;
        }

        const refreshResponse = await this.refresh(refresh);
        if (!refreshResponse?.ok) {
            return null;
        }

        this.setJwtTokens(refreshResponse);

        return refreshResponse.access.token;
    },
    setJwtTokens(data: { access: { token: string, expires: string }, refresh: { token: string, expires: string } }) {
        Cookie.set(accessCookieName, data.access.token, {
            expires: new Date(data.access.expires),
            sameSite: "strict",
        });
        Cookie.set(refreshCookieName, data.refresh.token, {
            expires: new Date(data.refresh.expires),
            sameSite: "strict",
        });
    }
};


export default authService;
