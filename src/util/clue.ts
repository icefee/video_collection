import base64 from 'react-native-base64'

type VideoClue = {
    api: string;
    id: string | number;
}

abstract class ParamText {

    public static special = '/'
    public static escape = '_'

    public static parse(text: string) {
        return text.replace(ParamText.escape, ParamText.special)
    }

    public static create(text: string) {
        return text.replace(ParamText.special, ParamText.escape)
    }
}

export abstract class Base64Params {

    public static parse(text: string): string | null {
        try {
            return base64.decode(ParamText.parse(text) + '='.repeat(4 - text.length % 4))
        }
        catch (err) {
            return null
        }
    }

    public static create(text: string): string {
        return ParamText.create(base64.encode(text)).replace(/\={1,2}$/, '')
    }
}

export abstract class Clue {

    public static parse(text: string): VideoClue | null {
        const origin = Base64Params.parse(text)
        if (origin !== null) {
            const [api, id] = origin.split('|')
            return {
                api,
                id
            }
        }
        return null
    }

    public static create(api: VideoClue['api'], id: VideoClue['id']): string {
        return Base64Params.create(`${api}|${id}`)
    }
}