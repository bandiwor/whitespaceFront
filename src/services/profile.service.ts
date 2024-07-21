import ky from "ky";
import {myProfileUrl} from "../constants/api.ts";
import {MyProfileResponse} from "../constants/requests.ts";
import authService from "./auth.service.ts";
import {handleError} from "./common.ts";

const profileService = {
    async my() {
        const access = await authService.getLazyUpdatedAccess();
        if (!access) return null;

        try {
            const response = await ky(myProfileUrl, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });
            return await response.json<MyProfileResponse>();

        } catch (e) {
            return await handleError(e);
        }
    },
};

export default profileService;