import { XMLParser } from 'fast-xml-parser'

export namespace XML {
    export function parse(xml: string): object {
        const parser = new XMLParser({
            ignoreAttributes: false
        });
        return parser.parse(xml, {
            allowBooleanAttributes: true,
        });
    }
}
