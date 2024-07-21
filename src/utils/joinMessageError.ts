export default function joinMessageError(error?: string | string[], divider?: string | null, default_: string='') {
    if (error) {
        if (Array.isArray(error)) {
            return error.join(divider ?? ' ');
        }
        return error;
    } else {
        return default_;
    }
}