type Node<T> = {
    value: T;
    next?: Node<T>;
    prev?: Node<T>;
};

function createNode<V>(value: V): Node<V> {
    return { value };
}

// Least Recently Used - used in caching
// It uses a doubly linked list under the hood but also an hash map to be able to access to an element directly
// HashMap<K, V> where V represents a node of the doubly linked list
// O(1) for HashMap access
// 7 operation each O(1) to reposition a node from inside the doubly linked list to the head of it
export default class LRU<K, V> {
    private length: number;
    private head?: Node<V>;
    private tail?: Node<V>;

    private lookup: Map<K, Node<V>>;
    private reverseLookup: Map<Node<V>, K>;

    constructor(private capacity: number = 10) {
        this.length = 0;
        this.head = this.tail = undefined;
        this.lookup = new Map<K, Node<V>>();
        this.reverseLookup = new Map<Node<V>, K>();
    }

    update(key: K, value: V): void {
        // Does it exist?
        let node = this.lookup.get(key);
        if (!node) {
            node = createNode(value);
            this.length++;
            this.prepend(node);
            this.trimCache();

            this.lookup.set(key, node);
            this.reverseLookup.set(node, key);
        } else {
            this.detach(node);
            this.prepend(node);
            // update the value just in case it changed
            node.value = value;
        }

        // If it doesn't, we need to insert it
        //    - check capacity and evict if over
        // If it does, we need to update to the front of the list and update the value
    }

    get(key: K): V | undefined {
        // Check the cache for existence
        const node = this.lookup.get(key);
        if (!node) {
            return undefined;
        }

        // Update the value we found and move it to the front
        this.detach(node);
        this.prepend(node);

        // Return out the value found or undefined if not exists
        return node.value;
    }

    private detach(node: Node<V>): void {
        if (node.prev) {
            // Point previous to next one
            node.prev.next = node.next;
        }

        if (node.next) {
            // Point next to previous
            node.next.prev = node.prev;
        }

        if (this.head === node) {
            this.head = this.head.next;
        }

        if (this.tail === node) {
            this.tail = this.tail.prev;
        }

        node.next = undefined;
        node.prev = undefined;
    }

    private prepend(node: Node<V>): void {
        if (!this.head) {
            this.head = this.tail = node;
            return;
        }

        node.next = this.head;
        this.head.prev = node;
        this.head = node;
    }

    private trimCache(): void {
        if (this.length <= this.capacity) {
            return;
        }

        const tail = this.tail as Node<V>;
        // We know since we checked length above
        this.detach(tail);

        const key = this.reverseLookup.get(tail) as K;
        this.lookup.delete(key);
        this.reverseLookup.delete(tail);
        this.length--;
    }
}
