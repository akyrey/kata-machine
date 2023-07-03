export default function bs_list(haystack: number[], needle: number): boolean {
    // const middleIndex: number = Math.floor(haystack.length / 2);

    // if (haystack[middleIndex] > needle) {
    //     return bs_list(haystack.slice(0, middleIndex), needle);
    // }

    // if (haystack[middleIndex] < needle) {
    //     return bs_list(haystack.slice(middleIndex + 1), needle);
    // }

    // return haystack[middleIndex] === needle;
    let low: number = 0;
    let high: number = haystack.length;

    do {
        const middleIndex: number = Math.floor(low + (high - low) / 2);
        if (haystack[middleIndex] === needle) {
            return true;
        }
        if (haystack[middleIndex] > needle) {
            high = middleIndex;
        } else {
            low = middleIndex + 1;
        }
    } while (high > low);

    return false;
}
