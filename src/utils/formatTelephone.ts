import clearDigits from "./clearDigits.ts";

export default function formatTelephone(telephone: string): string {
    const digits = clearDigits(telephone);

    if (digits.length === 11 && digits.startsWith('8')) {
        return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length === 11 && digits.startsWith('7')) {
        return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    } else if (digits.length === 12 && digits.startsWith('380')) {
        return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
    } else if (digits.length === 12 && digits.startsWith('375')) {
        return `+375 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
    } else if (digits.length === 11 && digits.startsWith('7')) {
        return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    }

    return `+${digits}`;
}