import React, { useState, useMemo } from 'react'

const sizeFormatter = (size: number) => {
    const kb = 1024;
    const mb = kb * kb;
    const gb = mb * kb;
    if (size < kb) {
        return size + 'B';
    }
    else if (size > kb && size < mb) {
        return Math.round(size / kb) + 'KB';
    }
    else if (size > mb && size < gb) {
        return Math.round(size / mb) + 'MB';
    }
    else {
        return Math.round(size / gb) + 'GB';
    }
}

export function useBitSize(size: number): [string, React.Dispatch<React.SetStateAction<number>>] {
    const [byteSize, setByteSize] = useState(size)
    const formatSize = useMemo<string>(
        () => sizeFormatter(byteSize / 8) + '/s',
        [byteSize]
    )
    return [
        formatSize,
        setByteSize
    ]
}
