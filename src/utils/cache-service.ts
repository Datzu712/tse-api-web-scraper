// This is just a simple in-memory cache service that can be used to store data in memory. U should look for something like redis or memcached for production use.
class InMemoryCache {
    private cache: Map<string, any>;

    constructor() {
        this.cache = new Map<string, any>();
    }

    set(key: string, value: any): void {
        this.cache.set(key, value);
    }

    get(key: string): any | undefined {
        return this.cache.get(key);
    }

    del(key: string): boolean {
        return this.cache.delete(key);
    }

    exists(key: string): boolean {
        return this.cache.has(key);
    }

    keys(): string[] {
        return Array.from(this.cache.keys());
    }

    flushAll(): void {
        this.cache.clear();
    }
}

export default InMemoryCache;
