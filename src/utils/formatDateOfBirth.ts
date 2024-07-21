export default function formatDateOfBirth(dateString: string): string {
    const digits = dateString.replace(/\D/g, "");
    const digitsLen = digits.length;

    if (digitsLen === 1) {
        if (+digits[0] >= 4) {
            return `0${digits[0]}.`;
        }
        return digits;
    }
    if (digitsLen === 2) {
        return `${digits}.`;
    }
    if (digitsLen === 3) {
        const day = (digits[0] + digits[1]);

        if (+digits[2] >= 2) {
            return day + `.0${digits[2]}.`;
        }
        return day + `.${digits[2]}`;
    }

    return dateString;
}