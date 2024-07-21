import {HTTPError} from "ky";

const unknownError = "Unknown error";

export async function handleError(e: unknown) {
    if (e instanceof HTTPError) {
        const data: {
            message: string | string[],
            error: string,
            statusCode: number,
        } = await e.response.json();

        return {
            ok: false,
            ...data,
        } as const;
    }
    return {
        ok: false,
        error: unknownError,
        statusCode: 0,
        message: unknownError,
    } as const;
}
