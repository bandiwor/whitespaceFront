export default function formatMessageTime(time: string): string {
    const date = new Date(time);
    const now = new Date();

    if (date.getFullYear() !== now.getFullYear()) {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().slice(2)}`;
    }
    if (date.getMonth() !== now.getMonth()) {
        return `${date.getDate()}.${date.getMonth()}`;
    }
    if (date.getDate() === now.getDate()) {
        return `${date.getHours()}:${date.getMinutes()}`;
    }
    if (date.getDate() === now.getDate() - 1) {
        return `Вчера в ${date.getHours()}:${date.getMinutes()}`;
    }
    return `${date.getDate().toString().padStart(2, '0')}.${date.getMonth() + 1}`;
}