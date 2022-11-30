declare module 'react-native-base64' {

    interface Base64 {
        encode: (source: string) => string;
        decode: (source: string) => string;
        encodeFromByteArray: (byteArray: Uint8Array) => string;
    }

    var base64: Base64;

    export default base64;

}