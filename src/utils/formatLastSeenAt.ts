const prefix = "Был(а) ";
const prefixAtTime = "Был(а) в ";


function getTime(time: Date) {
    return time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
}

function getDateWithoutYear(date: Date) {
    return date.getDate().toString().padStart(2, "0") + "." + date.getMonth().toString().padStart(2, "0");
}

export default function formatLastSeenAt(dateString?: string) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    if ((now.getTime() - date.getTime()) < 5000) {
        return prefix + "только что";
    }
    if (now.getFullYear() !== date.getFullYear()) {
        return prefixAtTime + `${getTime(date)} ${getDateWithoutYear(date)}.${date.getFullYear()}`;
    }
    if (now.getMonth() !== date.getMonth()) {
        return prefixAtTime + `${getTime(date)} ${getDateWithoutYear(date)}`;
    }
    if (now.getDate() === date.getDate()) {
        return prefixAtTime + `сегодня в ${getTime(date)}`
    }
    if (now.getDate() === date.getDate() - 1) {
        return prefixAtTime + `вчера в ${getTime(date)}`
    }
    return prefixAtTime + `${getTime(date)} ${getDateWithoutYear(date)}`
}
