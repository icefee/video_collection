
export namespace M3u8 {

    export const test = /\.m3u8$/i;

    export const match = /(https?:\/\/[a-zA-Z0-9\-]+\.)?[\.\/\-_:0-9a-zA-Z]+\.m3u8/ig;

    export function isM3u8(text: string) {
        return /m3u8/i.test(text)
    }

    export function isM3u8Url(url: string) {
        return test.test(url)
    }
}

export namespace Video {

    export const match = /(https?:\/\/[a-zA-Z0-9\-]+\.)?[\.\/\-_:0-9a-zA-Z]+\.(m3u8|mp4|ogg|webm)/ig;
    
    export function isVideoUrl(url: string) {
        return M3u8.isM3u8Url(url) || /\.(mp4|ogg|webm)$/.test(url);
    }
}

export namespace Base64 {

    export const match = /data:image\/(jpe|pn)g;base64,[a-zA-Z\d\/\+\=]+/g;
}
