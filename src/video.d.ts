declare type M3u8Video = Array<number | string> | string

declare interface Section {
    section: string;
    series: Video[]
}

declare interface Episode {
    title: string;
    episodes: number;
    url_template?: string;
    m3u8_list: M3u8Video[];
}

declare interface Film {
    title: string;
    m3u8_url: string;
}

declare type Video = Episode | Film

interface TvSource {
    url: string;
    cors?: boolean;
    parse?: boolean;
}

declare interface TVChannel {
    id: number;
    title: string;
    source: TvSource | TvSource[];
}

declare interface SearchVideo {
    key: string;
    name: string;
    rating: number;
    data: VideoListItem[];
    page: ResponsePagination;
}

declare interface ResponsePagination {
    page: number;
    pagecount: number;
    pagesize: number;
    recordcount: number;
}

declare interface VideoListItem {
    id: number;
    name: string;
    note: string;
    last: string;
    dt: string;
    tid: number;
    type: string;
}

declare interface VideoType {
    tid: string;
    tname: string;
}

declare interface VideoItem {
    label: string;
    url: string;
}

declare interface VideoSource {
    name: string;
    urls: VideoItem[];
}

declare interface VideoInfo {
    name: string;
    note: string;
    pic: string;
    type: string;
    year: string;
    actor?: string;
    area?: string;
    des: string;
    director?: string;
    lang: string;
    last: string;
    state: number;
    tid: number;
    dataList: VideoSource[];
}

declare interface ApiSource {
    key: string;
    name: string;
    rating: number;
    api: string;
    needDecode?: boolean;
    jiexiUrl: string;
    group: 'normal' | '18+';
}

declare interface ApiJsonTypeSuccess<T = unknown> {
    code: 0;
    data: T;
    msg: string;
}

declare interface ApiJsonTypeFail {
    code: -1;
    data: null;
    msg: string;
}

declare type ApiJsonType<T> = ApiJsonTypeSuccess<T> | ApiJsonTypeFail;
