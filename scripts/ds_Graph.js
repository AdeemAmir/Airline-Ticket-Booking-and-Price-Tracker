export class Graph {
    constructor() {
        this.routes = {}; // Adjacency list to represent graph routes
    }

    /**
     * Add a route to the graph.
     * @param {string} origin - Starting city.
     * @param {string} destination - Destination city.
     * @param {number} cost - Price of the flight.
     */
    addRoute(origin, destination, cost) {
        if (!this.routes[origin]) this.routes[origin] = [];
        this.routes[origin].push({ destination, cost });
    }

    /**
     * Remove a route from the graph.
     * @param {string} origin - Starting city.
     * @param {string} destination - Destination city.
     */
    removeRoute(origin, destination) {
        if (this.routes[origin]) {
            this.routes[origin] = this.routes[origin].filter(city => city !== destination);
            if (this.routes[origin].length === 0) delete this.routes[origin];
        }
    }

    /**
     * Get all destinations from a specific origin.
     * @param {string} origin - Starting city.
     * @returns {Array<string>} List of destination cities.
     */
    getRoutes(origin) {
        return this.routes[origin] || [];
    }

    /**
     * Get all routes in the graph.
     * @returns {Array<Array<string>>} List of all routes.
     */
    getAllRoutes() {
        const allRoutes = [];
        for (const origin in this.routes) {
            this.routes[origin].forEach(destination => {
                allRoutes.push([origin, destination]);
            });
        }
        return allRoutes;
    }

    /**
     * Find all possible paths between two cities.
     * @param {string} start - Starting city.
     * @param {string} end - Destination city.
     * @param {Array<string>} [path=[]] - Current path (used internally for recursion).
     * @returns {Array<Array<string>>} List of all paths.
     */
    findAllPaths(start, end, path = [], visited = new Set()) {
        visited.add(start);
        path.push(start);
        if (start === end) {
            return [path]; 
        }
        const paths = [];
        const neighbors = this.getRoutes(start);
    
        //console.log(`Checking city: ${start} with neighbors:`, neighbors);
        neighbors.forEach(neighbor => {
            const destination = neighbor.destination;
            if (!visited.has(destination)) {
                const newPaths = this.findAllPaths(destination, end, path.slice(), new Set(visited));
                newPaths.forEach(p => {
                    if (!paths.some(existingPath => existingPath.join(' -> ') === p.join(' -> '))) {
                        paths.push(p);
                    }
                });
            }
        });
    
        return paths;
    }
    

    /**
     * Find the cheapest path between two cities using Dijkstra's algorithm.
     * @param {string} start - Starting city.
     * @param {string} end - Destination city.
     * @returns {Object} The cheapest path and its total cost.
     */
    findCheapestPath(start, end) {
        const costs = {};
        const parents = {};
        const processed = new Set();
    
        for (const node in this.routes) {
            costs[node] = node === start ? 0 : Infinity;
            parents[node] = null;
        }
    
        let node = this.findLowestCostNode(costs, processed);
    
        while (node) {
            const cost = costs[node];
            const neighbors = this.getRoutes(node);
    
            neighbors.forEach(neighbor => {
                const newCost = cost + neighbor.cost;
                if (newCost < costs[neighbor.destination]) {
                    costs[neighbor.destination] = newCost;
                    parents[neighbor.destination] = node;
                }
            });
    
            processed.add(node);
            node = this.findLowestCostNode(costs, processed);
        }
    
        if (costs[end] === Infinity) {
            return { path: [], cost: undefined };
        }
    
        const path = [];
        let currentNode = end;
        while (currentNode) {
            path.unshift(currentNode);
            currentNode = parents[currentNode];
        }
    
        return { path, cost: costs[end] };
    }

    /**
     * Helper function to find the lowest cost unprocessed node.
     * @param {Object} costs - Current costs of nodes.
     * @param {Set<string>} processed - Processed nodes.
     * @returns {string|null} Node with the lowest cost.
     */
    findLowestCostNode(costs, processed) {
        return Object.keys(costs)
            .filter(node => !processed.has(node))
            .reduce((lowest, node) =>
                lowest === null || costs[node] < costs[lowest] ? node : lowest, null);
    }

}
