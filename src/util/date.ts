export function formatDate(dateString: string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const map = new Map();
    const date = new Date(dateString);
    map.set('Y', date.getFullYear())
        .set('M', date.getMonth() + 1)
        .set('D', date.getDate())
        .set('H', date.getHours())
        .set('m', date.getMinutes())
        .set('s', date.getSeconds())
        .set('x', String(date.getMilliseconds()).padStart(3, '0'))
    return format.replace(
        new RegExp('(' + [...Array.from(map.keys())].join('+|') + '+)', 'g'),
        (v, _w, x, y) => String(map.get(y[x])).padStart(v.length, '0')
    )
}

export function timeFormatter(second: number): string {
    const [m, h] = [60, 60 * 60];
    const s = Math.floor(Math.max(0, second));
    return [...(s < h ? [] : [Math.floor(s / h)]), Math.floor((s < h ? s : s % h) / m), Math.round(s % m)].map(
        v => String(v).padStart(2, '0')
    ).join(':')
}
