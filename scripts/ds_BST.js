export class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export class BST {

    constructor() {
        this.root = null;
    }

    /**
     * Insert a new item into the BST.
     * @param {number} key - Price of the item.
     * @param {any} value - Value associated with the price.
     */
    insert(key, value) {
        const newNode = new Node(key, value);
        if (!this.root) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    /**
     * Helper function to insert a node into the BST.
     * @param {Node} node - Current node.
     * @param {Node} newNode - New node to be inserted.
     */
    insertNode(node, newNode) {
        if (newNode.key < node.key) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    /**
     * Find all items with keys below a specified threshold.
     * @param {number} threshold - Price threshold.
     * @param {Node} [node=this.root] - Current node (default is root).
     * @param {Array<any>} [results=[]] - Accumulated results.
     * @returns {Array<any>} List of items below the threshold.
     */
    searchBelow(threshold, node = this.root, results = []) {
        if (!node) return results;

        if (node.key <= threshold) {
            results.push(node.value);
            this.searchBelow(threshold, node.left, results);
            this.searchBelow(threshold, node.right, results);
        } else {
            this.searchBelow(threshold, node.left, results);
        }
        return results;
    }

    /**
     * Find the item with the minimum key.
     * @param {Node} [node=this.root] - The starting node for traversal. Defaults to the root of the tree if not provided.
     * @returns {Object|null} An object containing the `key` (minimum value) and its associated `value`, or null if the tree is empty.
     */
    findMin(node = this.root) {
        if (!node) return null;
        while (node.left) node = node.left;
        return { key: node.key, value: node.value }; // Return both the minimum key and its associated value
    }

    /**
     * Find the item with the maximum key.
     * @param {Node} [node=this.root] - The starting node for traversal. Defaults to the root of the tree if not provided.
     * @returns {Object|null} An object containing the `key` (maximum value) and its associated `value`, or null if the tree is empty.
     */
    findMax(node = this.root) {
        if (!node) return null;
        while (node.right) node = node.right;
        return { key: node.key, value: node.value }; // Return both the maximum key and its associated value
    }

    /**
     * Delete a specific item from the BST.
     * @param {number} key - Price of the item.
     * @param {any} value - Item to delete.
     */
    delete(key, value) {
        this.root = this.deleteNode(this.root, key, value);
    }

    /**
     * Helper function to delete a node from the BST.
     * @param {Node} node - Current node.
     * @param {number} key - Price of the item.
     * @param {any} value - Item to delete.
     * @returns {Node|null} Updated node after deletion.
     */
    deleteNode(node, key, value) {
        if (!node) return null;

        if (key < node.key) {
            node.left = this.deleteNode(node.left, key, value);
        } else if (key > node.key) {
            node.right = this.deleteNode(node.right, key, value);
        } else if (node.value === value) {
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            const minLargerNode = this.findMin(node.right);
            node.key = minLargerNode.key;
            node.value = minLargerNode.value;
            node.right = this.deleteNode(node.right, minLargerNode.key, minLargerNode.value);
        }
        return node;
    }
}
