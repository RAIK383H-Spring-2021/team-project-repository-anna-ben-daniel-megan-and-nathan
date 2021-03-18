interface CacheItem {
  data: unknown;
  expires: number;
}

export class API {
  private static base = "";
  private static cache = new Map<string, CacheItem>();

  public static init(base: string) {
    this.base = base;

    const cache = localStorage.getItem("cache");
    if (cache) {
      this.cache = new Map(JSON.parse(cache).cache as [string, CacheItem][]);
    }
  }

  public static makeUrl(path: string) {
    return this.base + ("/" + path).replace(/[/]+/g, "/");
  }

  public static setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public static getToken() {
    return localStorage.getItem("token");
  }

  public static setCacheItem(url: string, data: unknown) {
    // don't include searches since they may change frequently
    if (!url.includes("?")) {
      this.cache.set(url, { data, expires: Date.now() + 1.728e8 });
      queueMicrotask(() =>
        localStorage.setItem(
          "cache",
          JSON.stringify({ cache: [...this.cache] })
        )
      );
    }
  }

  public static getCacheItem(url: string) {
    const cached = this.cache.get(url);
    if (cached) {
      if (cached.expires > Date.now()) {
        return cached.data;
      }
    }
  }
}
