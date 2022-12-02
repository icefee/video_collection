import base64 from 'react-native-base64'

export async function jsonBase64<T extends any>(response: Response) {
    const text = await response.text()
    const matchedBase64 = text.match(/[a-zA-Z\d\/\+\=]{100,}/g)
    if (!matchedBase64 && isNextResult(text)) {
        return null;
    }
    return matchedBase64 ? JSON.parse(utf82utf16(base64.decode(matchedBase64[0]))) as T : null;
}

export async function image(response: Response) {
    const text = await response.text()
    const matchedImage = text.match(/https?:\/\/.+?\.((jpe?|pn)g|webp)/g)
    if (matchedImage) {
        return matchedImage[0]
    }
    return null;
}

function isNextResult(html: string) {
    const nextScriptMeta = /<script id=\"__NEXT_DATA__\" type=\"application\/json\">/
    return nextScriptMeta.test(html);
}

export function utf82utf16(source: string) {
    var out, i, len, c;
    var char2, char3;
    out = '';
    len = source.length;
    i = 0;
    while (i < len) {
        c = source.charCodeAt(i++);
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                out += source.charAt(i - 1);
                break;
            case 12: case 13:
                char2 = source.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = source.charCodeAt(i++);
                char3 = source.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
