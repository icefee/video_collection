declare interface XmlPagination {
    '@_page': string;
    '@_pagecount': string;
    '@_pagesize': string;
    '@_recordcount': string;
}

declare interface XmlType {
    '#text': string;
    '@_id': string;
}

declare type XmlResponse<T> = {
    rss: {
        list: XmlPagination & {
            video?: T;
        };
        class: {
            ty: XmlType[];
        };
    }
}