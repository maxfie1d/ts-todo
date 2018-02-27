const s = "0123456789abcdef";

export function generateId(): string {
    return new Array(6).fill(0).map(_ => s[Math.floor(Math.random() * s.length)]).join("");
}
