import { Search as SearchConfig } from './config';
import { XML } from './xml';
import { M3u8 } from './RegExp';

type XmlDataNode<T> = T | T[];

type SearchQuery = {
    wd: string;
    prefer?: boolean;
}

function checkVideoValid(video: VideoListItem) {
    return video.name.indexOf('未授权') === -1 && !video.type.match(
        new RegExp('(' + SearchConfig.blackTypeList.join('|') + ')')
    );
}

async function requestApi(url: string) {
    const REQUEST_TIMEOUT = 4.5e3;
    console.log('💖 start request: ' + url)
    const abortController = new AbortController();
    return new Promise<Response>(
        (resolve, reject) => {
            const timeout = setTimeout(() => {
                console.log('💔 request: ' + url + ' timeout.')
                abortController.abort()
                // reject(new Error('timeout'));
            }, REQUEST_TIMEOUT);
            fetch(url, {
                signal: abortController.signal
            }).then(resolve, err => reject(err)).finally(
                () => clearTimeout(timeout)
            );
        }
    )
}

export async function getSearch(api: string, wd: string, pg = 1, t?: number) {
    let apiUrl = `${api}?wd=${encodeURIComponent(String(wd))}&pg=${pg}`;
    if (t) {
        apiUrl += '&t=' + t;
    }
    try {
        const xml = await requestApi(apiUrl).then(response => response.text())
        const { rss: { list: { video, ...xmlPage }, class: { ty } } } = XML.parse(xml) as XmlResponse<XmlDataNode<VideoListItem>>;
        const types = ty.map<VideoType>(
            t => ({
                tid: t['@_id'],
                tname: t['#text']
            })
        )
        const page: ResponsePagination = {
            page: parseInt(xmlPage['@_page']),
            pagecount: parseInt(xmlPage['@_pagecount']),
            pagesize: parseInt(xmlPage['@_pagesize']),
            recordcount: parseInt(xmlPage['@_recordcount']),
        }
        if (video) {
            if (Array.isArray(video)) {
                const revisedVideoList = video.map(
                    ({ name, ...rest }) => ({
                        name: String(name),
                        ...rest
                    })
                )
                if (revisedVideoList.some(item => !checkVideoValid(item))) {
                    return null
                }
                return {
                    page,
                    video: revisedVideoList,
                    types
                }
            }
            else {
                const revisedVideo = {
                    ...video,
                    name: String(video.name)
                };
                if (checkVideoValid(revisedVideo)) {
                    return {
                        page,
                        video: [revisedVideo],
                        types
                    }
                }
            }
        }
        return {
            page,
            video: [],
            types
        }
    }
    catch (err) {
        console.warn(`request ${api} failed.`)
    }
    return null
}

export async function getSearchResult(sources: ApiSource[], { wd, prefer }: SearchQuery) {
    return new Promise<SearchVideo[]>(
        async (resolve) => {
            const result: SearchVideo[] = [];

            let sourceList = sources;
            // let isTimeout = false;
            let isResolved = false;

            const startTime = Date.now();
            const timeoutDuration = 9e3;
            // const checkIntervalDuration = 200;

            sourceList = sources.filter(({ group }) => {
                const include = group === '18+';
                if (prefer) {
                    return include;
                }
                return !include;
            });

            const timeout = setTimeout(() => {
                //isTimeout = true;
                isResolved = true;
                console.log('❌ timeout and exit.')
                resolve(result)
            }, timeoutDuration);

            const batch = 12;
            let requestTimes = 0;

            const limit = 20;

            for (let i = 0, l = sourceList.length; i <= Math.floor((l / batch)); i++) {
                /*
                if (isTimeout) {
                    break;
                }
                */
                // let { key, name, api } of
                try {
                    // let from = start + y * thread,
                    // to = Math.min(end, start + (y + 1) * thread - 1);
                    await Promise.all(
                        sourceList.slice(
                            i * batch,
                            Math.min(l, (i + 1) * batch)
                        ).map(
                            async ({ key, name, rating, api }) => {
                                const data = await getSearch(api, wd);
                                requestTimes++;
                                if (data) {
                                    const { page, video } = data;
                                    if (video.length > 0) {
                                        result.push({
                                            key,
                                            name,
                                            rating,
                                            page,
                                            data: video
                                        })
                                    }
                                    const restTime = timeoutDuration - Date.now() + startTime;
                                    console.log(`💚 rest time = ${restTime}`)
                                    if (restTime < 2e3 || requestTimes >= limit) {
                                        isResolved = true;
                                        resolve(result.sort((prev, next) => next.rating - prev.rating));
                                    }
                                }
                            }
                        )
                    )
                }
                catch (e) {
                    continue;
                }
                if (isResolved) {
                    break;
                }
            }
            if (!isResolved) {
                clearTimeout(timeout);
                // clearInterval(interval)
                resolve(result);
            }
        }
    )
}

export async function getVideoDetail(sources: ApiSource[], api: string, id: number) {
    const apiUrl = sources.find(
        ({ key }) => key === api
    )
    if (apiUrl) {
        try {
            const response = await fetch(apiUrl.api + '?ac=videolist&ids=' + id).then(
                response => response.text()
            );

            const data = XML.parse(response) as XmlResponse<VideoInfo & { dl: { dd: XmlDataNode<Record<string, string>> } }>;
            const { dl: { dd }, ...rest } = data.rss.list.video!;
            let dataList = [];

            const parser = (url: string) => {
                if (apiUrl.needDecode) {
                    return apiUrl.jiexiUrl + url
                }
                return url;
            }

            if (Array.isArray(dd)) {
                dataList = dd.map(
                    di => parseDataList(di, parser)
                ).sort(
                    (prev, next) => Number(M3u8.isM3u8(next.name)) - Number(M3u8.isM3u8(prev.name))
                )
            }
            else {
                dataList = [parseDataList(dd, parser)];
            }
            return {
                ...rest,
                dataList
            };
        }
        catch (e) {
            return null;
        }
    }
    return null;
}

function parseDataList(data: Record<string, string>, parser: (url: string) => string) {
    const name = data['@_flag']
    const text = data['#text']
    const urls = text.split('#').filter(
        item => item !== ''
    ).map(item => {
        const seperator = '$';
        if (item.indexOf(seperator) === -1 && M3u8.isM3u8Url(item)) {
            return {
                label: '正片',
                url: parser(item)
            }
        }
        else {
            const cnt = item.split('$')
            return {
                label: cnt[0],
                url: parser(cnt[1])
            }
        }
    })
    return {
        name,
        urls
    }
}
