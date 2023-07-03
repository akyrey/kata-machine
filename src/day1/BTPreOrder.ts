function walk(curr: BinaryNode<number> | null, path: number[]): number[] {
    // Base case since we are at a leaf
    if (!curr) {
        return path;
    }

    // Recursion
    // pre
    path.push(curr.value);
    // recurse
    walk(curr.left, path);
    walk(curr.right, path);
    // post

    return path;
}

export default function pre_order_search(head: BinaryNode<number>): number[] {
    return walk(head, []);
}
