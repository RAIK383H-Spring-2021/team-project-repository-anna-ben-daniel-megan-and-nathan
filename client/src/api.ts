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

  public static makeUrl(
    path: string,
    query?: { [key: string]: string | number | boolean }
  ) {
    const q = makeQuery(query);
    return this.base + ("/" + path).replace(/[/]+/g, "/") + q;
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

  private static makeRequest(path: string, body: object, method: string) {
    const url = this.makeUrl(path);
    const data = JSON.stringify(body);

    return fetch(url, {
      method: method,
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.json().catch(() => res.status));
      }
    });
  }

  public static put(path: string, body: object) {
    return this.makeRequest(path, body, "PUT");
  }

  public static post(path: string, body: object) {
    return this.makeRequest(path, body, "POST");
  }

  public static get<T>(
    path: string,
    query?: { [key: string]: string | number | boolean }
  ): Promise<T> {
    const url = this.makeUrl(path, query);

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.json().catch(() => res.status));
      }
    });
  }
}

const ec = encodeURIComponent;

function makeQuery(query?: { [key: string]: string | number | boolean }) {
  if (!query) return "";
  else {
    const str = Object.keys(query)
      .map((key) => `${ec(key)}=${ec(query[key])}`)
      .join("&");
    return `?${str}`;
  }
}
